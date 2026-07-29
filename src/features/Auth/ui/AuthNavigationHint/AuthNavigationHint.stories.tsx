import {AuthNavigationHint} from "@features/Auth";
import {Meta, StoryObj} from "@storybook/nextjs";

const meta = {
  title: 'Auth Navigation Hint',
  component: AuthNavigationHint,
  tags: ['autodocs'],
  args: {
    message: 'message',
    actionLabel: 'label',
    link: '/home'
  },

} satisfies Meta<typeof AuthNavigationHint>

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Login: Story = {
  args: {
    message: 'Нет аккаунта?',
    actionLabel: 'Зарегистрироваться',
    link: '/registration',
  },
};

export const Registration: Story = {
  args: {
    message: 'Уже есть аккаунт?',
    actionLabel: 'Войти',
    link: '/login'
  }
}