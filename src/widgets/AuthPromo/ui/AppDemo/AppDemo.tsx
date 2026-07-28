import styles from './AppDemo.module.css';
import { DemoHeader } from './DemoHeader/DemoHeader';
import {DemoEditor} from "@widgets/AuthPromo/ui/AppDemo/DemoEditor/DemoEditor";

export const AppDemo = () => {
  return (
    <section className={styles.demo}>
      <DemoHeader/>
      <DemoEditor/>
    </section>
  );
};

