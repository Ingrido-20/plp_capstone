# Flowgard — KPC Predictive Maintenance

Control room dashboard for the Flowgard pipeline predictive-maintenance prototype: live pump fleet risk, the Flowgard reconciliation engine (physics-referenced pressure residual), model performance, and maintenance workflows across 13 KPC pump stations (Mombasa to Kisumu).

Built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
| --- | --- |
| `/` | Control room overview — fleet stats, network status, priority actions, model confidence |
| `/network` | Pipeline network map and station detail |
| `/pumps` | Filterable pump fleet table |
| `/flowgard` | Flowgard reconciliation engine explanation and HDI rankings |
| `/alerts` | Active alerts above the risk threshold |
| `/workorders` | Auto-generated work orders |
| `/schedule` | Condition-based service schedule |
| `/model` | Model performance and confusion matrix |
| `/roi` | ROI and business case |
| `/settings` | Alert thresholds and configuration |

## Project structure

```
app/            Route pages (App Router)
components/     UI primitives (components/ui) and layout/feature components
context/        Global app state (toasts, pump detail modal)
data/           Typed mock snapshot data
lib/            Shared formatting/selector utilities
```

## Data

Pump and station data in `data/mockData.ts` is a static snapshot. Sensor readings are synthetic and physics-informed; the classification/RUL model metrics and SHAP explanations are real model output evaluated on that synthetic data. See the backend repository for the data generation and modeling pipeline.
