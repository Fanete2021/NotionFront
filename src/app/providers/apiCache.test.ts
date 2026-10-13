import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { projectApi } from '@/entities/project/api/projectApi';
import { workspaceInviteApi } from '@/entities/workspace-invite/api/workspaceInviteApi';
import { workspaceMembersApi } from '@/entities/workspace-members/api/workspaceMembersApi';
import { pageApi } from '@/entities/page/api/pageApi';
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
    reducer: { [baseApi.reducerPath]: baseApi.reducer },
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
        projectApi.endpoints.updateProject.initiate({ id: 'project', data: { name: 'Updated' } }),
      );
      await vi.waitFor(() =>
        expect(count('getProjectsByWorkspace', '/workspaces/a/projects')).toBe(2),
      );
      expect(count('getProjectsByWorkspace', '/workspaces/b/projects')).toBe(1);
      await store.dispatch(
        projectApi.endpoints.deleteProject.initiate({ id: 'project', workspaceId: 'a' }),
      );
      await vi.waitFor(() =>
        expect(count('getProjectsByWorkspace', '/workspaces/a/projects')).toBe(3),
      );
      expect(count('getProjectsByWorkspace', '/workspaces/b/projects')).toBe(1);
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
        data: { type: 'TEMPORARY' as const, role: 'VIEWER' as const },
      };
      await store.dispatch(workspaceInviteApi.endpoints.createWorkspaceInvite.initiate(args));
      await vi.waitFor(() => expect(count('getWorkspaceInvites', '/workspaces/a/invites')).toBe(2));
      expect(count('getWorkspaceInvites', '/workspaces/b/invites')).toBe(1);
      failedEndpoints.add('createWorkspaceInvite');
      await store.dispatch(workspaceInviteApi.endpoints.createWorkspaceInvite.initiate(args));
      expect(count('getWorkspaceInvites', '/workspaces/a/invites')).toBe(2);
      expect(count('getWorkspaceInvites', '/workspaces/b/invites')).toBe(1);
    } finally {
      store.dispatch(baseApi.util.resetApiState());
    }
  });

  it('refreshes page versions after a successful save, but not after a rejected save', async () => {
    const store = createStore();
    try {
      await store.dispatch(pageApi.endpoints.getPageVersions.initiate('page'));
      await store.dispatch(pageApi.endpoints.updatePageContent.initiate({ id: 'page', json: {} }));
      await vi.waitFor(() => expect(count('getPageVersions')).toBe(2));
      failedEndpoints.add('updatePageContent');
      await store.dispatch(pageApi.endpoints.updatePageContent.initiate({ id: 'page', json: {} }));
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
});
