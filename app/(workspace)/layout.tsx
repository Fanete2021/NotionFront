import styles from '@/app/layout.module.css';
import { AuthGuard } from '@/app/providers/AuthGuard';
import { Sidebar } from '@widgets/sidebar';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.content}>{children}</div>
      </div>
    </AuthGuard>
  );
}
