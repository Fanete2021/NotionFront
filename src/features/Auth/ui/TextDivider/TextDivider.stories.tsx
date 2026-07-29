import {TextDivider} from "@features/Auth";
import {Meta, StoryObj} from "@storybook/nextjs";

const meta = {
  title: 'Text Divider',
  component: TextDivider,
  tags: ['autodocs'],
  args: {
    children: 'children'
  },
  decorators: [
    (Story) => (
      <div style={{width: '560px'}}>
        <Story/>
      </div>
    )
  ]
} satisfies Meta<typeof TextDivider>

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LoginHint: Story = {
  args: {
    children: 'или войти через'
  }
}

export const RegistrationHint: Story = {
  args: {
    children: 'или зарегистрироваться через'
  }
}