import {AuthSectionHeader} from "@features/Auth";
import {Meta, StoryObj} from "@storybook/nextjs";

const meta = {
  title: 'Auth Section Header',
  component: AuthSectionHeader,
  tags: ['autodocs'],
  args: {
    title: 'Hello World',
    description: 'Lorem Ipsum',
    variant: 'form',
  },


} satisfies Meta<typeof AuthSectionHeader>;

export default meta;

type Story = StoryObj<typeof meta>

export const Default: Story = {};

export const Promo: Story = {
  args: {
    title: 'Ваш второй мозг,\n' + 'для команд.',
    description: 'Современное пространство для заметок, проектов и совместной работы. Создано с мыслью о простоте.',
    variant: 'promo',
  },
  decorators: [
    (Story) => (
      <div style={{
        backgroundColor: 'var(--color-bg-dark)',
        padding: '40px',
      }}>
        <Story/>
      </div>
    )
  ],
};

export const Form: Story = {
  args: {
    title: 'С возвращением',
    description: 'Войдите в своё рабочее пространство',
    variant: 'form'
  },
};