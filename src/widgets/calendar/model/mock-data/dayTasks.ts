import { DayTaskData } from '@entities/calendar';

export const dayTasks: DayTaskData[] = [
  {
    label: 'Провести ревью дизайн-системы',
    time: '10:00 – 11:00',
    projectName: 'Работа',
    isCompleted: true,
    viewed: false,
  },
  {
    label: 'Синхронизация с командой',
    time: '14:00 – 14:30',
    projectName: 'Продукт',
    isCompleted: false,
    viewed: true,
  },
  {
    label: 'Демонстрация для клиента',
    time: '16:00 – 17:30',
    projectName: 'Клиент',
    isCompleted: false,
    viewed: false,
  },
];
