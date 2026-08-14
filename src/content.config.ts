import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { obsidianLoader } from './lib/obsidian-loader';

/** Vault de Obsidian del que se publican notas sueltas. */
const VAULT =
  '/Users/juananruiz/Library/Mobile Documents/iCloud~md~obsidian/Documents/Notas-personales/Notas';

/** Marca en el frontmatter que hace publicable una nota: `visibility: public`. */
const MARCA_PUBLICA = 'public';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    searchTitle: z.string().optional(),
    description: z.string(),
    category: z.enum(['programacion', 'reflexiones', 'proyectos', 'lecturas']),
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

// Esta colección contiene SOLO las notas marcadas `visibility: público`: el
// loader descarta el resto del vault antes de validar nada (ver obsidian-loader).
// Aun así el schema es tolerante, porque las notas del vault se escriben a mano
// en Obsidian y no siguen una plantilla fija.
const notas = defineCollection({
  loader: obsidianLoader({ vault: VAULT, marca: MARCA_PUBLICA }),
  schema: z.object({
    // El loader rellena `title` con el nombre del archivo si la nota no lo trae.
    title: z.string(),
    description: z.string().nullish(),
    visibility: z.string().nullish(),
    // Solo 3 notas traen `date`; `created` es la alternativa que usa el vault.
    // Algunas fechas están en texto libre ("jueves, 30 de mayo de 2024"): como
    // solo sirven para ordenar, se descartan en silencio en vez de romper el build.
    date: z.coerce.date().nullish().catch(undefined),
    created: z.coerce.date().nullish().catch(undefined),
    author: z.string().nullish(),
    // 963 notas usan lista multilínea, pero 7 usan un string suelto.
    tags: z
      .union([z.string(), z.array(z.string())])
      .nullish()
      .transform((t) => (t == null ? [] : Array.isArray(t) ? t : [t])),
    // Formato wikilink de Obsidian ("![[foo.png|150]]"), a veces vacío.
    image: z.string().nullish(),
    aliases: z
      .union([z.string(), z.array(z.string())])
      .nullish()
      .transform((a) => (a == null ? [] : Array.isArray(a) ? a : [a])),
    status: z.string().nullish(),
    year: z.number().nullish(),
  }),
});

export const collections = { posts, notas };
