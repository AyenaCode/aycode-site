// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://aycode.dev',

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});