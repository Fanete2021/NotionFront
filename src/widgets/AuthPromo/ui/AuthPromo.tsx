import styles from './AuthPromo.module.css';
import { AuthSectionHeader } from "@shared/ui/AuthSectionHeader";
import { AuthAdvantages } from "./AuthAdvantages/AuthAdvantages";
import { AppDemo } from "./AppDemo/AppDemo";

export const AuthPromo = () => {
  return (
    <section className={styles.promo}>
      <div className={styles.content}>
        <AuthSectionHeader
          title='Ваш второй мозг, для команд.'
          description='Современное пространство для заметок, проектов и совместной работы. Создано с мыслью о простоте.'
          variant='promo'
        />
        <AuthAdvantages/>
        <AppDemo/>
      </div>
    </section>
  );
};

