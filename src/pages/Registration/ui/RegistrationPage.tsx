import styles from './RegistrationPage.module.css';
import {RegistrationPromo} from "@/widgets";
import {RegistrationPanel} from "@/widgets";

export const RegistrationPage = () => {
  return (
    <div className={styles.container}>
      <RegistrationPromo/>
      <RegistrationPanel/>
    </div>
  );
};
