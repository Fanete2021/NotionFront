import styles from './RegistrationPanel.module.css'
import {AuthSectionHeader} from "@features/Auth";
import {OAuthButtons} from "@features/OAuth";
import {AuthNavigationHint, TextDivider} from "@features/Auth";
import {RegistrationForm} from "@features/Registration";

export const RegistrationPanel = () => {
  return (
    <section className={styles.panel}>
      <AuthSectionHeader title='Создайте аккаунт'
                         description='Зарегистрируйтесь и начните бесплатно'
                         variant='form'
      />
      <RegistrationForm/>
      <TextDivider>или зарегистрироваться через</TextDivider>
      <OAuthButtons/>
      <AuthNavigationHint message='Уже есть аккаунт?'
                          actionLabel='Войти'
                          link='/login'
      />
    </section>
  );
};

