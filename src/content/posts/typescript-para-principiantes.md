---
title: TypeScript para principiantes
description: Una nueva forma de abordar la escritura de JavaScript con más garantías y con un código más legible. 
category: programacion
categoryLabel: Programación
date: 2026-07-03
dateLabel: 3 jul 2026
order: 1
image: "/img/gemini_escritorio_vintage_logo_ts.webp"
imageAlt: "Mesa vintage con maquina de escribir y un cuaderno con el logo de TypeScript Generada por IA"
tags: ["TypeScript", "Lenguajes", "programación"]
featured: true
---

## ¿Qué es TypeScript?

TypeScript es un lenguaje de programación creado por Microsoft en 2012. Está diseñado para escribir programas que luego se convierten a JavaScript, que es el lenguaje que entienden los navegadores web y el entorno de ejecución Node.js.

**¿Por qué no usar directamente JavaScript?**
JavaScript es muy flexible, pero esa flexibilidad puede generar errores difíciles de detectar. TypeScript añade un sistema de **tipos**: te obliga a declarar qué clase de datos maneja cada variable y función. Así, muchos errores se detectan *antes de ejecutar el programa*, en el momento en que escribes el código.

Ejemplo de problema típico en JavaScript:

```javascript
// JavaScript: esto no da error al escribirlo, solo al ejecutarlo
let precio = "diez"; // ¡es un texto, no un número!
let descuento = precio * 0.1; // resultado: NaN (no es un número)
```

Con TypeScript, ese error aparecería en tu editor antes de ejecutar nada. 

Es importante entender que cualquier código que funcione en javascript funcionará en typescript aunque el compilador advierta de los errores.

## Requisitos previos

Antes de instalar TypeScript necesitas tener instalado **Node.js**, que es un programa que permite ejecutar código fuera del navegador. Puedes descargarlo desde [nodejs.org](https://nodejs.org).

Para comprobar que lo tienes instalado, abre una terminal y escribe:

```bash
node --version
# Ejemplo de salida: v20.11.0
```

## Instalación

Una vez tienes Node.js, instala TypeScript de forma global con este comando:

```bash
npm install -g typescript
```

Comprueba que se instaló correctamente:

```bash
tsc --version
# Ejemplo de salida: Version 5.4.5
```

> `tsc` es el compilador de TypeScript. Convierte tus archivos `.ts` en archivos `.js`.

Si ya lo tienes instalado y necesitas actualizar de manera global para todos tus proyectos

```bash
npm install -g typescript@latest
```

Si solo lo quieres actualizar en el proyecto actual (actualizando el `package.json`)

```bash
npm install typescript@latest --save-dev
```

## Tu primer archivo TypeScript

Crea un archivo llamado `hola.ts` con este contenido:

```typescript
// Declaramos una variable de tipo texto (string)
let nombre: string = "Pepe";

// Mostramos un saludo en la consola
console.log("Hola, " + nombre);
```

Ahora compílalo:

```bash
tsc hola.ts
```

Esto genera un archivo `hola.js`. Ejecútalo con Node.js:

```bash
node hola.js
# Salida: Hola, Pepe
```

## Tipos básicos

TypeScript tiene tipos para los datos más comunes:

```typescript
// string — texto
let nombre: string = "Ana";
let ciudad: string = "Sevilla";

// number — número (entero o decimal)
let edad: number = 35;
let precio: number = 9.99;

// boolean — verdadero o falso
let activo: boolean = true;
let esMayor: boolean = false;
```

Si intentas asignar un tipo incorrecto, TypeScript te avisa:

```typescript
let edad: number = "treinta y cinco"; // ❌ Error: se esperaba un número
```

## Arrays (listas)

Un array es una lista de elementos. En TypeScript debes indicar qué tipo de elementos contiene:

```typescript
// Lista de nombres (textos)
let frutas: string[] = ["manzana", "naranja", "plátano"];

// Lista de precios (números)
let precios: number[] = [1.5, 2.0, 0.8];

// Acceder al primer elemento (los índices empiezan en 0)
console.log(frutas[0]); // manzana
```

## Funciones tipadas

Las funciones también pueden declarar el tipo de cada parámetro y el tipo del valor que devuelven:

```typescript
// Parámetros: nombre (string), edad (number)
// Retorno: string
function presentar(nombre: string, edad: number): string {
    return "Me llamo " + nombre + " y tengo " + edad + " años.";
}

let mensaje = presentar("Laura", 28);
console.log(mensaje); // Me llamo Laura y tengo 28 años.
```

Si llamas a la función con argumentos del tipo incorrecto, TypeScript lo detecta:

```typescript
presentar(42, "Laura"); // ❌ Error: los tipos están al revés
```

### Funciones sin valor de retorno

Si una función no devuelve nada, el tipo de retorno es `void`:

```typescript
function saludar(nombre: string): void {
    console.log("Hola, " + nombre + "!");
}

saludar("Carlos"); // Hola, Carlos!
```

## Interfaces — definir la forma de un objeto, componente o clase

Una **interfaz** describe la estructura de un objeto: qué propiedades tiene y de qué tipo es cada una. 

Junto con **type** es ideal para pasar datos estructurados a las funciones cuando estos son más complejos que un par de simples variables.

La convención es escribir las interfaces y los type, que verás luego, con CamelCase. 

```typescript
// Definimos la forma de un "Producto"
interface Producto {
    nombre: string;
    precio: number;
    disponible: boolean;
}

// Creamos un objeto que respeta esa forma
let camisa: Producto = {
    nombre: "Camisa azul",
    precio: 25.99,
    disponible: true,
};

console.log(camisa.nombre);  // Camisa azul
console.log(camisa.precio);  // 25.99

// Crea una función que utiliza la interfaz
function agregarAlCarrito(producto: Producto): void {
 //...
}
```

Si olvidamos alguna propiedad o usamos el tipo incorrecto, TypeScript nos avisa de inmediato.

## Type (Type Alias)

Los type son declaraciones de los tipos que va a admitir un tipo de dato o estructura. Funciona como una regla de validación.

Le indica al compilador qué forma exacta deben tener tus variables, funciones u objetos, ayudándote a capturar errores antes de que el código se ejecute.

Los type son más versátiles que las interfaces, además de objetos y clases, pueden redefinir tipos primitivos, tipos personalizados, uniones e intersecciones.

### Type con tipos personalizados

```typescript
type ID = string | number; // El ID puede ser un texto o un número

let usuarioId: ID;
usuarioId = "usr_99"; // ✅ Correcto
usuarioId = 123;      // ✅ Correcto
usuarioId = true;     // ❌ Error: El tipo boolean no es asignable a ID
```

### Type con objetos

```typescript
type Usuario = {
  nombre: string;
  email: string;
  edad?: number; // El signo '?' significa que es opcional
};

const cliente: Usuario = {
  nombre: "Carlos",
  email: "carlos@email.com"
};
```

### Type con uniones e intersecciones

```typescript
// Unión de literales (solo permite estos tres strings exactos)
type EstadoSoporte = "abierto" | "progreso" | "cerrado";
let estado: EstadoSoporte = "abierto"; // ✅

// Intersección (Combinar tipos)
type Empleado = { id: number; puesto: string };
type Persona = { nombre: string };

type PersonalActivo = Empleado & Persona; // Tiene las propiedades de ambos
```

### Type para firmas de funciones

Especifica exactamente lo que recibe una función y lo que debe devolver.

```ts
type Operacion = (a: number, b: number) => number;

const sumar: Operacion = (x, y) => x + y;
```

## Cuando usar type o interface

En la actualidad ambos hacen casi lo mismo, pero se suelen usar como indica la siguiente tabla.

<table>
  <thead>
    <tr>
      <th>Característica</th>
      <th>Type</th>
      <th>Interface</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Objetos / Clases</td>
      <td>✅ Sí</td>
      <td>✅ Sí (Recomendado)</td>
    </tr>
    <tr>
      <td>Tipos primitivos</td>
      <td>✅ Sí</td>
      <td>❌ No</td>
    </tr>
    <tr>
      <td>Uniones / Intersecciones</td>
      <td>✅ Sí</td>
      <td>❌ No</td>
    </tr>
    <tr>
      <td>Fusión de declaraciones</td>
      <td>❌ No</td>
      <td>✅ Sí</td>
    </tr>
  </tbody>
</table>

## Próximos pasos

Con esto tienes una base sólida para empezar. Cuando quieras ir más lejos, los siguientes temas a explorar son:

- **Tipos opcionales** (`nombre?: string`) — propiedades que pueden estar o no
- **Unión de tipos** (`string | number`) — variables que aceptan más de un tipo
- **Enums** — conjuntos de valores con nombre
- **Clases** — programación orientada a objetos con tipos
- **Generics** — funciones y estructuras que funcionan con cualquier tipo

### Recursos recomendados

- [Documentación oficial de TypeScript](https://www.typescriptlang.org/docs/) — en inglés, muy completa
- [Atareao - TypeScript desde cero](https://www.youtube.com/playlist?list=PL3lTiK2rXrUGz7UuMka8_V6PwF7cGj8vr)
- [TypeScript Playground](https://www.typescriptlang.org/play) — prueba código en el navegador sin instalar nada
- [Total TypeScript (Matt Pocock)](https://www.totaltypescript.com) — tutoriales visuales y progresivos - Esta parte es gratuita: https://www.totaltypescript.com/tutorials/beginners-typescript

