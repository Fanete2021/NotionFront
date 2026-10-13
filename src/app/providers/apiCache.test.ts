import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loginApi } from '@/features/login/api/loginApi';
import { registerApi } from '@/features/registration/api/registerApi';
import { trashApi } from '@/entities/trash/api/trashApi';
import { projectApi } from '@/entities/project/api/projectApi';
import { workspaceInviteApi } from '@/entities/workspace-invite/api/workspaceInviteApi';
import { workspaceMembersApi } from '@/entities/workspace-members/api/workspaceMembersApi';
import { pageApi } from '@/entities/page/api/pageApi';
import { workspaceApi } from '@/entities/workspace/api/workspaceApi';
import { currentWorkspaceReducer, setCurrentWorkspace } from '@/entities/workspace';
import { sessionReducer, setAccessToken } from '@/shared/api';
import { baseApi } from '@/shared/api';

const { request, failedEndpoints } = vi.hoisted(() => ({
  request: vi.fn(),
  failedEndpoints: new Set<string>(),
}));

vi.mock('@/shared/api/baseQueryWithReauth', () => ({
  baseQueryWithReauth: request,
}));

const createStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      session: sessionReducer,
      currentWorkspace: currentWorkspaceReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });

const count = (endpoint: string, url?: string) =>
  request.mock.calls.filter(
    ([args, api]) => api.endpoint === endpoint && (!url || args.url === url),
  ).length;

describe('API cache synchronization', () => {
  beforeEach(() => {
    failedEndpoints.clear();
    request.mockReset();
    request.mockImplementation(async (args, api) => {
      if (failedEndpoints.has(api.endpoint)) return { error: { status: 403, data: {} } };
      if (api.endpoint === 'getProjectsByWorkspace') return { data: [] };
      if (api.endpoint === 'getWorkspaceInvites') return { data: [] };
      if (api.endpoint === 'getWorkspaceMembers') return { data: [] };
      if (api.endpoint === 'getWorkspaces') return { data: [] };
      if (api.endpoint === 'getPagesByWorkspace' || api.endpoint === 'getTrashedPages')
        return { data: [] };
      if (api.endpoint === 'redeemWorkspaceInvite') return { data: { workspaceId: 'a' } };
      if (api.endpoint === 'login' || api.endpoint === 'register') {
        return {
          data: { accessToken: 'new-token', user: { id: 'new-user', email: 'new@example.com' } },
        };
      }
      if (api.endpoint === 'getPageVersions') return { data: { items: [], nextCursor: null } };
      if (api.endpoint === 'updateProject') return { data: { id: 'project', workspaceId: 'a' } };
      return { data: {} };
    });
  });

  it('refreshes only the affected project list after update and delete, including empty lists', async () => {
    const store = createStore();
    try {
      await store.dispatch(projectApi.endpoints.getProjectsByWorkspace.initiate('a'));
      await store.dispatch(projectApi.endpoints.getProjectsByWorkspace.initiate('b'));
      await store.dispatch(
        projectApi.endpoints.updateProject.initiate({ id: 'project', body: { name: 'Updated' } }),
      );
      await vi.waitFor(() =>
        expect(count('getProjectsByWorkspace', 'workspaces/a/projects')).toBe(2),
      );
      expect(count('getProjectsByWorkspace', 'workspaces/b/projects')).toBe(1);
      await store.dispatch(
        projectApi.endpoints.deleteProject.initiate({ id: 'project', workspaceId: 'a' }),
      );
      await vi.waitFor(() =>
        expect(count('getProjectsByWorkspace', 'workspaces/a/projects')).toBe(3),
      );
      expect(count('getProjectsByWorkspace', 'workspaces/b/projects')).toBe(1);
    } finally {
      store.dispatch(baseApi.util.resetApiState());
    }
  });

  it('keeps invitation lists in other workspaces cached and does not invalidate after failure', async () => {
    const store = createStore();
    try {
      await store.dispatch(workspaceInviteApi.endpoints.getWorkspaceInvites.initiate('a'));
      await store.dispatch(workspaceInviteApi.endpoints.getWorkspaceInvites.initiate('b'));
      const args = {
        workspaceId: 'a',
        body: { type: 'TEMPORARY' as const, role: 'VIEWER' as const },
      };
      await store.dispatch(workspaceInviteApi.endpoints.createWorkspaceInvite.initiate(args));
      await vi.waitFor(() => expect(count('getWorkspaceInvites', 'workspaces/a/invites')).toBe(2));
      expect(count('getWorkspaceInvites', 'workspaces/b/invites')).toBe(1);
      failedEndpoints.add('createWorkspaceInvite');
      await store.dispatch(workspaceInviteApi.endpoints.createWorkspaceInvite.initiate(args));
      expect(count('getWorkspaceInvites', 'workspaces/a/invites')).toBe(2);
      expect(count('getWorkspaceInvites', 'workspaces/b/invites')).toBe(1);
    } finally {
      store.dispatch(baseApi.util.resetApiState());
    }
  });

  it('refreshes page versions after a successful save, but not after a rejected save', async () => {
    const store = createStore();
    try {
      await store.dispatch(pageApi.endpoints.getPageVersions.initiate('page'));
      await store.dispatch(pageApi.endpoints.updatePageContent.initiate({ id: 'page', body: {} }));
      await vi.waitFor(() => expect(count('getPageVersions')).toBe(2));
      failedEndpoints.add('updatePageContent');
      await store.dispatch(pageApi.endpoints.updatePageContent.initiate({ id: 'page', body: {} }));
      expect(count('getPageVersions')).toBe(2);
    } finally {
      store.dispatch(baseApi.util.resetApiState());
    }
  });

  it('passes requiresAuth to the base query for workspace members', async () => {
    const store = createStore();
    try {
      await store.dispatch(workspaceMembersApi.endpoints.getWorkspaceMembers.initiate('a'));
      expect(request.mock.calls[0][2]).toEqual({ requiresAuth: true });
    } finally {
      store.dispatch(baseApi.util.resetApiState());
    }
  });

  it('refreshes only the trash after permanently deleting already trashed pages', async () => {
    const store = createStore();
    try {
      await store.dispatch(pageApi.endpoints.getPagesByWorkspace.initiate({ workspaceId: 'a' }));
      await store.dispatch(trashApi.endpoints.getTrashedPages.initiate({ workspaceId: 'a' }));
      await store.dispatch(trashApi.endpoints.emptyTrash.initiate('a'));
      await vi.waitFor(() => expect(count('getTrashedPages')).toBe(2));
      expect(count('getPagesByWorkspace')).toBe(1);
    } finally {
      store.dispatch(baseApi.util.resetApiState());
    }
  });

  it('limits invitation redemption invalidation to the returned workspace', async () => {
    const store = createStore();
    try {
      await store.dispatch(workspaceInviteApi.endpoints.getWorkspaceInvites.initiate('a'));
      await store.dispatch(workspaceInviteApi.endpoints.getWorkspaceInvites.initiate('b'));
      await store.dispatch(workspaceMembersApi.endpoints.getWorkspaceMembers.initiate('a'));
      await store.dispatch(workspaceMembersApi.endpoints.getWorkspaceMembers.initiate('b'));
      await store.dispatch(workspaceApi.endpoints.getWorkspaces.initiate());
      await store.dispatch(
        workspaceInviteApi.endpoints.redeemWorkspaceInvite.initiate({ body: { token: 'invite' } }),
      );
      await vi.waitFor(() => expect(count('getWorkspaces')).toBe(2));
      expect(count('getWorkspaceInvites', 'workspaces/a/invites')).toBe(2);
      expect(count('getWorkspaceInvites', 'workspaces/b/invites')).toBe(1);
      expect(count('getWorkspaceMembers', 'workspaces/a/members')).toBe(2);
      expect(count('getWorkspaceMembers', 'workspaces/b/members')).toBe(1);
    } finally {
      store.dispatch(baseApi.util.resetApiState());
    }
  });

  it.each(['login', 'register'] as const)(
    'clears the previous user cache after %s succeeds',
    async (endpoint) => {
      const store = createStore();
      try {
        store.dispatch(setAccessToken('old-token'));
        store.dispatch(setCurrentWorkspace('old-workspace'));
        await store.dispatch(projectApi.endpoints.getProjectsByWorkspace.initiate('old-workspace'));
        expect(Object.keys(store.getState().api.queries)).toHaveLength(1);
        if (endpoint === 'login') {
          await store.dispatch(
            loginApi.endpoints.login.initiate({
              body: { email: 'new@example.com', password: 'password', rememberMe: false },
            }),
          );
        } else {
          await store.dispatch(
            registerApi.endpoints.register.initiate({
              body: { email: 'new@example.com', password: 'password', name: 'New user' },
            }),
          );
        }
        await vi.waitFor(() => expect(Object.keys(store.getState().api.queries)).toHaveLength(0));
        expect(store.getState().session.accessToken).toBe('new-token');
        expect(store.getState().currentWorkspace.id).toBeNull();
      } finally {
        store.dispatch(baseApi.util.resetApiState());
      }
    },
  );
});
