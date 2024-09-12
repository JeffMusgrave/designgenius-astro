import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";
import mdx from "@astrojs/mdx"
import robotsTxt from "astro-robots-txt";

export default defineConfig({
  site: 'https://designgenius.ca',
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
    domains: ['designgenius.ca'],
    remotePatterns: [{ protocol: "https" }],
  },
  integrations: [
    tailwind(), 
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }), 
    sitemap(), 
    prefetch(), 
    mdx(),
    robotsTxt(),
  ],
  redirects:{
  },
  vite: {
    plugins: [
      {
        name: 'image-optimization',
        enforce: 'post',
        apply: 'build',
        transformIndexHtml(html) {
          return html.replace(/src="([^"]+)"/g, (match, url) => {
            if (url.includes('/_astro/')) {
              return match;
            }
            const fileName = url.split('/').pop().split('.')[0];
            return `src="/_astro/${fileName}.webp"`;
          });
        }
      },
    ],
  },
  content: {
    sources: ['src/content'],
    collections: {
      blog: {},
      articles: {},
      topics: {},
    },
  },
});