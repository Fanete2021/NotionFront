import type { StorybookConfig } from '@storybook/nextjs';

type WebpackRule = {
  test?: RegExp;
  exclude?: RegExp;
};

const isWebpackRule = (rule: unknown): rule is WebpackRule => {
  return (
    typeof rule === 'object' &&
    rule !== null &&
    !Array.isArray(rule)
  );
};

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],

  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  webpackFinal: async (config) => {
    config.module ??= {};
    config.module.rules ??= [];

    // Стандартный обработчик Storybook/Next.js превращает SVG
    // в объект изображения. Запрещаем ему обрабатывать SVG.
    for (const rule of config.module.rules) {
      if (
        isWebpackRule(rule) &&
        rule.test instanceof RegExp &&
        rule.test.test('.svg')
      ) {
        rule.exclude = /\.svg$/i;
      }
    }

    // Теперь SVG обрабатывается как React-компонент.
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            exportType: 'default',
          },
        },
      ],
    });

    return config;
  },
};

export default config;