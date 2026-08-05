import styles from '@widgets/registration-panel/ui/RegistrationPanel.module.css';
import { RegistrationForm } from '@features/Registration';
import { OAuthGoogle } from '@/features/o-auth-google';
import { OAuthGitHub } from '@/features/o-auth-github';
import { AuthNavigationHint, AuthSectionHeader, TextDivider } from '@shared/ui/auth';
import { ROUTES } from '@shared/routes';

export const RegistrationPanel = () => {
  return (
    <section className={styles.panel}>
      <AuthSectionHeader
        title="Создайте аккаунт"
        description="Зарегистрируйтесь и начните бесплатно"
        variant="form"
      />
      <RegistrationForm />
      <TextDivider>или зарегистрироваться через</TextDivider>
      <div className={styles.oAuthWrapper}>
        <OAuthGoogle />
        <OAuthGitHub />
      </div>
      <AuthNavigationHint message="Уже есть аккаунт?" actionLabel="Войти" link={ROUTES.login} />
    </section>
  );
};
