import styles from './RegistrationPromo.module.css';
import Logo from '@shared/assets/icons/Logo Badge.svg';
import {Typography} from "@shared/ui/Typography";
import {AppReviews} from './ui/app-reviews/AppReviews';
import {PromoAdvantages} from '../promo-advantages/PromoAdvantages';
import { AuthSectionHeader } from '@shared/ui/auth';

export const REGISTRATION_ADVANTAGES = [
  'Кредитная карта не нужна',
  'Бесплатный план — безлимитные заметки',
  'Приглашайте участников мгновенно',
] as const;

export const RegistrationPromo = () => {
  return (
    <section className={styles.promo}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Logo/>
          <Typography variant='h4'>Notify</Typography>
        </div>
        <AuthSectionHeader title='Начните свой путь бесплатно.'
                           description='Создайте рабочее пространство за секунды. Пишите, сотрудничайте и управляйте проектами — всё в одном месте.'
                           variant='promo'
        />
        <PromoAdvantages advantages={REGISTRATION_ADVANTAGES}/>
        <AppReviews/>
      </div>
    </section>
  );
};
