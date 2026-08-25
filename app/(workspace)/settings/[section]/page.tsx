import { notFound } from 'next/navigation';
import styles from '@/app/layout.module.css';
import { settingsNavItems } from '@/widgets/settings/nav';
import { Typography } from '@/shared/ui/Typography';

interface SettingsSectionRouteProps {
  params: Promise<{ section: string }>;
}

export default async function SettingsSectionRoute({ params }: SettingsSectionRouteProps) {
  const { section } = await params;
  const navItem = settingsNavItems.find((item) => item.id === section);

  if (!navItem) {
    notFound();
  }

  return (
    <main className={styles.content}>
      <Typography variant="text-alt">{navItem.title}</Typography>
      <Typography variant="text-regular">Раздел находится в разработке.</Typography>
    </main>
  );
}
