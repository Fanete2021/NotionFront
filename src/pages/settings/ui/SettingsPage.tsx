'use client';

import { useState } from 'react';
import styles from './SettingsPage.module.css';
import { SettingsNav, settingsNavItems, SettingsSection } from '@/widgets/settings-nav';
import { SettingsProfile } from '@/widgets/settings-profile';
import { Typography } from '@/shared/ui/Typography';

export function SettingsPage() {
  const [section, setSection] = useState<SettingsSection>('profile');

  const activeItem = settingsNavItems.find((item) => item.id === section);

  return (
    <main className={styles.page}>
      <SettingsNav active={section} onSelect={setSection} />

      <div className={styles.content}>
        {section === 'profile' ? (
          <SettingsProfile />
        ) : (
          <section className={styles.stub}>
            <Typography variant="text-alt" className={styles.stubTitle}>
              {activeItem?.title}
            </Typography>
            <Typography variant="text-regular" className={styles.stubDescription}>
              Раздел находится в разработке.
            </Typography>
          </section>
        )}
      </div>
    </main>
  );
}
