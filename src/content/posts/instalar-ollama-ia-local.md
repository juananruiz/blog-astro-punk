---
title: Instalar Ollama y tu IA en local.
date: 2026-04-26
dateLabel: 26 abr 2026
category: ia
categoryLabel: Inteligencia Artificial
order: 3
author: Juanan Ruiz
description: Explica la instalación de Ollama en Mac OS, Windows y Linux, la descarga de modelos en local y los usos posibles
image: "/img/gemini-llamas-nocturnas.png"
imageAlt: Imagen de gemini-llamas-nocturnas (generada por IA)
tags: ["Ollama", "IA"]
featured: true
---

Llevo unos meses corriendo modelos de lenguaje en mi propio portátil con Ollama, y cada vez que se lo enseño a alguien la primera reacción es la misma: _no me imaginaba que fuera tan fácil_. Esta guía es exactamente lo que me hubiera gustado encontrar cuando empecé — una explicación clara para instalarlo en cualquier sistema operativo, los comandos que necesitas y los pequeños tropiezos que casi todo el mundo se encuentra al principio.

## Qué es Ollama

Ollama es un programa que descarga, ejecuta y sirve modelos de lenguaje en tu propio ordenador. No envía tus prompts a ningún servidor externo: todo ocurre en local. Por debajo levanta un pequeño servidor que expone una API HTTP — la misma idea que usar OpenAI o Anthropic, pero contra `localhost`, sin cuotas, sin claves y sin internet.

Funciona con docenas de modelos abiertos: Llama 3.2 de Meta, Qwen 2.5 de Alibaba, Mistral, Gemma de Google, DeepSeek, Phi de Microsoft. Tú eliges cuál descargar y cuál ejecutar. La única limitación es la memoria y la potencia de tu equipo.

## Por qué tener un modelo local

Cuando trabajo con documentación interna o ideas que aún no quiero compartir con un proveedor externo, prefiero que el texto no salga de mi máquina. Esa es la razón principal.

Las otras tres razones que me han enganchado:

- **Cero coste por token.** Una vez descargado, lo usas todo lo que quieras. No hay factura a final de mes.
- **Latencia mínima.** El modelo responde inmediatamente; no hay viaje de ida y vuelta a un servidor remoto.
- **Funciona sin red.** En el AVE, en un avión o cuando se cae el WiFi, el modelo sigue ahí.

A cambio renuncias a la potencia bruta de los modelos frontera. Un Llama 3.2 de 3B no es GPT-5. Pero para muchas tareas — resumir, reformular, extraer datos, generar borradores, hacer de copiloto en el editor — es más que suficiente.

## Antes de empezar: ¿qué hace falta?

El único requisito serio es la **memoria RAM**. Cada modelo ocupa más o menos lo que pesa el fichero descargado, y tiene que caber en RAM mientras lo usas.

| Tu RAM | Modelos que puedes mover              |
| ------ | ------------------------------------- |
| 8 GB   | Modelos pequeños (1B–3B parámetros)   |
| 16 GB  | Modelos medianos (7B–8B parámetros)   |
| 32 GB+ | Modelos grandes (13B–70B cuantizados) |

Si tienes una GPU dedicada (NVIDIA en Linux/Windows, Apple Silicon en Mac) Ollama la usará automáticamente y todo irá mucho más rápido. Si no, irá por CPU — más lento, pero perfectamente usable para los modelos pequeños.

Yo trabajo con un MacBook M4 con 24 GB y me sirve de sobra. Creo que con configuraciones más modestas también se pueden correr algunos modelos dignamente.

## Instalación

Las instrucciones cambian un poco según el sistema, pero la lógica es la misma: instalar el programa, comprobar que arranca el servicio en segundo plano, y descargar tu primer modelo.

### macOS

Hay dos caminos. El más visual:

1. Abre [https://ollama.com/download](https://ollama.com/download) y descarga `Ollama.dmg`. También hay un comando para pegar en la terminal.
2. Arrastra Ollama a `Aplicaciones`.
3. Ábrelo. Te pedirá permiso para instalar la herramienta de línea de comandos.
4. Requiere macOS 14 Sonora o posterior.

![Captura: ventana de bienvenida de Ollama Desktop en macOS](/img/ollama-desktop-mac.png)

Si prefieres no usar la app gráfica y vivir desde la terminal, puedes usar Homebrew:

```bash
brew install ollama
brew services start ollama
```

Esto deja el servicio corriendo en segundo plano cada vez que enciendes el Mac.

### Instalación en Windows

Desde 2024 Ollama tiene instalador nativo de Windows.

1. Entra en [ollama.com/download/windows](https://ollama.com/download/windows) y descarga `OllamaSetup.exe`.
2. Ejecuta el instalador y sigue los pasos.
3. Al terminar, Ollama queda corriendo como servicio en segundo plano. Verás su icono en la bandeja del sistema, junto al reloj.

Desde 2025 también tiene interfaz gráfica como hemos visto en Mac.

Necesitas Windows 10 o posterior. La primera vez que ejecutes un comando, Windows Defender puede pedir permiso para abrir el puerto local; acéptalo.

### Instalación en Linux

Una sola línea en la terminal:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

El script detecta tu distribución, instala los binarios en `/usr/local/bin`, crea un usuario de sistema `ollama` y registra un servicio `systemd`. Si tienes una GPU NVIDIA, también instala los componentes necesarios para usarla.

Funciona en Ubuntu, Debian, Fedora, Arch y derivadas. Si quieres ver lo que va a hacer antes de ejecutarlo, descarga el script y léelo:

```bash
curl -fsSL https://ollama.com/install.sh -o install-ollama.sh
less install-ollama.sh
sh install-ollama.sh
```

También tiene interfaz gráfica para el escritorio.

## Comprobar que está vivo

Independientemente del sistema, abre una terminal nueva y escribe:

```bash
ollama --version
```

Verás algo parecido a esto:

```bash
ollama version is 0.5.7
```

Si en su lugar te aparece "comando no encontrado", cierra la terminal y abre una nueva — el instalador acaba de añadir Ollama al `PATH` y la sesión actual no se ha enterado todavía.

## Descargar tu primer modelo

Aquí es donde empieza lo divertido. Te recomiendo dos modelos para empezar.

### Empieza por uno ligero: Llama 3.2 de 3B

Este es el que arranco yo cuando quiero probar algo rápido. Pesa **2 GB** y corre cómodamente en cualquier portátil con 8 GB de RAM.

```bash
ollama pull llama3.2:3b
```

Verás algo así mientras descarga:

```bash
pulling manifest
pulling dde5aa3fc5ff... 100% ▕████████████████▏ 2.0 GB
pulling 966de95ca8a6... 100% ▕████████████████▏ 1.4 KB
pulling fcc5a6bec9da... 100% ▕████████████████▏ 7.7 KB
pulling a70ff7e570d9... 100% ▕████████████████▏ 6.0 KB
pulling 56bb8bd477a5... 100% ▕████████████████▏   96 B
pulling 34bb5ab01051... 100% ▕████████████████▏  561 B
verifying sha256 digest
writing manifest
success
```

### El siguiente paso: Qwen 3.5 de 9B

Cuando tu portátil tiene 16 GB o más, merece la pena dar el salto a un modelo de 9B parámetros. Qwen 3.5 me ha sorprendido especialmente en tareas en español y razonamiento estructurado.

```bash
ollama pull qwen3.5:9b
```

Pesa **6.6 GB** y la calidad de las respuestas es notablemente superior al de 4B.

## Tu primer prompt

```bash
ollama run llama3.2:3b
```

Te queda un prompt interactivo:

```bash
>>> Resume en tres puntos el ciclo del agua.
1. El agua se evapora desde océanos, ríos y lagos por el calor del sol.
2. El vapor sube, se enfría y se condensa formando nubes.
3. Las nubes liberan el agua en forma de lluvia, nieve o granizo, que vuelve a la superficie.

>>> /bye
```

Para salir, escribe `/bye`, `/exit` o pulsa `Ctrl+D`.

## La API local

Lo que más me gusta de Ollama es que, además de la terminal, expone una API HTTP en `http://localhost:11434`. Esto es lo que abre la puerta a integrarlo con tus propios scripts, con extensiones del editor y con millones de herramientas.

Una llamada cruda con `curl`:

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:3b",
  "prompt": "Escribe un haiku sobre Sevilla",
  "stream": false
}'
```

La respuesta llega en JSON. Desde aquí puedes construir cualquier cosa — desde un cliente de chat propio hasta un script que resuma tus correos a primera hora de la mañana.

## Errores frecuentes

**"command not found: ollama"** después de instalar.
Cierra la terminal y abre una nueva. El instalador modifica el `PATH` y la sesión actual no lo ve hasta reiniciarla. En Mac, comprueba también que `/usr/local/bin` o `/opt/homebrew/bin` estén en tu `PATH`.

**El modelo va lentísimo y el ventilador parece un secador.**
El modelo no cabe en RAM y está usando memoria virtual. Prueba uno más pequeño: si estabas con 7B, baja a 3B. Otra opción es usar variantes cuantizadas más agresivamente (`:q4_0`, `:q3_K_M`) que ocupan menos a costa de algo de calidad.

**Windows bloquea la conexión a `localhost:11434`.**
Es Windows Defender pidiendo permiso. La primera vez que un programa intenta usar el puerto local, te aparecerá un cuadro de diálogo. Acepta el acceso para "redes privadas".

**Espacio en disco que crece sin parar.**
Cada modelo descargado vive en `~/.ollama/models`. Si descargas varios para probar, ocupan rápido decenas de gigas. Listas con `ollama list` y borras con `ollama rm <modelo>`.

## Y a partir de aquí, qué

Una vez tienes Ollama corriendo y un par de modelos descargados, las opciones son enormes:

- Conectar tu editor (Zed, VS Code, Neovim o cualquiera de la familia JetBrain) a tu modelo local para usarlo como copiloto offline. Tienes la [documentación en la web de ollama]()
- Descargar la aplicación de escritorio de ollama, aunque probablemente lo hayas hecho ya. Permite adjuntar archivos, búsquedas web, memoria de conversaciones pasadas y sigue mejorando cada día (literal).
- Construir un pequeño script que resuma o reformule textos desde la línea de comandos.
- Probar modelos especializados: `codellama` para código, `nomic-embed-text` para embeddings, `llava` para multimodal.

Todo esto sin pagar, sin enviar nada al exterior y sin depender de ningún proveedor. Para mí ese es el verdadero atractivo: tener un trozo de inteligencia artificial que es mío, vive en mi máquina y me obedece a mí (cuando quiere).
