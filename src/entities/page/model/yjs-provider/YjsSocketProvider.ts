import * as Y from 'yjs';
import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
  removeAwarenessStates,
} from 'y-protocols/awareness';
import type { Socket } from 'socket.io-client';
import type { UserPageData } from '../page.types';

const toUint8 = (value: unknown): Uint8Array | null => {
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (Array.isArray(value)) return new Uint8Array(value);

  if (
    value !== null &&
    typeof value === 'object' &&
    (value as { type?: unknown }).type === 'Buffer' &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return new Uint8Array((value as { data: number[] }).data);
  }

  if (typeof value === 'string') {
    try {
      const binary = atob(value);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    } catch {
      return null;
    }
  }
  return null;
};

interface PageJoinAck {
  ok: boolean;
  users: UserPageData[];
  canEdit: boolean;
  error?: string;
}

export interface YjsSocketProviderOptions {
  socket: Socket;
  pageId: string;
  user?: { name: string; color: string } | null;
}

export class YjsSocketProvider {
  readonly doc: Y.Doc;

  readonly awareness: Awareness;

  private readonly socket: Socket;

  private readonly pageId: string;

  private readonly cleanup: Array<() => void> = [];

  private synced = false;

  private destroyed = false;

  private canEditValue = false;

  private readonly canEditListeners = new Set<(value: boolean) => void>();

  constructor({ socket, pageId, user }: YjsSocketProviderOptions) {
    this.socket = socket;
    this.pageId = pageId;
    this.doc = new Y.Doc();
    this.awareness = new Awareness(this.doc);

    const handleLocalUpdate = (update: Uint8Array, origin: unknown): void => {
      if (this.destroyed) return;
      if (origin === 'remote') return;
      this.socket.emit('yjs:update', { pageId, update: Array.from(update) });
    };

    const handleRemoteUpdate = (payload: { pageId: string; update: unknown }): void => {
      if (this.destroyed) return;
      if (!payload || payload.pageId !== this.pageId) return;

      const update = toUint8(payload.update);
      if (!update) {
        console.warn('[YjsSocketProvider] toUint8 FAIL', payload.update);
        return;
      }

      Y.applyUpdate(this.doc, update, 'remote');
      this.synced = true;
    };

    const handleLocalAwareness = (
      changes: { added: number[]; updated: number[]; removed: number[] },
      origin: unknown,
    ): void => {
      if (this.destroyed) return;
      if (origin === 'remote' || origin === 'server') return;

      const clients = [...changes.added, ...changes.updated, ...changes.removed];
      const update = encodeAwarenessUpdate(this.awareness, clients);
      this.socket.emit('yjs:awareness', { pageId, update: Array.from(update) });
    };

    const handleRemoteAwareness = (payload: { pageId: string; update: unknown }): void => {
      if (this.destroyed) return;
      if (!payload || payload.pageId !== this.pageId) return;

      const update = toUint8(payload.update);
      if (!update) return;

      applyAwarenessUpdate(this.awareness, update, 'remote');
    };

    const handleSync = (payload: { pageId: string; update: unknown }): void => {
      handleRemoteUpdate(payload);
    };
    const handleUpdate = (payload: { pageId: string; update: unknown }): void => {
      handleRemoteUpdate(payload);
    };
    const handleAwareness = (payload: { pageId: string; update: unknown }): void => {
      handleRemoteAwareness(payload);
    };

    this.doc.on('update', handleLocalUpdate);
    this.awareness.on('update', handleLocalAwareness);
    this.socket.on('yjs:sync', handleSync);
    this.socket.on('yjs:update', handleUpdate);
    this.socket.on('yjs:awareness', handleAwareness);

    this.cleanup.push(() => {
      this.doc.off('update', handleLocalUpdate);
      this.awareness.off('update', handleLocalAwareness);
      this.socket.off('yjs:sync', handleSync);
      this.socket.off('yjs:update', handleUpdate);
      this.socket.off('yjs:awareness', handleAwareness);
    });

    if (user) {
      this.awareness.setLocalStateField('user', {
        name: user.name,
        color: user.color,
      });
    }

    this.socket.emit('page:join', { pageId }, (response: PageJoinAck | null) => {
      if (this.destroyed) return;
      if (!response?.ok) {
        console.warn('[YjsSocketProvider] page:join rejected', response);
        return;
      }
      this.setCanEdit(response.canEdit ?? false);
    });
  }

  get isSynced(): boolean {
    return this.synced;
  }

  get canEdit(): boolean {
    return this.canEditValue;
  }

  onCanEditChange(listener: (value: boolean) => void): () => void {
    if (this.destroyed) {
      listener(this.canEditValue);
      return () => {};
    }

    this.canEditListeners.add(listener);
    listener(this.canEditValue);
    return () => {
      this.canEditListeners.delete(listener);
    };
  }

  private setCanEdit(value: boolean): void {
    if (this.destroyed) return;
    this.canEditValue = value;
    for (const listener of this.canEditListeners) {
      listener(value);
    }
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;

    if (this.socket.connected) {
      this.socket.emit('page:leave', { pageId: this.pageId }, () => {});
    }

    try {
      removeAwarenessStates(this.awareness, [this.doc.clientID], 'server');
    } catch {
      // awareness мог быть уже уничтожен другим вызовом destroy
    }

    for (const off of this.cleanup) {
      try {
        off();
      } catch {
        // игнорируем: слушатель мог быть снят раньше
      }
    }
    this.cleanup.length = 0;

    this.canEditListeners.clear();

    try {
      this.awareness.destroy();
    } catch {
      // ignore
    }

    try {
      this.doc.destroy();
    } catch {
      // ignore
    }
  }
}
