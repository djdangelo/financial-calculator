# Financial Calculator

Aplicación web que le indica a una persona si puede o no tomar un préstamo, a partir de su estado financiero real y de la oferta que le hace el banco. Está pensada para el mercado financiero de Honduras y trabaja en lempiras (HNL) y dólares (USD).

> **Estado:** en desarrollo. Ya responde la pregunta principal: el asistente pide ingresos, gastos, deudas y la oferta del banco, y muestra el veredicto con los indicadores 80/40 editables, el costo anual efectivo y la tabla de amortización. También evalúa la unificación: la persona marca las deudas que pagaría con el préstamo y la app compara la cuota, el saldo cubierto y el costo total, y dice si le conviene. Permite guardar hasta cuatro ofertas y compararlas lado a lado, y muestra cómo se reparte el ingreso y cuánto de cada año va a capital y a intereses. Falta la exportación.

## Qué hace

1. **Pregunta el estado financiero de la persona:** ingresos netos (asalariado, comerciante o ambos), gastos mensuales y deudas actuales.
2. **Pide la oferta del banco:** monto, tasa anual, comisión por desembolso, plazo en meses y, de forma opcional, seguro y otros cargos.
3. **Calcula y responde:** cuota mensual, tabla de amortización, costo anual efectivo, nivel de endeudamiento y un veredicto sobre si puede tomar el préstamo.
4. **Evalúa la unificación de deudas:** compara las cuotas y el costo total de las deudas actuales contra el préstamo nuevo.
5. **Compara ofertas** de distintos bancos contra el mismo perfil financiero.

## Criterios de endeudamiento

| Indicador | Límite por defecto |
|---|---|
| Gastos + cuotas actuales + cuota nueva, sobre el ingreso neto | 80% |
| Solo cuotas de deuda, sobre el ingreso neto | 40% |

Son criterios de referencia, no normas legales: la CNBS no fija un tope y cada banco aplica su propia política. El usuario puede ajustar ambos porcentajes.

## Privacidad

La aplicación no tiene backend ni base de datos externa. Toda la información se guarda únicamente en IndexedDB, dentro del navegador del usuario, y puede borrarse desde la misma app.

## Stack

- Angular 18 (standalone, signals)
- PrimeNG 18
- Tailwind CSS 3.4
- Transloco 6 para internacionalización (español e inglés, sin textos en duro)
- IndexedDB para persistencia local

## Estructura del repositorio

```text
financial-calculator/
└── src/
    └── frontend/
        └── financial-calculator-ui/
            └── src/app/
                ├── core/        persistencia, moneda, tipo de cambio, tema, idioma
                ├── layout/      shell de la aplicación
                ├── shared/      componentes, pipes y utilidades comunes
                └── features/
                    ├── financial-profile/   ingresos, gastos y deudas actuales
                    ├── loan-offers/         ofertas de préstamo
                    └── loan-analysis/       resultado, amortización, unificación y comparación
```

La arquitectura es modular por features y sigue las mismas reglas de código y de commits (Conventional Commits con gitmoji) que el proyecto Nexo Services.

## Desarrollo local

Requiere Node.js 20 o superior.

```bash
cd src/frontend/financial-calculator-ui
npm install
npm run start
```

La app queda en `http://localhost:4200/`.

Las pruebas unitarias cubren las funciones de cálculo y la capa de persistencia:

```bash
npm run test -- --watch=false --browsers=ChromeHeadless
```

Karma usa Chrome. Si solo tienes Edge, define antes la variable de entorno `CHROME_BIN` con la ruta de `msedge.exe`.

## Despliegue

La app se publicará en GitHub Pages de forma automática, con CI/CD en GitHub Actions.

## Aviso

Los resultados son orientativos y no constituyen asesoría financiera. Las condiciones finales de un préstamo las define cada institución.
