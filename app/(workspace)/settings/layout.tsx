import { ReactNode } from 'react';
import styles from '@/app/layout.module.css';
import { SettingsNav } from '@/widgets/settings/nav';

const SettingsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.settingsLayout}>
      <SettingsNav />
      <div className={styles.settingsContent}>{children}</div>
    </div>
  );
};

export default SettingsLayout;
