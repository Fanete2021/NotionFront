import {PromoAdvantages} from "./PromoAdvantages";
import {Meta, StoryObj} from "@storybook/nextjs"
import {LOGIN_ADVANTAGES} from "../LoginPromo/LoginPromo";
import {REGISTRATION_ADVANTAGES} from "../RegistrationPromo/RegistrationPromo";

const meta = {
  title: 'Promo Advantages',
  component: PromoAdvantages,
  tags: ['autodocs'],
  args: {
    advantages: [
      'Преимущество 1',
      'Преимущество 2',
      'Преимущество 3',
    ]
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
  ]
} satisfies Meta<typeof PromoAdvantages>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LoginAdvantages: Story = {
  args: {
    advantages: LOGIN_ADVANTAGES
  }
}

export const RegistrationAdvantages: Story = {
  args: {
    advantages: REGISTRATION_ADVANTAGES
  }
}

