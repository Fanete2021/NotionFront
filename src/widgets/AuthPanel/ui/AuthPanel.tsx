import {AuthSectionHeader} from "@shared/ui/AuthSectionHeader";
import styles from './AuthPanel.module.css'
import {LoginForm} from "@features/Login";
import {Button} from "@shared/ui/Button";
import {AuthNavigationHint, AuthSocial, TextDivider} from "@features/Auth";

export const AuthPanel = () => {
  return (
    <section className={styles.authPanel}>
      <AuthSectionHeader title='С возвращением'
                         description='Войдите в своё рабочее пространство'
                         variant='form'
      />
      <LoginForm/>
      <Button className={styles.submitForm}
              variant='filled'
              fullWidth
      >
        Войти
      </Button>
      <TextDivider>или войти через</TextDivider>
      <AuthSocial/>
      <AuthNavigationHint message='Нет аккаунта?'
                          actionLabel='Зарегистрироваться'
                          link='/registration'
      />
    </section>
  );
};

