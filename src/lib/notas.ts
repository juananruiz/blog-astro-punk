import { getCollection, type CollectionEntry } from 'astro:content';

export type Nota = CollectionEntry<'notas'>;

/**
 * Notas del vault publicables, de más reciente a más antigua.
 *
 * El filtro por `visibility: public` lo aplica el loader (src/lib/obsidian-loader.ts),
 * así que la colección ya viene limpia: no contiene notas privadas.
 */
export async function getNotasPublicas(): Promise<Nota[]> {
  const notas = await getCollection('notas');
  return notas.sort((a, b) => orden(b) - orden(a));
}

/** Fecha de la nota: `date`, o `created` como alternativa. Muchas no traen ninguna. */
export function fechaDe(nota: Nota): Date | undefined {
  return nota.data.date ?? nota.data.created ?? undefined;
}

/** Fecha ya formateada en español, o `undefined` si la nota no tiene fecha. */
export function fechaLegible(nota: Nota): string | undefined {
  const fecha = fechaDe(nota);
  if (!fecha) return undefined;
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(fecha);
}

/** Las notas sin fecha caen al final del listado. */
function orden(nota: Nota): number {
  return fechaDe(nota)?.getTime() ?? 0;
}
