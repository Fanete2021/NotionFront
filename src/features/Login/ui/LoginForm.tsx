import styles from './LoginForm.module.css';
import {Input} from "@shared/ui/Input";
import Letter from '@shared/assets/icons/letter.svg';
import Lock from '@shared/assets/icons/lock.svg';
import {Checkbox} from "@shared/ui/Checkbox";
import {Typography} from "@shared/ui/Typography";
import Link from 'next/link';

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
        addonLeft={<Lock/>}
        placeholder='••••••••••••'
      />
      <div className={styles.actions}>
        <div className={styles.rememberMe}>
          <Checkbox className={styles.checkbox}/>
          <Typography variant='text-medium'>
            Запомнить меня
          </Typography>
        </div>
        <Link href='/reset' >
          <Typography variant='text-medium'
                      className={styles.forgotPasswordLink}
          >
            Забыли пароль?
          </Typography>
        </Link>
      </div>
    </form>
  );
};

