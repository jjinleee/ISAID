import type { StorybookConfig } from '@storybook/nextjs-vite';
import { mergeConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },

  viteFinal: async (config) => mergeConfig(config, { plugins: [svgr()] }),

  staticDirs: ['../public'],
};
export default config;
