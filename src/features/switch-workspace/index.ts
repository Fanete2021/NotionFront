export { WorkspaceModal } from './ui/WorkspaceModal';
export { WorkspaceSwitcher } from './ui/WorkspaceSwitcher';
export { CreateWorkspaceModal } from './ui/CreateWorkspaceModal/CreateWorkspaceModal';
export { workspaceModalsReducer } from './model/workspaceModalsSlice';
export type { WorkspaceModalsState } from './model/workspaceModalsSlice';
export {
  openCreateWorkspaceModal,
  closeCreateWorkspaceModal,
  openEditWorkspaceModal,
  closeEditWorkspaceModal,
} from './model/workspaceModalsSlice';
