import styles from './LoginPromo.module.css';
import {PromoAdvantages} from "@widgets/auth-promo/ui/promo-advantages/PromoAdvantages";
import { AuthSectionHeader } from '@shared/auth';
import { AppDemo } from './app-demo/AppDemo';

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
          title={<>Ваш второй мозг,<br/>для команд.</>}
          description='Современное пространство для заметок, проектов и совместной работы. Создано с мыслью о простоте.'
          variant='promo'
        />
        <PromoAdvantages advantages={LOGIN_ADVANTAGES}/>
        <AppDemo/>
      </div>
    </section>
  );
};

