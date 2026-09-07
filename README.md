# FlowGuard AI — Predictive Maintenance & Hydraulic Reconciliation Engine

**FlowGuard AI** is an end-to-end condition-based predictive maintenance, prescriptive analytics, and hydraulic reconciliation platform engineered for fluid transportation pipelines across **Kenya Pipeline Company's (KPC) 1,342 km network** (connecting Mombasa, Mtito Andei, Sultan Hamud, Nairobi, Nakuru, and Kisumu) as well as global pipeline networks (TAPS Alaska, Petrobras Santos Basin, Enbridge Mainline).

This merged repository combines the rich domain physics models, interactive 3D WebGL pump inspector, real-time SCADA fault injectors, standard orifice leak loss calculations, and Web Audio alarm synthesizer from `capstone_test1` with the modern Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4 architecture from `flowguard-frontend`.

---

## 🌟 Key Features

### 1. 🔍 Interactive 3D WebGL Centrifugal Pump Visualizer (`/pumps`)
- Built with **Three.js WebGL & Canvas fallback**.
- Renders full centrifugal pump assembly: Baseplate, Electric Drive Motor Stator with cooling fins, Stainless Steel Drive Shaft, Enclosed Centrifugal Impeller, Mechanical Face Seal, and **Inboard Roller Bearing #1** (pulsing crimson fault glow with spherical ball bearings).
- Interactive **Raycasting Pointer Listener**: Click any pump component in 3D to view live diagnostic failure states and SHAP weight attributions.

### 2. 📈 Flowgard Hydraulic Reconciliation Engine & Fault Injectors (`/flowgard`)
- Calculates physical pressure residuals between actual SCADA telemetry readings and physical hydraulic baseline simulations ($P_{\text{actual}} - P_{\text{simulated}}$).
- **Interactive Synthetic Fault Injector**: Allows testing system behavior under 4 operational modes:
  - *Normal Flow Baseline*
  - *Bearing Friction Drift* (Thermal rise + 120Hz BPFO vibration)
  - *Impeller Cavitation Spike* (Suction pressure drop + high-frequency noise)
  - *Leak Precursor Loss* (Sustained negative pressure differential)
- Computes the **Health Deviation Index (HDI)** across all 13 KPC pump stations.

### 3. 💧 Standard Orifice Fluid Leak Loss & Financial ROI Calculator (`/roi`)
- Models volumetric fluid loss rate ($Q = C_d \cdot A \cdot \sqrt{\frac{2\Delta P}{\rho}}$) across orifice breach sizes (5mm hairline crack, 25mm puncture, 50mm rupture) for 4 fluid types:
  - *AGO Diesel* (840 kg/m³)
  - *PMS Petrol* (740 kg/m³)
  - *Jet A-1 Aviation Fuel* (800 kg/m³)
  - *Light Sweet Crude Oil* (870 kg/m³)
- Calculates real-time monetary revenue-at-risk per hour, day, and year in local currency (KES, USD, BRL).
- **Financial Cost Asymmetry Matrix**: Compares KES 1,000 preventive component replacement vs. KES 103M direct cleanup cost (Kiboko/Sinai baseline) vs. KES 25 Billion class-action liability exposure.

### 4. 🗺️ Spatiotemporal GIS Network Map & Environmental Overlays (`/network`)
- Interactive pipeline topology connecting PS1 Mombasa, PS3 Mtito Andei, PS5 Sultan Hamud, PS6 Nairobi Terminal, PS7 Nakuru, and PS9 Kisumu.
- Animated SVG product flow velocity line (1,000,000 L/hr throughput).
- Environmental vulnerability layer overlay (Thange River crossing & soil porosity erosion exposure).
- Clickable Station Inspector Drawer displaying suction head elevation, nominal discharge pressure, active pump count, and local risk score.

### 5. 🚨 Live Command Control & Emergency Alert Center (`/alerts`)
- Real-time severity-coded notification feed (CRITICAL, WARNING, PRECURSOR, INFO).
- **Web Audio API Alarm Sound Synthesizer**: Sawtooth 880Hz emergency alarm tone generator with mute/unmute audio toggle.
- **Emergency Station Trip Switch**: Simulates emergency pump isolation and flow bypass.
- Test browser push notification simulator.

### 6. 🧠 ML Predictions, RUL Bounds & SHAP Explainable AI (`/model`)
- 7-Day Failure Classifier with 94.2% accuracy benchmark.
- **Monte Carlo Dropout RUL Bounds**: Regression chart displaying mean Remaining Useful Life alongside 95% upper and lower confidence bounds ($RUL = 142.5 \text{ hrs } \pm 18.2 \text{ hrs}$).
- **Global SHAP Feature Driver Waterfall**: Visual attribution breakdown (+0.48 SHAP from Flowgard pressure residual, +0.32 from bearing temp).

### 7. 🌍 Multi-Pipeline Network & Multi-Fluid Configuration Engine
- Supports switching via top navigation bar:
  1. *Kenya Pipeline Company (KPC Line 5)* — Mombasa to Kisumu (1,342 km)
  2. *Trans-Alaska Pipeline System (TAPS)* — Prudhoe Bay to Valdez (1,287 km)
  3. *Petrobras Santos Basin Offshore* — Subsea Deepwater Network (850 km)
  4. *Enbridge Mainline Network* — Edmonton to Superior (5,360 km)

---

## 📁 Project Structure

```
plp_capstone/
├── app/
│   ├── layout.tsx             # Root layout with ScadaProvider & AppProvider
│   ├── globals.css            # Tailwind CSS 4 & design system variables
│   ├── page.tsx               # Control room overview dashboard
│   ├── network/page.tsx       # Spatiotemporal GIS network map & station inspector
│   ├── pumps/page.tsx         # Pump fleet & 3D Three.js pump visualizer
│   ├── flowgard/page.tsx      # Flowgard reconciliation engine & synthetic fault injectors
│   ├── alerts/page.tsx        # Command control alert center & Web Audio alarm sound
│   ├── workorders/page.tsx    # Prescriptive dispatch work orders
│   ├── schedule/page.tsx      # Condition-based maintenance schedule
│   ├── model/page.tsx         # ML performance metrics, RUL bounds & SHAP waterfall
│   ├── roi/page.tsx           # Standard orifice leak loss calculator & ROI matrix
│   └── settings/page.tsx      # Threshold configuration & system settings
├── components/
│   ├── pumps/
│   │   ├── ThreePumpVisualizer.tsx # 3D WebGL Centrifugal Pump Inspector (Three.js)
│   │   └── PumpFleetView.tsx       # Filterable pump fleet table
│   ├── layout/
│   │   ├── Topbar.tsx              # Topbar with network, fluid, SCADA live & audio controls
│   │   └── Sidebar.tsx             # Navigation rail
│   ├── dashboard/
│   │   └── NetworkSvg.tsx          # SVG pipeline topology & animated flow
│   └── ui/                         # UI cards, badges, chips, modals, buttons
├── context/
│   ├── ScadaContext.tsx       # Global SCADA telemetry, fault injectors, audio synthesizer state
│   └── AppContext.tsx         # App toasts & modal state
├── data/
│   ├── mockData.ts            # Typed snapshot data & model metrics
│   └── types.ts               # TypeScript interfaces
├── lib/
│   ├── utils.ts               # Formatting & utility helpers
│   └── selectors.ts           # Filtering & selector helpers
└── package.json               # Next.js 16, React 19, Three.js, Lucide, Chart.js dependencies
```

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## 👥 Authors & Acknowledgments

Developed for the **PLP Capstone Project** by Team NULL_TERMINATORS / KPC Cohort.
