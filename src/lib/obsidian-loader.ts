import { readdir, readFile } from 'node:fs/promises';
import { basename, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import yaml from 'js-yaml';
import type { Loader } from 'astro/loaders';

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export interface OpcionesVault {
  /** Ruta absoluta a la carpeta del vault de Obsidian. */
  vault: string;
  /** Valor de `visibility` que marca una nota como publicable. */
  marca: string;
}

/**
 * Loader que publica SOLO las notas del vault marcadas como publicables.
 *
 * Por qué no basta con el loader `glob` de Astro: `glob` carga las ~1400 notas
 * del vault y las valida TODAS contra el schema, así que cualquier defecto en
 * una nota privada aborta el build entero. En este vault ya hay 4 notas con
 * claves YAML duplicadas (las escribe el plugin Spaced Repetition) y 6 con `?`
 * en el nombre que `glob` no sabe abrir.
 *
 * Este loader invierte el orden: primero descarta lo no publicable, y solo
 * después valida. Una nota privada rota no puede romper el sitio.
 */
export function obsidianLoader({ vault, marca }: OpcionesVault): Loader {
  const marcaNormalizada = marca.trim().toLowerCase();

  return {
    name: 'obsidian-vault',

    async load({ store, parseData, renderMarkdown, generateDigest, logger, config }) {
      store.clear();

      const raiz = fileURLToPath(config.root);
      const archivos = await listarMarkdown(vault);

      let ilegibles = 0;

      // Primera pasada: quedarse solo con lo publicable. Nada de lo que se
      // descarte aquí llega siquiera a validarse.
      const publicables: NotaCruda[] = [];

      for (const ruta of archivos) {
        const raw = await readFile(ruta, 'utf8');

        // Sin frontmatter no hay `visibility`, luego no es publicable.
        const bloque = raw.match(FRONTMATTER);
        if (!bloque) continue;

        let data: Record<string, unknown>;
        try {
          // `json: true` tolera claves duplicadas (gana la última) en lugar de
          // lanzar: es justo el defecto que deja el plugin Spaced Repetition.
          data = (yaml.load(bloque[1], { json: true }) ?? {}) as Record<string, unknown>;
        } catch {
          // Nota ilegible: se omite. Si era privada, no importa; y en ningún
          // caso debe tumbar el build.
          ilegibles++;
          continue;
        }

        const visibility = typeof data.visibility === 'string' ? data.visibility : '';
        if (visibility.trim().toLowerCase() !== marcaNormalizada) continue;

        const nombre = basename(ruta, '.md');

        // Las notas del vault no suelen traer `title`: el nombre del archivo
        // es el título real en Obsidian.
        if (typeof data.title !== 'string' || data.title.trim() === '') {
          data.title = nombre;
        }

        publicables.push({
          ruta,
          raw,
          data,
          id: slug(nombre),
          cuerpo: raw.slice(bloque[0].length),
        });
      }

      // Solo se puede enlazar a notas que también se publican; el resto de
      // wikilinks apuntarían a páginas inexistentes.
      const publicados = new Set(publicables.map((n) => n.id));

      // Segunda pasada: ya se sabe qué destinos existen, así que se pueden
      // resolver los wikilinks antes de renderizar.
      for (const nota of publicables) {
        const cuerpo = resolverWikilinks(nota.cuerpo, publicados);
        const filePath = relative(raiz, nota.ruta);
        const digest = generateDigest(nota.raw);
        const parsed = await parseData({ id: nota.id, data: nota.data, filePath });
        const rendered = await renderMarkdown(cuerpo, { fileURL: pathToFileURL(nota.ruta) });

        store.set({ id: nota.id, data: parsed, body: cuerpo, filePath, digest, rendered });
      }

      logger.info(
        `${publicables.length} nota(s) publicada(s) de ${archivos.length} del vault` +
          (ilegibles > 0 ? ` — ${ilegibles} con YAML ilegible omitida(s)` : ''),
      );
    },
  };
}

interface NotaCruda {
  ruta: string;
  raw: string;
  data: Record<string, unknown>;
  id: string;
  cuerpo: string;
}

/** Embeds de adjuntos: `![[imagen.png|150]]`. No hay ficheros que servir. */
const EMBED = /!\[\[[^\]]*\]\]/g;

/** Wikilinks: `[[Destino]]`, `[[Destino|alias]]`, `[[Carpeta/Destino#sección|alias]]`. */
const WIKILINK = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]*))?\]\]/g;

/**
 * Traduce la sintaxis de enlaces de Obsidian a Markdown estándar.
 *
 * Sin esto, el HTML publicado muestra literalmente `[[Matemáticas|matemático]]`.
 * Los destinos que también se publican quedan como enlace; el resto se degrada
 * a texto plano, para no generar enlaces rotos hacia notas privadas.
 */
export function resolverWikilinks(texto: string, publicados: Set<string>): string {
  return texto
    // Los embeds se quitan primero: si no, WIKILINK casaría con su interior.
    .replace(EMBED, '')
    .replace(WIKILINK, (_todo, destino: string, alias?: string) => {
      const nombre = destino.trim().split('/').pop() ?? '';
      const etiqueta = (alias ?? nombre).trim();
      const id = slug(nombre);
      return publicados.has(id) ? `[${etiqueta}](/notas/${id})` : etiqueta;
    });
}

async function listarMarkdown(dir: string): Promise<string[]> {
  const entradas = await readdir(dir, { withFileTypes: true, recursive: true });
  return entradas
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    // `parentPath` es Node >=20.12; `path` es el nombre antiguo del mismo dato.
    .map((e) => join((e as { parentPath?: string; path?: string }).parentPath ?? e.path ?? dir, e.name));
}

function slug(nombre: string): string {
  return nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita los diacríticos separados por NFD
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
