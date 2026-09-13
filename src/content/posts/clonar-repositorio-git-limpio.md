---
title: Clonar repositorio Git limpio
description: Cómo crear un repositorio nuevo con el estado actual del original sin arrastrar el histórico de commits. 
category: programacion
categoryLabel: Programación
date: 2026-09-12
dateLabel: 12 sept 2026
featured: false
image: "img/clonando-oveja-en-cordero.webp"
imageAlt: "Una oveja es clonada en un cordero dentro de una cápsula de cristal - imagen IA"
tags: ["repositorio", "git", "github"]
---


## ¿Por qué hacer un clon limpio en lugar de un fork?

El botón nativo de fork es útil para colaborar en proyectos ajenos, pero no para iniciar uno propio. Crear una instantánea limpia te conviene por cuatro razones:

* **Historial limpio:** Evitas arrastrar miles de commits viejos que no aportan nada a tu nuevo proyecto. Tu historial empieza desde cero. Si subiste algún dato sensible en algún momento es una buena manera de borrar el rastro.
* **Independencia:** GitHub no mostrará la etiqueta *"forked from..."* debajo de tu repositorio. Tu proyecto nacerá como un repositorio 100% independiente. En cualquier caso no olvides dar el crédito correspondiente en el README del proyecto. En función de los cambios que incorpores podrás decir que es una versión, que está basado o  que está inspirado en el repositorio original. 
* **Menos peso y más velocidad:** Los proyectos antiguos acumulan gigas de archivos borrados en su pasado. Al ignorar el historial, tu repositorio será ultraligero y rápido de clonar.
* **Portafolio profesional:** Mantiene tu perfil de GitHub ordenado y enfocado en proyectos que realmente vas a mantener tú, ideal si buscas trabajo. 

## Método 1: Sin usar la terminal.

Si no tienes Git configurado en tu terminal o prefieres la interfaz gráfica, este es el método más sencillo:

### Paso 1: Descargar el código actual

1. Ve al repositorio original en GitHub.
2. Haz clic en el botón verde **Code**.
3. Selecciona **Download ZIP** y descomprime el archivo en tu computadora. *(Al descargar el ZIP, GitHub te entrega el código limpio, sin la carpeta oculta `.git` que almacena el historial).*

### Paso 2: Crear el nuevo repositorio en GitHub

1. Ve a tu cuenta de GitHub y crea un **Nuevo Repositorio**.
2. Dale un nombre, pero **NO** marques las casillas para agregar README, `.gitignore` ni licencia (déjalo completamente vacío).

### Paso 3: Subir los archivos

1. En la página de tu nuevo repositorio vacío, haz clic en el enlace que dice **"uploading an existing file"** (subir un archivo existente).
2. Arrastra y suelta todos los archivos que descomprimiste en el Paso 1.
3. Haz clic en **Commit changes**. ¡Listo!

## Método 2: Usando la terminal 

Si prefieres usar la línea de comandos para mantener el control absoluto, sigue estos pasos secuenciales:

### Paso 1: Clonar solo el último Commit

Utilizaremos el parámetro `--depth 1`. Esto le dice a Git que descargue únicamente la superficie del repositorio, ignorando el pasado.

```bash
git clone --depth 1 URL_DEL_REPOSITORIO_ORIGINAL
```

### Paso 2: Desvincular el historial original

Entra a la carpeta que se acaba de crear y elimina la carpeta oculta `.git`. Esto borrará cualquier rastro del historial:

```bash
# Entra a la carpeta del proyecto
cd nombre-del-repositorio

# Borrar la carpeta de Git (Comando para Mac/Linux)
rm -rf .git

# Si estás en Windows (Command Prompt), usa este en su lugar:
# rmdir /s /q .git
```

### Paso 3: Inicializar tu propio repositorio desde cero

Ahora que el código está completamente "huérfano", crea un historial nuevo que empiece contigo:

```bash
git init
git add .
git commit -m "Importación inicial (Instantánea limpia)"
```

### Paso 4: Subir el código a tu cuenta de GitHub

1. Ve a tu GitHub y crea un **Nuevo Repositorio vacío** (sin README ni .gitignore).
2. Copia la URL de tu nuevo repositorio y ejecuta los siguientes comandos para subirlo:

```bash
# Reemplaza la URL con la de tu propio repositorio
git remote add origin TU_NUEVA_URL_DE_GITHUB

# Asegura que la rama principal se llame main
git branch -M main

# Sube el código
git push -u origin main
```

## Conclusión

¡Eso es todo! Ahora tienes un repositorio propio en GitHub que utiliza el código del proyecto original como base, pero con un historial de commits impecable, que empieza desde el día de hoy y bajo tu autoría. (Pero no olvides dar los créditos a los autores originales)
