---
name: code-standards
description: Reglas obligatorias para escribir código en financial-calculator (Angular) — estructura de carpetas por feat, dónde va cada interface/type/constante/componente, clean code y DRY. Cárgalo SIEMPRE antes de crear o modificar código del proyecto: features nuevos, componentes, pages, services, facades, funciones de cálculo o modelos, por pequeño que sea el cambio.
---

# Estándares de código de financial-calculator

Estas reglas aplican a **todo código nuevo o modificado**. No son sugerencias.

- Frontend (Angular): [frontend.md](frontend.md)

Lee la referencia antes de escribir.

## Reglas de oro

1. **Cada cosa en su carpeta.** Nunca declares una `interface`, `type`, `enum` o constante dentro de un componente, page, service o facade. Van en `interfaces/`, `@types/`, `models/` o `constants/`.
2. **Componentes: `.ts` y `.html` siempre separados**, por pequeño que sea. Nada de `template:` inline.
3. **DRY: busca antes de crear.** Antes de escribir un componente, util, pipe, función o regla, busca si ya existe (en el feat, en `shared/`, en `core/`). Si existe algo parecido, reutilízalo o extiéndelo; no lo dupliques.
4. **Copia la estructura del feat vecino.** Antes de crear, abre un feat que ya exista (`financial-profile`, `loan-offers`, `loan-analysis`) y sigue su forma.
5. **Clean code.** Nombres que se explican solos, funciones cortas con una sola responsabilidad (SOLID), sin código muerto, sin números o strings mágicos (van a constantes).
6. **Cero comentarios.** No agregues comentarios de ningún tipo: ni JSDoc, ni comentarios en línea, ni en HTML, SCSS o configuración. Si el código necesita explicarse, renombra o divide la función. Única excepción: una función realmente compleja que no se pueda simplificar más; ahí, una sola línea que explique el porqué, no el qué.
7. **Cero impresiones en consola.** Nada de `console.log`, `console.error`, `console.warn`, `console.info` ni `console.debug`. Los errores se muestran al usuario con un toast (`MessageService` + Transloco) o se manejan sin imprimir nada.
8. **Respeta el alcance.** No refactorices código fuera de lo que se pidió. Si el archivo que tocas ya rompe estas reglas, menciónalo al final y ofrece arreglarlo; no lo cambies por tu cuenta.
9. **Los datos no salen del navegador.** No hay backend: nada de llamadas HTTP con datos del usuario, analítica ni servicios de terceros. La persistencia es solo IndexedDB.

## Flujo de trabajo

1. **Explora:** identifica el feat vecino de referencia y lo que ya existe y se puede reutilizar.
2. **Planea los archivos:** antes de escribir, lista cada archivo nuevo o modificado con su ruta, y verifica que cada uno cae en la carpeta correcta según la referencia.
3. **Escribe** siguiendo la referencia.
4. **Revisa contra el checklist** de abajo.
5. **Compila:** `npx ng build --configuration development` en `src/frontend/financial-calculator-ui`. Sin errores ni warnings nuevos en los archivos que tocaste.
6. **Prueba:** si tocaste funciones de cálculo, `npx ng test --watch=false --browsers=ChromeHeadless` en la misma carpeta.

## Checklist final

- [ ] Ninguna `interface`/`type`/`enum`/constante declarada fuera de su carpeta.
- [ ] Todo componente nuevo tiene `.ts` + `.html` separados (y `.scss` solo si hace falta).
- [ ] Componentes del feat en `components/`, pantallas ruteadas en `pages/`, lo compartido entre feats en `shared/`.
- [ ] No dupliqué nada que ya existía.
- [ ] No agregué comentarios (salvo una línea en una función realmente compleja).
- [ ] No hay `console.*`.
- [ ] Textos de UI en `es.json` **y** `en.json`.
- [ ] Toda función de cálculo nueva o modificada tiene su prueba unitaria.
- [ ] Compila sin errores ni warnings nuevos.
