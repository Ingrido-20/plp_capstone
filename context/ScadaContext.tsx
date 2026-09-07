"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export type FaultMode = "normal" | "bearing" | "cavitation" | "leak";

export type PipelineCompany = "kpc" | "taps" | "petrobras" | "enbridge";

export type FluidType = "ago" | "pms" | "jeta1" | "crude";

export type PumpComponentKey = "bearing" | "motor" | "seal" | "impeller";

export interface CompanyProfile {
  id: PipelineCompany;
  name: string;
  shortName: string;
  pipelineLength: string;
  currency: string;
  currencySymbol: string;
  throughputLhr: number;
  stations: string[];
  lossMultiplier: number;
}

export interface FluidProfile {
  id: FluidType;
  name: string;
  shortName: string;
  densityKgM3: number;
  viscosityCst: number;
  pricePerLiterLocal: number; // in company currency
}

export interface TelemetryState {
  vibration: number;       // mm/s RMS
  temperature: number;     // °C
  pressure: number;        // bar
  motorCurrent: number;    // Amps
  flowgardResidual: number; // bar (P_actual - P_simulated)
  rulHours: number;        // Mean RUL in hours
  rulCiLow: number;
  rulCiHigh: number;
}

export interface ScadaContextType {
  // Telemetry & Fault Injection
  telemetry: TelemetryState;
  activeFault: FaultMode;
  setFaultMode: (mode: FaultMode) => void;
  isTelemetryLive: boolean;
  setIsTelemetryLive: (live: boolean) => void;

  // Pipeline & Fluid Selection
  selectedCompany: PipelineCompany;
  setSelectedCompany: (company: PipelineCompany) => void;
  companyInfo: CompanyProfile;
  selectedFluid: FluidType;
  setSelectedFluid: (fluid: FluidType) => void;
  fluidInfo: FluidProfile;

  // Station & Component Selection
  selectedStationCode: string;
  setSelectedStationCode: (code: string) => void;
  selectedPumpId: string | null;
  setSelectedPumpId: (id: string | null) => void;
  selectedComponent: PumpComponentKey;
  setSelectedComponent: (part: PumpComponentKey) => void;

  // Weather Overlay & Audio Controls
  weatherOverlayVisible: boolean;
  setWeatherOverlayVisible: (visible: boolean) => void;
  audioMuted: boolean;
  setAudioMuted: (muted: boolean) => void;
  triggerEmergencyTrip: () => void;
  playAlarmBeep: () => void;

  // Alert Feed
  customAlerts: Array<{ id: string; title: string; time: string; severity: "critical" | "warning" | "info" }>;
  addCustomAlert: (title: string, severity?: "critical" | "warning" | "info") => void;
}

const companyProfiles: Record<PipelineCompany, CompanyProfile> = {
  kpc: {
    id: "kpc",
    name: "Kenya Pipeline Co. (KPC Line 5)",
    shortName: "KPC Line 5",
    pipelineLength: "1,342 km",
    currency: "KES",
    currencySymbol: "KES ",
    throughputLhr: 1000000,
    stations: ["PS1 Mombasa", "PS3 Mtito Andei", "PS5 Sultan Hamud", "PS6 Nairobi", "PS7 Nakuru", "PS9 Kisumu"],
    lossMultiplier: 1.0,
  },
  taps: {
    id: "taps",
    name: "Trans-Alaska Pipeline (TAPS)",
    shortName: "TAPS Alaska",
    pipelineLength: "1,287 km",
    currency: "USD",
    currencySymbol: "$",
    throughputLhr: 2100000,
    stations: ["PS01 Valdez", "PS04 Fairbanks", "PS07 Yukon", "PS10 Prudhoe Bay"],
    lossMultiplier: 0.0077,
  },
  petrobras: {
    id: "petrobras",
    name: "Petrobras Santos Basin Offshore",
    shortName: "Petrobras Santos",
    pipelineLength: "850 km",
    currency: "BRL",
    currencySymbol: "R$ ",
    throughputLhr: 1500000,
    stations: ["FPSO Carioca", "P-70 Platform", "Angra Depot"],
    lossMultiplier: 0.045,
  },
  enbridge: {
    id: "enbridge",
    name: "Enbridge Mainline Network",
    shortName: "Enbridge Mainline",
    pipelineLength: "5,360 km",
    currency: "USD",
    currencySymbol: "$",
    throughputLhr: 3200000,
    stations: ["Edmonton Terminal", "Superior Station", "Sarnia Terminal"],
    lossMultiplier: 0.0077,
  },
};

const fluidProfiles: Record<FluidType, FluidProfile> = {
  ago: {
    id: "ago",
    name: "Automotive Gas Oil (AGO Diesel)",
    shortName: "AGO Diesel",
    densityKgM3: 840,
    viscosityCst: 3.5,
    pricePerLiterLocal: 182.5, // KES
  },
  pms: {
    id: "pms",
    name: "Premium Motor Spirit (PMS Petrol)",
    shortName: "PMS Petrol",
    densityKgM3: 740,
    viscosityCst: 0.6,
    pricePerLiterLocal: 195.0,
  },
  jeta1: {
    id: "jeta1",
    name: "Aviation Turbine Fuel (Jet A-1)",
    shortName: "Jet A-1",
    densityKgM3: 800,
    viscosityCst: 1.8,
    pricePerLiterLocal: 210.0,
  },
  crude: {
    id: "crude",
    name: "Light Sweet Crude Oil",
    shortName: "Crude Oil",
    densityKgM3: 870,
    viscosityCst: 12.0,
    pricePerLiterLocal: 145.0,
  },
};

const defaultTelemetryForFault: Record<FaultMode, TelemetryState> = {
  normal: {
    vibration: 1.15,
    temperature: 42.0,
    pressure: 50.0,
    motorCurrent: 280.0,
    flowgardResidual: -0.15,
    rulHours: 840.0,
    rulCiLow: 780.0,
    rulCiHigh: 900.0,
  },
  bearing: {
    vibration: 4.82,
    temperature: 86.4,
    pressure: 48.2,
    motorCurrent: 312.5,
    flowgardResidual: -1.8,
    rulHours: 142.5,
    rulCiLow: 124.3,
    rulCiHigh: 160.7,
  },
  cavitation: {
    vibration: 6.4,
    temperature: 65.0,
    pressure: 41.5,
    motorCurrent: 340.0,
    flowgardResidual: -3.5,
    rulHours: 86.0,
    rulCiLow: 68.0,
    rulCiHigh: 104.0,
  },
  leak: {
    vibration: 2.1,
    temperature: 48.0,
    pressure: 36.0,
    motorCurrent: 295.0,
    flowgardResidual: -6.2,
    rulHours: 45.0,
    rulCiLow: 32.0,
    rulCiHigh: 58.0,
  },
};

const ScadaContext = createContext<ScadaContextType | null>(null);

export function ScadaProvider({ children }: { children: React.ReactNode }) {
  const [activeFault, setActiveFaultState] = useState<FaultMode>("bearing");
  const [telemetry, setTelemetry] = useState<TelemetryState>(defaultTelemetryForFault.bearing);
  const [isTelemetryLive, setIsTelemetryLive] = useState<boolean>(true);

  const [selectedCompany, setSelectedCompany] = useState<PipelineCompany>("kpc");
  const [selectedFluid, setSelectedFluid] = useState<FluidType>("ago");

  const [selectedStationCode, setSelectedStationCode] = useState<string>("NK");
  const [selectedPumpId, setSelectedPumpId] = useState<string | null>("PUMP-NK-04");
  const [selectedComponent, setSelectedComponent] = useState<PumpComponentKey>("bearing");

  const [weatherOverlayVisible, setWeatherOverlayVisible] = useState<boolean>(false);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);

  const [customAlerts, setCustomAlerts] = useState<
    Array<{ id: string; title: string; time: string; severity: "critical" | "warning" | "info" }>
  >([
    {
      id: "al-1",
      title: "CRITICAL PRECURSOR: Vibration Spike 5.1 mm/s on PS7 Nakuru Pump 4",
      time: "2m ago",
      severity: "critical",
    },
    {
      id: "al-2",
      title: "HYDRAULIC DEVIATION: PS7 pressure residual exceeds -1.8 bar baseline threshold",
      time: "8m ago",
      severity: "warning",
    },
    {
      id: "al-3",
      title: "THERMAL DRIFT: Inboard bearing temperature +44.4°C over baseline (86.4°C)",
      time: "15m ago",
      severity: "warning",
    },
  ]);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const setFaultMode = (mode: FaultMode) => {
    setActiveFaultState(mode);
    setTelemetry(defaultTelemetryForFault[mode]);
  };

  // Live noise update loop when telemetry live is toggled ON
  useEffect(() => {
    if (!isTelemetryLive) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const noise = (Math.random() - 0.5) * 0.08;
        const tempNoise = (Math.random() - 0.5) * 0.2;
        const pressNoise = (Math.random() - 0.5) * 0.1;
        const currNoise = (Math.random() - 0.5) * 0.8;

        return {
          ...prev,
          vibration: Math.max(0.1, prev.vibration + noise),
          temperature: Math.max(20, prev.temperature + tempNoise),
          pressure: Math.max(10, prev.pressure + pressNoise),
          motorCurrent: Math.max(100, prev.motorCurrent + currNoise),
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isTelemetryLive]);

  // Audio Synthesizer Functions
  const playEmergencyTone = () => {
    if (audioMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      console.log("Web Audio API not allowed or supported.");
    }
  };

  const triggerEmergencyTrip = () => {
    playEmergencyTone();
    addCustomAlert(
      `🚨 EMERGENCY PUMP TRIP: PS7 Nakuru Pump 4 Isolated. Flow bypass initiated.`,
      "critical"
    );
  };

  const playAlarmBeep = () => {
    if (audioMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6 tone
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // ignore audio context restrictions
    }
  };

  const addCustomAlert = (title: string, severity: "critical" | "warning" | "info" = "warning") => {
    const newAlert = {
      id: `al-${Date.now()}`,
      title,
      time: "Just now",
      severity,
    };
    setCustomAlerts((prev) => [newAlert, ...prev]);
  };

  return (
    <ScadaContext.Provider
      value={{
        telemetry,
        activeFault,
        setFaultMode,
        isTelemetryLive,
        setIsTelemetryLive,
        selectedCompany,
        setSelectedCompany,
        companyInfo: companyProfiles[selectedCompany],
        selectedFluid,
        setSelectedFluid,
        fluidInfo: fluidProfiles[selectedFluid],
        selectedStationCode,
        setSelectedStationCode,
        selectedPumpId,
        setSelectedPumpId,
        selectedComponent,
        setSelectedComponent,
        weatherOverlayVisible,
        setWeatherOverlayVisible,
        audioMuted,
        setAudioMuted,
        triggerEmergencyTrip,
        playAlarmBeep,
        customAlerts,
        addCustomAlert,
      }}
    >
      {children}
    </ScadaContext.Provider>
  );
}

export function useScada() {
  const context = useContext(ScadaContext);
  if (!context) {
    throw new Error("useScada must be used within a ScadaProvider");
  }
  return context;
}
