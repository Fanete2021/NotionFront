import { ProjectHeader } from '@widgets/ProjectHeader';
import styles from './ProjectWorkspace.module.css';

type ProjectWorkspaceProps = {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  onCommentsClick?: () => void;
};

export const ProjectWorkspace = ({ children, sidebar, onCommentsClick }: ProjectWorkspaceProps) => {
  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <ProjectHeader onCommentsClick={onCommentsClick} />
        <div className={styles.content}>{children}</div>
      </div>
      {sidebar}
    </div>
  );
};
