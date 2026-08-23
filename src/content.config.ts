import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    searchTitle: z.string().optional(),
    description: z.string(),
    category: z.enum(['programacion', 'reflexiones', 'proyectos', 'lecturas', 'ia']),
    categoryLabel: z.string(),
    date: z.date(),
    dateLabel: z.string(),
    readingTime: z.string().optional(),
    order: z.number(),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

export const collections = { posts };
