import {OAuthButtons} from "@features/OAuth";
import {Meta, StoryObj} from '@storybook/nextjs';

const meta = {
  title: 'OAuth Buttons',
  component: OAuthButtons,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof OAuthButtons>

export default meta;

type Story = StoryObj<typeof meta>;

export const Default:Story = {}