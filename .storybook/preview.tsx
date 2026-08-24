import type { Preview } from '@storybook/nextjs';
// eslint-disable-next-line fsd/no-relative-imports
import { StoreProvider } from '../app/StoreProvider';

const preview: Preview = {
  decorators: [
    (Story) => (
      <StoreProvider>
        <Story />
      </StoreProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
