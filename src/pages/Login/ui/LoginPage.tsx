import {AuthPromo} from "@widgets/AuthPromo";
import {AuthPanel} from "@widgets/AuthPanel";
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  return (
    <div className={styles.container}>
      <AuthPromo/>
      <AuthPanel/>
    </div>
  );
};

