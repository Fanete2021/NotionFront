import { describe, expect, it } from 'vitest';
import { createCalendarEventFormSchema } from './validationCreateCalendarEventConfig';

const validInput = {
  title: 'Встреча с командой продукта',
  date: '2026-07-10',
  startTime: '14:00',
  endTime: '14:30',
  project: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  taskType: 'meet',
  repeatable: 'no-repeat',
  notifications: false,
  telegramSend: false,
};

describe('createCalendarEventFormSchema', () => {
  describe('валидный ввод', () => {
    it('пропускает полностью заполненную форму', () => {
      const result = createCalendarEventFormSchema.safeParse(validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Встреча с командой продукта');
        expect(result.data.date).toBeInstanceOf(Date);
        expect(result.data.startTime).toBe('14:00');
        expect(result.data.endTime).toBe('14:30');
        expect(result.data.project).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6');
      }
    });

    it('пропускает форму без проекта (project = undefined)', () => {
      const result = createCalendarEventFormSchema.safeParse({
        ...validInput,
        project: undefined,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.project).toBeUndefined();
      }
    });

    it('преобразует пустую строку project в undefined', () => {
      const result = createCalendarEventFormSchema.safeParse({
        ...validInput,
        project: '',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.project).toBeUndefined();
      }
    });

    it('подставляет default false для notifications и telegramSend', () => {
      const { ...withoutFlags } = validInput;
      const result = createCalendarEventFormSchema.safeParse(withoutFlags);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.notifications).toBe(false);
        expect(result.data.telegramSend).toBe(false);
      }
    });

    it('парсит date из строки ISO', () => {
      const result = createCalendarEventFormSchema.safeParse({
        ...validInput,
        date: '2026-07-10T14:00:00.000Z',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.date.toISOString()).toBe('2026-07-10T14:00:00.000Z');
      }
    });

    it('парсит date из объекта Date', () => {
      const date = new Date('2026-07-10T00:00:00.000Z');
      const result = createCalendarEventFormSchema.safeParse({ ...validInput, date });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.date).toEqual(date);
      }
    });

    it('обрезает пробелы у title, taskType, repeatable', () => {
      const result = createCalendarEventFormSchema.safeParse({
        ...validInput,
        title: '  Встреча  ',
        taskType: '  meet  ',
        repeatable: '  no-repeat  ',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Встреча');
        expect(result.data.taskType).toBe('meet');
        expect(result.data.repeatable).toBe('no-repeat');
      }
    });
  });

  describe('title', () => {
    it('падает на пустой строке', () => {
      const result = createCalendarEventFormSchema.safeParse({ ...validInput, title: '' });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find((i) => i.path[0] === 'title');
        expect(error?.message).toBe('Название для события обязательно');
      }
    });

    it('падает на строке из пробелов', () => {
      const result = createCalendarEventFormSchema.safeParse({ ...validInput, title: '   ' });

      expect(result.success).toBe(false);
    });

    it('падает при отсутствии title', () => {
      const { ...withoutTitle } = validInput;
      const result = createCalendarEventFormSchema.safeParse(withoutTitle);

      expect(result.success).toBe(false);
    });
  });

  describe('date', () => {
    it('падает на пустой строке', () => {
      const result = createCalendarEventFormSchema.safeParse({ ...validInput, date: '' });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find((i) => i.path[0] === 'date');
        expect(error?.message).toBe('Обязательное поле');
      }
    });

    it('падает на null', () => {
      const result = createCalendarEventFormSchema.safeParse({ ...validInput, date: null });

      expect(result.success).toBe(false);
    });

    it('падает на undefined', () => {
      const { ...withoutDate } = validInput;
      const result = createCalendarEventFormSchema.safeParse(withoutDate);

      expect(result.success).toBe(false);
    });

    it('падает на невалидной строке', () => {
      const result = createCalendarEventFormSchema.safeParse({
        ...validInput,
        date: 'not-a-date',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('startTime', () => {
    it.each(['00:00', '09:05', '14:30', '23:59'])('пропускает валидное время %s', (time) => {
      const result = createCalendarEventFormSchema.safeParse({ ...validInput, startTime: time });
      expect(result.success).toBe(true);
    });

    it.each(['24:00', '14:60', '14:5', '1:30', '14-30', 'abc', '', ' 14:30 '])(
      'падает на невалидном времени "%s"',
      (time) => {
        const result = createCalendarEventFormSchema.safeParse({ ...validInput, startTime: time });
        expect(result.success).toBe(false);
      },
    );

    it('падает на пустой строке с правильным сообщением', () => {
      const result = createCalendarEventFormSchema.safeParse({ ...validInput, startTime: '' });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find((i) => i.path[0] === 'startTime');
        expect(error?.message).toBe('Поле не должно быть пустым');
      }
    });

    it('падает на неверном формате с сообщением про ЧЧ:ММ', () => {
      const result = createCalendarEventFormSchema.safeParse({
        ...validInput,
        startTime: 'abc',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find((i) => i.path[0] === 'startTime');
        expect(error?.message).toBe('Время должно быть в формате ЧЧ:ММ (например, 14:30)');
      }
    });
  });

  describe('endTime', () => {
    it.each(['00:00', '09:05', '14:30', '23:59'])('пропускает валидное время %s', (time) => {
      const result = createCalendarEventFormSchema.safeParse({ ...validInput, endTime: time });
      expect(result.success).toBe(true);
    });

    it.each(['24:00', '14:60', 'abc', ''])('падает на невалидном времени "%s"', (time) => {
      const result = createCalendarEventFormSchema.safeParse({ ...validInput, endTime: time });
      expect(result.success).toBe(false);
    });
  });

  describe('project', () => {
    it('пропускает undefined', () => {
      const result = createCalendarEventFormSchema.safeParse({
        ...validInput,
        project: undefined,
      });
      expect(result.success).toBe(true);
    });

    it('пропускает отсутствующее поле', () => {
      const { ...withoutProject } = validInput;
      const result = createCalendarEventFormSchema.safeParse(withoutProject);
      expect(result.success).toBe(true);
    });

    it('преобразует пустую строку в undefined', () => {
      const result = createCalendarEventFormSchema.safeParse({ ...validInput, project: '' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.project).toBeUndefined();
      }
    });

    it('пропускает валидный uuid', () => {
      const result = createCalendarEventFormSchema.safeParse({
        ...validInput,
        project: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.project).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6');
      }
    });

    it('обрезает пробелы вокруг значения', () => {
      const result = createCalendarEventFormSchema.safeParse({
        ...validInput,
        project: '  3fa85f64-5717-4562-b3fc-2c963f66afa6  ',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.project).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6');
      }
    });
  });

  describe('taskType и repeatable', () => {
    it('падает на пустом taskType', () => {
      const result = createCalendarEventFormSchema.safeParse({ ...validInput, taskType: '' });
      expect(result.success).toBe(false);
    });

    it('падает на пустом repeatable', () => {
      const result = createCalendarEventFormSchema.safeParse({ ...validInput, repeatable: '' });
      expect(result.success).toBe(false);
    });

    it('падает, если taskType отсутствует', () => {
      const { ...withoutTaskType } = validInput;
      const result = createCalendarEventFormSchema.safeParse(withoutTaskType);
      expect(result.success).toBe(false);
    });
  });

  describe('несколько ошибок сразу', () => {
    it('возвращает все issues, если несколько полей невалидны', () => {
      const result = createCalendarEventFormSchema.safeParse({
        title: '',
        date: '',
        startTime: 'abc',
        endTime: '',
        taskType: '',
        repeatable: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((i) => i.path[0]).sort();
        expect(paths).toEqual(['date', 'endTime', 'repeatable', 'startTime', 'taskType', 'title']);
      }
    });
  });
});
