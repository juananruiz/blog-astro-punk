---
title: Por qué sigo escribiendo JS sin frameworks
description: Una defensa tranquila del vanilla JS en 2026, y de entender cada engranaje del motor.
category: programacion
categoryLabel: Programación
date: 2026-08-03
dateLabel: 3 ago 2026
readingTime: 7 min de lectura
order: 1
featured: true
image: /img/sharad-kandoi-5PrHH3Xqpas-unsplash-mini.jpg
imageAlt: "Vista cenital de una librería: mesas con novedades, estanterías repletas y gente ojeando libros"
---

Cada vez que abro un proyecto nuevo me hago la misma pregunta: ¿de verdad necesito una capa más entre mi código y el navegador? La respuesta, casi siempre, es que no. Escribir JavaScript puro me obliga a entender cada pieza del mecanismo, como quien desmonta un reloj para ver por qué avanza.

## El taller antes que la fábrica

Un framework promete velocidad, pero cobra en comprensión. Prefiero el ritmo más lento del taller: cada función tiene un propósito visible, cada evento un origen que puedo seguir con el dedo.

<div class="article-inline-img"><div class="plate"><div class="img-placeholder">Sustituye por post-inline-1.jpg (imagen intermedia)</div></div></div>

No es nostalgia por los noventa. Es preferir herramientas que pueda abrir, entender y reparar yo mismo, sin depender de que alguien más mantenga la maquinaria.

> “El código más honesto es el que puedes rastrear línea por línea hasta el motor del navegador.”

## Lo que sí uso

Módulos ES nativos, Web Components cuando toca reutilizar, y muy poca dependencia externa. Suficiente engranaje, ningún exceso.

## Prueba de bloque de código en el blog

A ver que tal pinta esto

```typescript
function resolverWikilinks(texto: string, publicados: Set<string>): string {
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
```
