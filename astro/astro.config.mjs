// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel({ imageService: false }),
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@lib': resolve(__dirname, 'src/lib'),
      },
    },
    optimizeDeps: {
      exclude: ['@tanstack/react-query'],
    },
    ssr: {
      noExternal: ['@tanstack/react-query'],
    },
  },
});