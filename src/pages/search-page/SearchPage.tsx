import styles from './SearchPage.module.css';
import { WorkspaceSearch } from '@/widgets/workspace-content-search-panel';

export const SearchPage = () => {
  return (
    <main className={styles.page}>
      <WorkspaceSearch />
    </main>
  );
};
