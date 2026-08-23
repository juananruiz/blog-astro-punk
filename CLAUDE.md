# blog-astro-punk

Blog personal de Juanan Ruiz. Astro 7, salida estática, contenido en español.

## Publicar un artículo

1. Crear un `.md` en `src/content/posts/`. **El nombre del archivo es la URL**: `mi-articulo.md` → `/posts/mi-articulo`.
2. Copiar el frontmatter de un artículo existente y ajustarlo.

Campos obligatorios (el esquema está en `src/content.config.ts` y el build falla si falta alguno):

| Campo | Notas |
|---|---|
| `title` | Título mostrado |
| `description` | Resumen; sale en la portada y bajo el título |
| `category` | Solo uno de: `programacion`, `reflexiones`, `proyectos`, `lecturas` |
| `categoryLabel` | La etiqueta visible ("Programación") |
| `date` | Fecha real, sin comillas (`2026-08-10`) |
| `dateLabel` | El texto que se ve ("10 ago 2026") |
| `order` | Posición en la portada, **ascendente** |

Opcionales: `searchTitle` (texto alternativo para el buscador), `readingTime`, `featured` (saca miniatura), `image`, `imageAlt`.

Dos cosas fáciles de olvidar:

- `date` y `dateLabel` son independientes: hay que **actualizar las dos**.
- **No hay campo `draft`.** Todo `.md` que esté en `src/content/posts/` se construye y se publica, esté terminado o no.

## Comandos

```bash
npm run dev      # servidor local
npm run build    # genera dist/
npm run preview  # sirve dist/
```

## Despliegue

Vercel está conectado al repositorio de GitHub: **un push a `main` dispara el despliegue**. La salida es estática (`output: 'static'` en `astro.config.mjs`), sin adaptador — Vercel detecta Astro y sirve `dist/`. No hace falta `vercel.json`.

## El build tiene que ser reproducible en Vercel

**Nunca referenciar ficheros de fuera del repositorio.** El entorno de Vercel solo tiene lo que está versionado: cualquier ruta absoluta local funciona en el Mac y tumba el build en producción.

Ya pasó una vez: hubo una integración que leía notas desde un vault de Obsidian con la ruta `/Users/juananruiz/Library/Mobile Documents/...`. Funcionaba en local y rompía el despliegue. Se revirtió en `b1bba19`.

Si en el futuro hace falta contenido externo, tiene que llegar por variable de entorno definida **también en Vercel**, y el build debe seguir funcionando cuando esa variable no exista.

## Convenciones

- Contenido, comentarios y mensajes de commit **en español, con tildes correctas**.
- **No editar la prosa de los artículos sin preguntar**: son textos del autor, erratas incluidas.
