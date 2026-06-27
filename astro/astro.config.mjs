// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://carwala.org',
  output: 'static',
  adapter: vercel({ imageService: true }),
  integrations: [react(), sitemap()],
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'ITC Avant Garde Gothic Pro',
      cssVariable: '--font-heading',
      options: {
        variants: [
          { weight: 400, style: 'normal', src: ['./src/assets/fonts/ITC Avant Garde Gothic PRO Font Family/ITC Avant Garde Gothic Pro-Book.otf'], display: 'swap' },
          { weight: 700, style: 'normal', src: ['./src/assets/fonts/ITC Avant Garde Gothic PRO Font Family/ITC Avant Garde Gothic Pro-Bold.otf'], display: 'swap' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Mulish',
      cssVariable: '--font-body',
      options: {
        variants: [
          { weight: 'variable', style: 'normal', src: ['./src/assets/fonts/Mulish/Mulish-VariableFont_wght.ttf'], display: 'swap' },
          { weight: 'variable', style: 'italic', src: ['./src/assets/fonts/Mulish/Mulish-Italic-VariableFont_wght.ttf'], display: 'swap' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Pixel Operator',
      cssVariable: '--font-pixel',
      options: {
        variants: [
          { weight: 400, style: 'normal', src: ['./src/assets/fonts/Pixel-operator/PixelOperator.ttf'], display: 'swap' },
          { weight: 700, style: 'normal', src: ['./src/assets/fonts/Pixel-operator/PixelOperator-Bold.ttf'], display: 'swap' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Montserrat',
      cssVariable: '--font-accent',
      options: {
        variants: [
          { weight: 'variable', style: 'normal', src: ['./src/assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf'], display: 'swap' },
        ],
      },
    },
  ],
  routeRules: {
    '/': { cache: { maxAge: 3600, staleWhileRevalidate: 86400 } },
    '/pricing': { cache: { maxAge: 3600, staleWhileRevalidate: 86400 } },
    '/gallery': { cache: { maxAge: 7200, staleWhileRevalidate: 86400 } },
    '/maintenance': { cache: { maxAge: 3600, staleWhileRevalidate: 86400 } },
  },
  vite: {
    plugins: [tailwindcss()],
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