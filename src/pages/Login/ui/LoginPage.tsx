import {LoginPromo} from "@/widgets";
import {LoginPanel} from "@/widgets";
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  return (
    <div className={styles.container}>
      <LoginPromo/>
      <LoginPanel/>
    </div>
  );
};

