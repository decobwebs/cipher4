import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    insights: defineCollection({
      type: 'page',
      source: 'insights/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        // Search only (title tag and meta description); the page shows title
        // and description. Phase 8: title tag 60, description 155 at most.
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        date: z.string(),
        author: z.string().default('Cipher4 Engineering'),
        sector: z.string().optional(),
        readingTime: z.string().optional(),
        draft: z.boolean().default(false),
      }),
    }),
  },
})
