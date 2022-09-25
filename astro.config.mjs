import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import partytown from '@astrojs/partytown'
import tailwind from '@astrojs/tailwind'

import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
    integrations: [mdx(), partytown(), tailwind(), sitemap()],
    vite: {
        ssr: {
            external: ['svgo'],
        },
    },
})
