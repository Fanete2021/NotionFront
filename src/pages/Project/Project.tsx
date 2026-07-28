import { Typography } from '@shared/ui/Typography';
import styles from './Project.module.css';
import { ProjectHeader } from '@widgets/ProjectHeader';

export const ProjectPage = () => {
  return (
    <>
    <ProjectHeader />
    <main className={styles.main}>
      <Typography variant="h1">
        Дизайн-система — Компоненты
      </Typography>
      <Typography variant="caption">
        Последнее изменение: Алекс Ким · 2 часа назад
      </Typography>

      <Typography variant="h2">Обзор</Typography>
      <Typography variant="text-regular">
        Здесь собраны базовые UI-компоненты дизайн-системы: кнопки, поля ввода и типографика.
      </Typography>

      <Typography variant="h2">Кнопки</Typography>
      <Typography variant="text-regular">
        Кнопка — основной элемент действий. Варианты: primary, secondary и ghost.
      </Typography>
    </main>
    </>
  )
};
