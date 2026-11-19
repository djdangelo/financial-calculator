# Frontend — Angular (`src/frontend/financial-calculator-ui/src/app`)

## Estructura de un feat

```
features/<feat>/
├── <feat>.routes.ts              rutas propias (lazy), si el feat tiene varias pantallas
├── @types/<nombre>.type.ts       solo `export type` (uniones, alias): 'salary' | 'business'
├── interfaces/<nombre>.interface.ts   formas internas de UI/estado y resultados de cálculo (NO datos guardados)
├── models/<nombre>.model.ts      formas de los datos que se guardan en IndexedDB
│   └── index.ts                  barrel: export * from './<nombre>.model'
├── constants/<feat>.constant.ts  constantes, mapas de estilos, defaults, opciones de selects
├── functions/<nombre>.function.ts   funciones puras del feat (sin inyección, sin estado)
│   └── <nombre>.function.spec.ts    prueba unitaria, obligatoria para el cálculo financiero
├── services/<nombre>.service.ts  solo persistencia
│   └── index.ts
├── facades/<nombre>.facade.ts    estado (signals) + orquestación de services + toasts
│   └── index.ts
├── components/<nombre>/          componentes reutilizables DENTRO del feat
│   ├── <nombre>.component.ts
│   ├── <nombre>.component.html
│   └── <nombre>.component.scss   (solo si Tailwind no alcanza)
└── pages/<nombre>/               pantallas ruteadas
    ├── <nombre>.component.ts
    └── <nombre>.component.html
```

### ¿Dónde va cada cosa?

| Qué | Dónde |
|---|---|
| Forma de un dato que se guarda en IndexedDB | `models/*.model.ts` |
| Interface de estado, vista interna o resultado de cálculo | `interfaces/*.interface.ts` |
| Unión/alias (`type X = 'a' \| 'b'`) | `@types/*.type.ts` |
| Constante, mapa de estilos, valores por defecto | `constants/*.constant.ts` |
| Lógica pura del feat (cuota, amortización, indicadores, veredicto) | `functions/*.function.ts` |
| Componente usado solo en este feat | `components/<nombre>/` |
| Pantalla con ruta | `pages/<nombre>/` |
| Componente/pipe/util/directiva usado en **2+ feats** | `shared/components`, `shared/pipes` (`*.pipe.ts`), `shared/utils` (`*.util.ts`), `shared/directives` |
| Singleton de toda la app (persistencia, moneda, tipo de cambio, tema, idioma) | `core/` (`core/services`, `core/constants`, `core/@types`, `core/config`, …) |
| Parámetros de mercado (límites 80/40, monedas, tipo de cambio sugerido) | `core/constants` |

**Prohibido:** declarar `interface`, `type`, `enum` o `const` exportadas dentro de un `.component.ts`, `.service.ts` o `.facade.ts`. Si te hace falta una, créala en su carpeta y después impórtala.

Si una carpeta no existe aún en el feat (`interfaces/`, `constants/`…), créala.

## Componentes

- `standalone: true`, `changeDetection: ChangeDetectionStrategy.OnPush`.
- **Siempre `templateUrl`** con su `.html`; nunca `template:` inline. `styleUrls` solo si hay `.scss`.
- `inject()` en lugar de constructor.
- Entradas/salidas con `input()`, `input.required()`, `output()`, `model()`.
- Estado local con `signal()`; derivados con `computed()`. La lógica va en el `.ts`, no en el template.
- Suscripciones con `takeUntilDestroyed(this.destroyRef)`.
- Control flow nuevo: `@if`, `@for (… ; track …)`, `@switch`, `@let`. No `*ngIf`/`*ngFor`.
- Importa solo lo que el template usa (`NgTemplateOutlet`, `RouterLink`, `TranslocoDirective`, módulos de PrimeNG puntuales).
- Selector `app-<nombre>`; clase `<Nombre>Component`; archivo `<nombre>.component.ts` en kebab-case.

## Services y facades

**Service** = solo persistencia. No hay HTTP: cada service lee y escribe en IndexedDB a través de `IndexedDbRepository` (`@core/repositories/indexed-db.repository`), y no contiene reglas de negocio ni cálculo. Si algún día hay backend, lo único que cambia son los services.

```ts
@Injectable({ providedIn: 'root' })
export class XService {
  private readonly repository = inject(IndexedDbRepository);

  getAll(): Promise<X[]> {
    return this.repository.getAll<X>('<store>');
  }
}
```

- Los stores se declaran en `core/constants/database.constant.ts` (`STORE_NAMES`) y en `core/@types/store-name.type.ts`. Agregar uno nuevo exige subir `DATABASE_VERSION`.
- Todo modelo guardado extiende `StoredRecord` (`id: string`).

**Facade** = estado y orquestación:
- Signals públicos: datos (`items = signal<X[]>([])`), `isLoading`, `isSaving`, y `computed` derivados.
- Métodos que llaman al service y actualizan los signals.
- Toasts con `MessageService` + claves de Transloco; callback opcional `onSuccess`.
- Los componentes usan la facade, no el service directo.

Exporta services, facades y models por su `index.ts` e impórtalos desde el barrel (`from '../models'`).

## Cálculo financiero

- Todo el cálculo vive en `functions/` como funciones puras: reciben datos y devuelven datos, sin inyección, sin signals y sin acceso a IndexedDB.
- Cada función de cálculo tiene su `*.function.spec.ts` con casos verificables a mano.
- Las tasas, los límites y los plazos nunca se escriben en duro dentro de una función: llegan como parámetro o salen de `constants/`.
- Las tasas y los límites se manejan siempre como porcentaje tal como lo escribe el usuario (24 es 24%), en campos con sufijo `Percent`. La conversión a proporción se hace solo dentro de las funciones, con `percentToRatio` de `@core/functions/finance.function`.
- El dinero se redondea a dos decimales con `roundMoney`, y solo en el resultado de cada función, no en los pasos intermedios.

## Imports

- Entre feats o hacia shared/core/layout: alias `@core/*`, `@shared/*`, `@features/*`, `@layout/*`.
- Dentro del mismo feat: rutas relativas.

## UI

- **Textos:** siempre con Transloco (`*transloco="let t; read: '<feat>'"` o el pipe). Agrega la clave en `public/assets/i18n/es.json` **y** `en.json`. No dejes textos en duro, tampoco en `aria-label`, `title` o `placeholder`.
- **Estilos:** Tailwind + PrimeNG. Cada color con su par `dark:` (paletas `surface-*` y `primary-*`, que salen del tema de PrimeNG). Responsive mobile-first (`sm:`/`md:`/`lg:`); verifica que nada se rompa en pantallas angostas.
- **Clases dinámicas:** escribe las clases completas en un mapa de `constants/`; nunca las armes interpolando (`` `text-${color}-500` ``), Tailwind no las detecta.
- **Iconos:** PrimeIcons (`pi pi-*`). No cargues fuentes ni librerías desde un CDN: todo se sirve desde la propia app.
- **Reutiliza** lo que ya hay en `shared/components` antes de crear uno nuevo.

## Piezas reutilizables que ya existen

Revisa esta lista antes de crear algo parecido.

| Necesitas | Usa |
|---|---|
| Campo con etiqueta, ayuda y error | `shared/components/form-field` |
| Entrada de dinero con símbolo de moneda | `shared/components/money-input` |
| Selector HNL/USD | `shared/components/currency-toggle` |
| Pantalla de un paso del asistente (stepper, título, aviso de incompleto, Atrás/Continuar y panel lateral `wizardAside`) | `shared/components/wizard-step-frame` |
| Pasos del asistente sueltos | `shared/components/wizard-stepper`, `wizard-navigation`, `shared/utils/wizard.util.ts`, `shared/constants/wizard.constant.ts` |
| Guard que impide saltarse pasos | `wizardStepGuard` (`@shared/guards/wizard-step.guard`) |
| Mostrar dinero en el template | `MoneyPipe` (`shared/pipes/money.pipe.ts`) |
| Mostrar un porcentaje en el template | `PercentValuePipe` (`shared/pipes/percent-value.pipe.ts`) |
| Convertir o sumar montos en distintas monedas | `convertAmount`, `sumInCurrency` (`@core/functions/currency.function`) |
| Formatear dinero o tipo de cambio en TypeScript | `formatMoney`, `formatExchangeRate` (`@core/functions/currency.function`) |
| Redondear dinero, porcentajes, tasa mensual, sumas, formato de porcentaje | `roundMoney`, `percentToRatio`, `ratioToPercent`, `monthlyRateFromAnnualPercent`, `sumAmounts`, `formatPercent` (`@core/functions/finance.function`) |
| Límites de tasa, plazo, comisión y decimales | `@core/constants/finance.constant` |
| Análisis completo de una oferta (cuota, costo, indicadores, veredicto) | `analyzeLoan` (`@features/loan-analysis/functions/loan-analysis.function`) |
| Crear, reemplazar, quitar u ordenar registros en un arreglo | `createRecordId`, `upsertRecord`, `removeRecord`, `sortByCreation` (`@core/functions/record.function`) |
| Fechas ISO y su formato por idioma | `toIsoDate`, `formatIsoDate` (`@core/functions/date.function`) |
| Tipo de cambio, moneda del resumen y límites 80/40 del usuario | `AppSettingsFacade` (`@core/facades/app-settings.facade`) |
| Aviso de "cambios guardados" | `SaveFeedbackService` (`@core/services/save-feedback.service`) |
| Borrar todos los datos del usuario | `UserDataService` (`@core/services/user-data.service`) |
| Imprimir o saber si se está imprimiendo (fuerza el tema claro) | `PrintService` (`@core/services/print.service`); en el template, `print:hidden` y `hidden print:block` |
| `localStorage` sin errores en modo privado | `readLocalStorage`, `writeLocalStorage` (`@core/functions/local-storage.function`) |

Si agregas una pieza compartida nueva, súmala a esta tabla.
