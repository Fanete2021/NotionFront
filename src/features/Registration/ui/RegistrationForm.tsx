import {Input} from "@shared/ui/Input";
import {Checkbox} from "@shared/ui/Checkbox";
import {Typography} from "@shared/ui/Typography";
import {Button} from "@shared/ui/Button";
import Letter from "@shared/assets/icons/letter.svg";
import Lock from "@shared/assets/icons/lock.svg";
import Person from "@shared/assets/icons/person.svg";
import Lightning from "@shared/assets/icons/lightning.svg";
import Eye from "@shared/assets/icons/eye.svg";
import styles from './RegistrationForm.module.css'

export const RegistrationForm = () => {
  return (
    <form className={styles.form}>
      <div className={styles.nameRow}>
        <Input
          label='Имя'
          addonLeft={<Person/>}
          placeholder='Иван'
        />
        <Input
          label='Фамилия'
          addonLeft={<Person/>}
          placeholder='Иванов'
        />
      </div>
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
      <Input
        label='Подтвердите Пароль'
        type='password'
        addonLeft={<Lock/>}
        placeholder='Повторите пароль'
      />
      <div className={styles.privacy}>
        <Checkbox/>
        <Typography variant='text-medium'>
          Я принимаю Условия использования и Политику конфиденциальности
        </Typography>
      </div>
      <Button className={styles.submitForm}
              variant='filled'
              fullWidth
              addonLeft={<Lightning/>}
              type='submit'
      >
        Создать аккаунт бесплатно
      </Button>
    </form>
  );
};

