import styles from './LoginPromo.module.css';
import {AuthSectionHeader} from "@features/Auth";
import {PromoAdvantages} from "@widgets/AuthPromo/ui/PromoAdvantages/PromoAdvantages";
import {AppDemo} from "../AppDemo/AppDemo";

export const LOGIN_ADVANTAGES = [
  'Блочный редактор с богатым контентом',
  'Realtime совместное редактирование',
  'Встроенный ИИ-ассистент',
] as const;

export const LoginPromo = () => {
  return (
    <section className={styles.promo}>
      <div className={styles.content}>
        <AuthSectionHeader
          title='Ваш второй мозг, для команд.'
          description='Современное пространство для заметок, проектов и совместной работы. Создано с мыслью о простоте.'
          variant='promo'
        />
        <PromoAdvantages advantages={LOGIN_ADVANTAGES}/>
        <AppDemo/>
      </div>
    </section>
  );
};

