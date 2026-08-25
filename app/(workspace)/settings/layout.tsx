import { ReactNode } from 'react';
import styles from '@/app/layout.module.css';
import { SettingsProfileNav } from '@/widgets/settings-profile';

const SettingsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.settingsLayout}>
      <SettingsProfileNav />
      <div className={styles.settingsContent}>{children}</div>
    </div>
  );
};

export default SettingsLayout;
