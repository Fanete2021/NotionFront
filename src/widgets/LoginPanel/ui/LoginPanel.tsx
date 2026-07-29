import {AuthSectionHeader} from "@features/Auth";
import styles from './LoginPanel.module.css'
import {LoginForm} from "@features/Login";
import {AuthNavigationHint, TextDivider} from "@features/Auth";
import {OAuthButtons} from "@features/OAuth";

export const LoginPanel = () => {
  return (
    <section className={styles.authPanel}>
      <AuthSectionHeader title='С возвращением'
                         description='Войдите в своё рабочее пространство'
                         variant='form'
      />
      <LoginForm/>

      <TextDivider>или войти через</TextDivider>
      <OAuthButtons/>
      <AuthNavigationHint message='Нет аккаунта?'
                          actionLabel='Зарегистрироваться'
                          link='/registration'
      />
    </section>
  );
};

