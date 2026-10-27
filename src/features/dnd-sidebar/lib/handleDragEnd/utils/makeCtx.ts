import { vi, type Mock } from 'vitest';
import type { DragTargets } from '../../../model/types';
import type {
  HandleDragEndContext,
  ReorderProjectsTrigger,
  ReorderPagesTrigger,
  UpdatePageTrigger,
  UpdateProjectTrigger,
} from '../types';
import type { Project } from '@/entities/project';
import type { Page } from '@/shared/const/pageType';

export const makeProject = (o: Partial<Project> & Pick<Project, 'id' | 'name'>): Project => ({
  workspaceId: 'workspace-1',
  parentProjectId: null,
  color: null,
  icon: null,
  position: 0,
  childProjects: [],
  createdAt: '2026-10-06T00:00:00.000Z',
  updatedAt: '2026-10-06T00:00:00.000Z',
  ...o,
});

export const makePage = (o: Partial<Page> & Pick<Page, 'id' | 'title'>): Page => ({
  workspaceId: 'workspace-1',
  projectId: null,
  parentPageId: null,
  icon: null,
  type: 'DOC',
  authorId: 'author-1',
  updatedById: null,
  position: 0,
  createdAt: '2026-10-06T00:00:00.000Z',
  updatedAt: '2026-10-06T00:00:00.000Z',
  ...o,
});

// eslint-disable-next-line
const makeTrigger = <T extends (...args: any[]) => any>(): Mock<T> => {
  const unwrap = vi.fn().mockResolvedValue(undefined);
  return vi.fn(() => ({ unwrap })) as unknown as Mock<T>;
};

const emptyTargets: DragTargets = {
  activeProject: undefined,
  overProject: undefined,
  activePage: undefined,
  overPage: undefined,
  targetProject: undefined,
  isOverRoot: false,
  isOverOutdent: false,
  outdentProject: undefined,
};

export interface MakeCtxOverrides {
  targets?: Partial<DragTargets>;
  localProjects?: Project[];
  localPages?: Page[];
  serverProjects?: Project[];
  serverPages?: Page[];
  droppedId?: string;
}

export interface MockedCtx extends Omit<
  HandleDragEndContext,
  'reorderProjects' | 'reorderPages' | 'updatePage' | 'updateProject'
> {
  reorderProjects: Mock<ReorderProjectsTrigger>;
  reorderPages: Mock<ReorderPagesTrigger>;
  updatePage: Mock<UpdatePageTrigger>;
  updateProject: Mock<UpdateProjectTrigger>;
}

export const makeCtx = (overrides: MakeCtxOverrides = {}): MockedCtx => ({
  event: { active: { id: 'a' }, over: { id: 'b' } } as never,
  currentWorkspaceId: 'workspace-1',
  localProjects: overrides.localProjects ?? [],
  localPages: overrides.localPages ?? [],
  serverProjects: overrides.serverProjects ?? [],
  serverPages: overrides.serverPages ?? [],
  setLocalProjects: vi.fn(),
  setLocalPages: vi.fn(),
  reorderProjects: makeTrigger<ReorderProjectsTrigger>(),
  reorderPages: makeTrigger<ReorderPagesTrigger>(),
  updatePage: makeTrigger<UpdatePageTrigger>(),
  updateProject: makeTrigger<UpdateProjectTrigger>(),
  scheduleActiveIdReset: vi.fn(),
  droppedId: overrides.droppedId ?? 'a',
  targets: { ...emptyTargets, ...overrides.targets },
});
