import styles from './DemoHeader.module.css';
import classNames from "classnames";
import {Typography} from "@shared/ui/Typography";

export const DemoHeader = () => {
  return (
    <header className={styles.header}>
      <ul className={styles.markers}>
        <li className={classNames(styles.marker, styles.red)}></li>
        <li className={classNames(styles.marker, styles.yellow)}></li>
        <li className={classNames(styles.marker, styles.green)}></li>
      </ul>
      <ul className={styles.tabs}>
        <li className={classNames(styles.tab, styles.active)}>
          <Typography className={styles.tabContent}
                      variant="text-regular"
          >
            📐 Дизайн-система
          </Typography>
        </li>
        <li className={styles.tab}>
          <Typography className={styles.tabContent}
                      variant="text-regular"
          >
            🗺️ Roadmap
          </Typography>
        </li>
      </ul>
    </header>
  );
};

