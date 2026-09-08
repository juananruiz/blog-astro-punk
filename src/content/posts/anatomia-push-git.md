---
title: "Anatomía de un push de git"
category: programacion
categoryLabel: Programación
date: 2026-09-06
dateLabel: 6 sep 2026
description: ¿Qué son esos mensaje crípticos que aparecen cuando haces un push de git?
featured: false
---

Si eres desarrollador de código y utilizas git como [sistema de control de versiones](/posts/sistema-control-de-versiones) quizás te haya llamado la atención el mensaje tan "misterioso" que aparece cuando envías los cambios a un repositorio remoto haciendo **push**.

A continuación te pego uno de muestra y te explico cada uno de los conceptos que aparecen.

```text
teletrabajo git:(main) git push
Enumerando objetos: 84, listo.
Contando objetos: 100% (84/84), listo.
Compresión delta usando hasta 14 hilos
Comprimiendo objetos: 100% (75/75), listo.
Escribiendo objetos: 100% (76/76), 10.08 MiB | 8.68 MiB/s, listo.
Total 76 (delta 16), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (16/16), completed with 4 local objects.
To https://github.com/Universidad-de-Sevilla/teletrabajo.git
   7e76bda..2a2058e  main -> main
```

## 📦 Enumerating objects: 84, listo

Git está buscando y contando todos los archivos y metadatos (llamados "objetos") en tu carpeta local: commits, blobs de archivos, trees, etc. Hay 84 elementos diferentes.

## 📊 Counting objects: 100% (84/84), listo

Git ha terminado de procesar todos esos 84 elementos. Son los archivos y configuraciones que podrían cambiarse.

## ⚡ Compresión delta usando hasta 14 hilos

Git comprime los datos antes de enviarlos. Delta significa que compara archivos similares para guardar solo las diferencias, ahorrando espacio y tiempo. Usa hasta 14 "hilos" (procesadores) para hacerlo más rápido.

## 📦 Comprimiendo objetos: 100% (75/75), listo

75 de los 84 objetos han sido comprimidos. Git envía solo lo nuevo o lo modificado, no los archivos completos repetidos.

## 📤 Escribiendo objetos: 100% (76/76), 10.08 MiB | 8.68 MiB/s, listo

Se enviaron 76 objetos al servidor remoto, ocupando 10.08 MB a una velocidad de 8.68 MB/segundo.

## 📋 Total 76 (delta 16), reused 0 (delta 0), pack-reused 0 (from 0)

- 76 objetos nuevos (no hubo archivos anteriores que se pudieran reutilizar).
- Delta 16: de los 76 objetos, 16 son versiones actualizadas de los anteriores.
- Reused 0: Git no encontró archivos anteriores en el servidor para reutilizarlos (primera vez que envías cambios nuevos).

## 🌐 remote: Resolving deltas: 100% (16/16), completed with 4 local objects

El servidor remoto ha recibido los datos y ha reconstruido los archivos. Se completó con éxito, usando 4 de los objetos locales para finalizar el proceso.

## 🏠 To `https://github.com/Universidad-de-Sevilla/teletrabajo.git`

URL del repositorio remoto al que se está enviando.

## ✅ 7e76bda..2a2058e main -> main

Rango de commits enviados:

- 7e76bda: el último commit local
- 2a2058e: el nuevo commit en el repositorio remoto
- main -> main: actualiza la rama principal de tu proyecto en GitHub

## 📝 En resumen

Al sincronizar tu repositorio local con el remoto Git envía solo lo nuevo o lo modificado (ahorrando tiempo y datos) y confirma que los cambios ya están en el servidor remoto.

Siempre que encuentro un hueco me intereso por entender que hacen los sistemas "bajo el capó" cuando ejecutamos un comando.