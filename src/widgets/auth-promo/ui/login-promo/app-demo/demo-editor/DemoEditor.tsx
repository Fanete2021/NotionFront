import classNames from 'classnames';
import styles from './DemoEditor.module.css';
import { Typography } from '@shared/ui/Typography';
import { Checkbox } from '@shared/ui/Checkbox';
import { Avatar } from '@shared/ui/Avatar';

export const DemoEditor = () => {
  return (
    <div className={styles.editorCard}>
      <Typography className={styles.title} variant="h3">
        Компоненты UI
      </Typography>
      <Typography variant="text-regular" className={classNames(styles.lastEdited, styles.bold)}>
        Последнее изменение: Алекс К. · 2 часа назад
      </Typography>
      <ul className={styles.tasks}>
        <li className={classNames(styles.task, styles.taskChecked)}>
          <Checkbox className={styles.checkbox} labelClassName={styles.checkboxLabel}>
            Описать все варианты кнопок и состояния
          </Checkbox>
        </li>
        <li className={styles.task}>
          <Checkbox className={styles.checkbox} labelClassName={styles.checkboxLabel}>
            Описать все варианты кнопок и состояния
          </Checkbox>
        </li>
      </ul>
      <div className={styles.editorsWrapper}>
        <ul className={styles.editors}>
          <Avatar className={styles.avatarItem} name="Никита Беляев" size="sm" />
          <Avatar className={styles.avatarItem} name="Никита Беляев" size="sm" />
        </ul>
        <Typography className={classNames(styles.editorCount, styles.bold)} variant="text-medium">
          2 человека редактируют сейчас
        </Typography>
      </div>
    </div>
  );
};
