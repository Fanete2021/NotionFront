import styles from './SearchPage.module.css';
import { WorkspaceSearch } from '@widgets/workspace-search';

export const SearchPage = () => {
  return (
    <main className={styles.page}>
      <WorkspaceSearch />
    </main>
  );
};
