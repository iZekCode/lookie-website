import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL and SITE_BASE come from the deploy workflow. Locally the site lives at the root.
const site = process.env.SITE_URL || 'https://izekcode.github.io';
const base = process.env.SITE_BASE || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
