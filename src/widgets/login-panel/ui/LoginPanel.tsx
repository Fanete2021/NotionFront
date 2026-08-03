import styles from './LoginPanel.module.css'
import {LoginForm} from "@features/login";
import { AuthNavigationHint, AuthSectionHeader, TextDivider } from '@shared/ui/auth';
import { OAuthGoogle } from '@/features/o-auth-google';
import { OAuthGitHub } from '@/features/o-auth-github';
import { ROUTES } from '@shared/routes';

export const LoginPanel = () => {
  return (
    <section className={styles.authPanel}>
      <AuthSectionHeader title='С возвращением'
                         description='Войдите в своё рабочее пространство'
                         variant='form'
      />
      <LoginForm/>

      <TextDivider>или войти через</TextDivider>
      <div className={styles.oAuthWrapper}>
        <OAuthGoogle />
        <OAuthGitHub />
      </div>
      <AuthNavigationHint message="Нет аккаунта?"
                          actionLabel='Зарегистрироваться'
                          link={ROUTES.registration}
      />
    </section>
  );
};

