import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    insights: defineCollection({
      type: 'page',
      source: 'insights/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        author: z.string().default('Cipher4 Engineering'),
        sector: z.string().optional(),
        readingTime: z.string().optional(),
        draft: z.boolean().default(false),
      }),
    }),
  },
})
