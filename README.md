# blog-astro-punk

Migración a Astro del blog personal de Juanan Ruiz. Conserva el diseño, las imágenes, las fuentes locales y las interacciones de la versión HTML estática.

## Publicar un artículo

1. Crea un archivo `.md` en `src/content/posts/`.
2. Copia el bloque de metadatos de uno de los artículos existentes y actualízalo.
3. Ejecuta `npm run dev` para previsualizarlo.
4. Ejecuta `npm run build` antes de publicar.

Los campos `order`, `category`, `categoryLabel`, `dateLabel` y `description` alimentan la portada, los filtros y la página individual. La ruta se genera a partir del nombre del archivo.

## Comandos

```bash
npm run dev
npm run build
npm run preview
```
