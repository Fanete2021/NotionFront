import styles from './AppDemo.module.css';
import { DemoHeader } from './demo-header/DemoHeader';
import {DemoEditor} from "./demo-editor/DemoEditor";

export const AppDemo = () => {
  return (
    <section className={styles.demo}>
      <DemoHeader/>
      <DemoEditor/>
    </section>
  );
};

