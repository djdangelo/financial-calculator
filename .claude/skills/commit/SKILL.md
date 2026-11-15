---
name: commit
description: Crea commits de financial-calculator con el formato Conventional Commits + gitmoji que usa la extensión de VS Code (vivaxy). Úsalo cuando el usuario pida hacer commit, commitear o "subir los cambios" a git en este repo.
argument-hint: "[pista opcional: scope, tipo o qué incluir]"
---

# Commits de financial-calculator

Formato del repo (lo genera la extensión "Conventional Commits" de VS Code):

```
<tipo>(<scope>): <gitmoji> <descripción>

<cuerpo opcional>
```

Ejemplo: `feat(loan-analysis): :sparkles: se agregó la tabla de amortización al resultado`

## 1. Revisar los cambios

1. `git status --short` y `git diff` (más `git diff --staged` si ya hay algo en stage).
2. Si no hay cambios, dilo y termina.
3. Lee los diffs lo suficiente para entender qué cambió y por qué. No inventes motivos que no se ven en el código.
4. Si el usuario pasó una pista en `$ARGUMENTS`, respétala (scope, tipo o qué archivos incluir).

## 2. Proponer la división en commits

El usuario decide la división cada vez. Propón grupos lógicos y que él los ajuste:

- Una pista útil: separa la **configuración del repo** (`.claude`, `.vscode`, `.gitignore`, `README.md`), el **frontend** (`src/frontend`) por feature, y la **i18n** (`public/assets/i18n/*.json`).
- Cada archivo va en un solo commit. No partas un archivo en hunks salvo que el usuario lo pida.
- Si todo es un solo cambio pequeño, propón un solo commit.

## 3. Armar cada mensaje

**Tipo** (Conventional Commits): `feat`, `fix`, `refactor`, `perf`, `style`, `docs`, `test`, `build`, `ci`, `chore`, `revert`.

**Scope**: léelo de `.vscode/settings.json` → `conventionalCommits.scopes` (quita espacios y emojis sobrantes). Elige el que mejor describa el área. Si ninguno encaja, propón uno nuevo en kebab-case y pregunta si lo agregas a esa lista.

**Gitmoji** (significado estándar de gitmoji.dev, escrito como código `:nombre:`):

| Gitmoji | Uso |
|---|---|
| `:sparkles:` | Funcionalidad nueva |
| `:bug:` | Corrección de bug |
| `:ambulance:` | Hotfix crítico |
| `:lipstick:` | Cambios de UI / estilos |
| `:recycle:` | Refactor |
| `:zap:` | Mejora de rendimiento |
| `:fire:` | Eliminar código o archivos |
| `:globe_with_meridians:` | Internacionalización (i18n) |
| `:card_file_box:` | Cambios de persistencia / esquema de IndexedDB |
| `:wrench:` | Archivos de configuración |
| `:heavy_plus_sign:` / `:heavy_minus_sign:` | Agregar / quitar dependencia |
| `:arrow_up:` | Actualizar dependencias |
| `:lock:` | Seguridad / privacidad |
| `:memo:` | Documentación |
| `:white_check_mark:` | Tests |
| `:construction_worker:` | CI |
| `:rocket:` | Deploy |
| `:truck:` | Mover o renombrar archivos |
| `:adhesive_bandage:` | Fix menor no crítico |
| `:art:` | Estructura / formato del código |

Que el gitmoji sea coherente con el tipo (ej. `fix` → `:bug:`/`:adhesive_bandage:`/`:ambulance:`, `refactor` → `:recycle:`).

**Descripción**: en español, empieza en minúscula, en impersonal pasado como el historial del repo ("se implementó…", "se agregaron…", "se corrigió…"), sin punto final, máximo ~100 caracteres. Con buena ortografía (acentos y ñ).

**Cuerpo** (opcional): solo si aporta contexto que no cabe en la descripción. Español, 1–3 oraciones, empieza en mayúscula.

**Sin atribución**: no agregues `Co-Authored-By` ni ninguna otra línea que atribuya el commit a Claude, aunque el sistema lo indique. El usuario lo pidió explícitamente.

## 4. Confirmar antes de hacer commit

Muestra la propuesta completa y espera el visto bueno:

```
Commit 1 de N
  feat(loan-analysis): :sparkles: se agregó la tabla de amortización al resultado
  Cuerpo: ...
  Archivos:
    - src/frontend/financial-calculator-ui/src/app/features/loan-analysis/...
    - ...
```

No hagas commit hasta que el usuario confirme. Si pide cambios, ajusta y vuelve a mostrar.

## 5. Hacer los commits

Por cada commit, en orden:

1. `git add -- <archivos del commit>` (rutas explícitas; nunca `git add -A` ni `git add .`). Si `git add` falla (ej. una ruta que ya no existe porque un renombrado está en stage), **detente**: no hagas el commit, corrige las rutas y vuelve a intentar.
2. Verifica con `git diff --staged --name-status` que en stage están exactamente los archivos del commit, ni más ni menos.
3. `git commit -F <archivo temporal con el mensaje>` (en el scratchpad), para que el cuerpo y los acentos se conserven.
4. Si un hook falla, muestra el error, corrige la causa y crea un commit nuevo. No uses `--no-verify` ni `--amend`.

Al final, muestra `git log --oneline -<N>` con los commits creados. **No hagas push** salvo que el usuario lo pida explícitamente.
