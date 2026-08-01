import {RegistrationForm} from "@features/registration";
import { AuthNavigationHint, AuthSectionHeader, TextDivider } from '@shared/auth';
import { OAuthGoogle } from '@features/OAuthGoogle';
import { OAuthGitHub } from '@features/OAuthGithub';
import { ROUTES } from '@shared/routes';
import styles from './RegistrationPanel.module.css'

export const RegistrationPanel = () => {
  return (
    <section className={styles.panel}>
      <AuthSectionHeader title='Создайте аккаунт'
                         description='Зарегистрируйтесь и начните бесплатно'
                         variant='form'
      />
      <RegistrationForm/>
      <TextDivider>или зарегистрироваться через</TextDivider>
      <div className={styles.oAuthWrapper}>
        <OAuthGoogle/>
        <OAuthGitHub/>
      </div>
      <AuthNavigationHint message='Уже есть аккаунт?'
                          actionLabel='Войти'
                          link={ROUTES.login}
      />
    </section>
  );
};

