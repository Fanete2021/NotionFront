import {Input} from "@shared/ui/Input";
import {Checkbox} from "@shared/ui/Checkbox";
import {Typography} from "@shared/ui/Typography";
import {Button} from "@shared/ui/Button";
import Letter from '@shared/assets/icons/letter.svg';
import Lock from '@shared/assets/icons/lock.svg';
import Eye from "@shared/assets/icons/eye.svg";
import Link from 'next/link';
import styles from './LoginForm.module.css';

export const LoginForm = () => {
  return (
    <form className={styles.loginForm}>
      <Input
        label='Email адрес'
        addonLeft={<Letter/>}
        placeholder='you@example.com'
      />
      <Input
        label='Пароль'
        type='password'
        addonLeft={<Lock/>}
        addonRight={<Eye/>}
        placeholder='••••••••••••'
      />
      <div className={styles.actions}>
        <div className={styles.rememberMe}>
          <Checkbox className={styles.checkbox}/>
          <Typography variant='text-medium'>
            Запомнить меня
          </Typography>
        </div>
        <Link href='/reset' className={styles.forgotPasswordLink}>
          <Typography variant='text-medium'
                      className={styles.forgotPasswordText}
          >
            Забыли пароль?
          </Typography>
        </Link>
      </div>
      <Button
        className={styles.submitForm}
        type='submit'
        variant='filled'
        fullWidth
      >
        Войти
      </Button>
    </form>
  );
};

