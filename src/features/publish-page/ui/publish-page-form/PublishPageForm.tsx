'use client';

import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './PublishPageForm.module.css';
import {
  publishPageFormSchema,
  type PublishPageFormValues,
} from '../../model/publishPageFormSchema';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { FormError } from '@shared/ui/form-error';
import { Input } from '@shared/ui/input';
import { Toggle } from '@shared/ui/toggle';
import { Typography } from '@shared/ui/typography';
import GlobusIcon from '@shared/assets/icons/globus.svg';

type PublishPageFormProps = {
  id: string;
  defaultValues: PublishPageFormValues;
  onCancel: () => void;
  onSubmit?: (values: PublishPageFormValues) => void;
};

export const PublishPageForm = ({
  id,
  defaultValues,
  onCancel,
  onSubmit,
}: PublishPageFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PublishPageFormValues>({
    defaultValues,
    resolver: zodResolver(publishPageFormSchema),
  });
  const isPublic = useWatch({ control, name: 'isPublic' });

  return (
    <form id={id} onSubmit={handleSubmit((values) => onSubmit?.(values))} noValidate>
      <div className={styles.fields}>
        <Card radius="m" className={styles.accessCard}>
          <span className={styles.accessIcon} aria-hidden="true">
            <GlobusIcon />
          </span>
          <div className={styles.accessText}>
            <Typography id={`${id}-access`} className={styles.accessTitle}>
              Публичный доступ
            </Typography>
            <Typography id={`${id}-access-description`} className={styles.accessDescription}>
              Любой с ссылкой может просматривать
            </Typography>
          </div>
          <Controller
            name="isPublic"
            control={control}
            render={({ field }) => {
              const toggle = () => field.onChange(!field.value);

              return (
                <Toggle
                  checked={field.value}
                  className={styles.toggle}
                  onToggle={toggle}
                  onBlur={field.onBlur}
                  onKeyDown={(event) => {
                    if (event.key === ' ' || event.key === 'Enter') {
                      event.preventDefault();
                      toggle();
                    }
                  }}
                  aria-labelledby={`${id}-access`}
                  aria-describedby={`${id}-access-description`}
                />
              );
            }}
          />
        </Card>

        <fieldset className={styles.seo}>
          <legend className={styles.legend}>SEO-настройки</legend>
          <div className={styles.seoFields}>
            <div className={styles.field}>
              <Typography variant="label" htmlFor={`${id}-title`} className={styles.label}>
                Заголовок страницы
              </Typography>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id={`${id}-title`}
                    className={styles.input}
                    placeholder="Название страницы для поисковых систем"
                    aria-invalid={Boolean(errors.title)}
                    aria-describedby={errors.title ? `${id}-title-error` : undefined}
                    autoFocus
                  />
                )}
              />
              {errors.title && (
                <div id={`${id}-title-error`} role="alert">
                  <FormError message={errors.title.message ?? null} />
                </div>
              )}
            </div>

            <div className={styles.field}>
              <Typography variant="label" htmlFor={`${id}-description`} className={styles.label}>
                Мета-описание
              </Typography>
              <textarea
                {...register('description')}
                id={`${id}-description`}
                className={styles.textarea}
                rows={3}
                placeholder="Кратко расскажите, о чём эта страница"
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? `${id}-description-error` : undefined}
              />
              {errors.description && (
                <div id={`${id}-description-error`} role="alert">
                  <FormError message={errors.description.message ?? null} />
                </div>
              )}
            </div>

            <div className={styles.field}>
              <Typography variant="label" htmlFor={`${id}-slug`} className={styles.label}>
                Пользовательский URL-слаг
              </Typography>
              <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id={`${id}-slug`}
                    className={styles.slugInput}
                    placeholder="design-system-components"
                    addonLeft={<span className={styles.urlPrefix}>acme.notify.ru/</span>}
                    aria-invalid={Boolean(errors.slug)}
                    aria-describedby={errors.slug ? `${id}-slug-error` : undefined}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                )}
              />
              {errors.slug && (
                <div id={`${id}-slug-error`} role="alert">
                  <FormError message={errors.slug.message ?? null} />
                </div>
              )}
            </div>
          </div>
        </fieldset>
      </div>

      <div className={styles.footer}>
        <Typography className={styles.hint}>
          Изменения вступят в силу сразу после публикации.
        </Typography>
        <div className={styles.actions}>
          <Button variant="outline" className={styles.cancelButton} onClick={onCancel}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="filled"
            className={styles.submitButton}
            addonLeft={<GlobusIcon />}
            disabled={!isPublic}
          >
            Опубликовать
          </Button>
        </div>
      </div>
    </form>
  );
};
