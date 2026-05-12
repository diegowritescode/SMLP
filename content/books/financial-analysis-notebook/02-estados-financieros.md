# Estados financieros esenciales para decisión de inversión

El análisis financiero útil no consiste en memorizar conceptos, sino en enlazar **estructura de ingresos**, **eficiencia operativa**, **necesidades de capital** y **riesgo de liquidez** dentro de una narrativa consistente.  
Si un lector técnico no puede reconstruir esa narrativa en pocos minutos, la decisión de inversión suele quedar expuesta a sesgos.

> Regla operativa: primero valida calidad de flujo de caja; después evalúa múltiplos.  
> Un múltiplo barato sin caja sostenible normalmente es una trampa de valoración.

## 1. Lectura integrada de los tres estados

Los tres estados principales son balance general, estado de resultados y flujo de caja. Deben leerse como un sistema:

- El **estado de resultados** explica rentabilidad contable por periodo.
- El **balance general** explica la estructura de activos y fondeo en una fecha.
- El **flujo de caja** explica la conversión real de utilidad en liquidez.

Cuando hay desacople fuerte entre utilidad y caja, se debe investigar al menos:

1. crecimiento agresivo de cuentas por cobrar,
2. presión de inventario por desaceleración comercial,
3. gasto de capital (CapEx) elevado frente a depreciación,
4. cambios en políticas de reconocimiento de ingresos.

### 1.1 Puente visual de márgenes y caja

![Evolución trimestral de margen EBIT y caja operativa normalizada.](/api/content-assets/financial-analysis-notebook/financial-bridge.svg "Figura 1. Puente de rentabilidad operativa y caja para validar consistencia entre margen y liquidez.")

El patrón buscado en empresas sanas es una trayectoria donde el margen operativo mejora y, con un pequeño rezago, la caja operativa normalizada acompaña esa mejora.

## 2. Estado de resultados: calidad de crecimiento

No basta con observar crecimiento de ingresos. En contenido financiero/técnico se recomienda revisar:

- crecimiento orgánico vs crecimiento por precio,
- estabilidad de margen bruto,
- elasticidad de gasto operativo,
- sensibilidad del EBIT frente a escenarios conservadores.

### 2.1 Métricas mínimas por trimestre

| Métrica | Q1 | Q2 | Q3 | Q4 |
|:--|--:|--:|--:|--:|
| Ingresos (USD MM) | 124.2 | 131.6 | 140.8 | 147.1 |
| Margen Bruto (%) | 48.1% | 47.6% | 48.9% | 49.2% |
| EBIT (USD MM) | 18.4 | 20.1 | 23.3 | 24.6 |
| Margen EBIT (%) | 14.8% | 15.3% | 16.5% | 16.7% |
| Utilidad Neta (USD MM) | 11.2 | 12.4 | 14.1 | 14.8 |

Interpretación rápida:

- Si ingresos suben pero margen bruto cae de forma estructural, la ventaja competitiva puede estar deteriorándose.
- Si margen bruto se mantiene pero EBIT no escala, el problema está en Opex o en estructura comercial.

## 3. Balance general: disciplina de capital

El balance general responde dos preguntas críticas:

1. ¿Qué tan exigente es el negocio en capital de trabajo?
2. ¿Qué tan resiliente es la estructura de deuda ante un shock de tasa?

Para un screening inicial, enfócate en:

- `Deuda Neta / EBITDA`
- cobertura de intereses
- rotación de inventarios
- días de cuentas por cobrar

```text
Deuda Neta = Deuda Financiera Total - Caja y Equivalentes
Deuda Neta / EBITDA = medida de apalancamiento operacional
```

### 3.1 Señales de alerta temprana

- Deuda neta creciendo más rápido que EBITDA por más de dos periodos.
- Aumento simultáneo de cuentas por cobrar e inventarios con menor crecimiento de ventas.
- Disminución de cobertura de intereses en contexto de tasas al alza.

## 4. Flujo de caja: prueba de realidad

La caja operativa debe validar la historia que cuenta el estado de resultados. Cuando eso no ocurre, el análisis necesita mayor profundidad antes de pasar a valoración por múltiplos o DCF.

### 4.1 Tabla de conversión de utilidad a caja

| Concepto | Q1 | Q2 | Q3 | Q4 |
|:--|--:|--:|--:|--:|
| Utilidad Neta (USD MM) | 11.2 | 12.4 | 14.1 | 14.8 |
| Depreciación y amortización | 4.9 | 5.1 | 5.3 | 5.5 |
| Variación Capital de Trabajo | -6.2 | -4.0 | -3.1 | -2.4 |
| Flujo de Caja Operativo (USD MM) | 9.4 | 13.5 | 16.3 | 17.9 |
| CapEx (USD MM) | -7.1 | -7.4 | -8.0 | -8.3 |
| Flujo de Caja Libre (USD MM) | 2.3 | 6.1 | 8.3 | 9.6 |

Nota técnica: una mejora en variación de capital de trabajo suele preceder una normalización del flujo libre, incluso si la utilidad neta aún crece lentamente.

## 5. Checklist operativo para cerrar capítulo

Antes de avanzar al siguiente capítulo, valida que puedas responder:

- ¿Cuál fue el principal driver del crecimiento de EBIT?
- ¿La caja operativa confirma la mejora de margen?
- ¿El apalancamiento neto está bajo control en escenario de tasas altas?
- ¿El flujo libre financia crecimiento sin deteriorar solvencia?

Si al menos una respuesta queda ambigua, marca esa sección y vuelve al dato primario antes de tomar una decisión de posición.

