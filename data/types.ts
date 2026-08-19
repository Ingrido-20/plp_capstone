export interface Station {
  code: string;
  name: string;
  lat: number;
  lon: number;
  km_from_mombasa: number;
  pump_count: number;
  max_risk: number;
  alert: boolean;
}

export interface ShapFeature {
  feature: string;
  value: number;
}

export interface ComponentStates {
  bearing: number;
  impeller: number;
  seal: number;
}

export interface Sensors {
  vibration_g: number;
  temperature_c: number;
  pressure_bar: number;
  motor_current_a: number;
}

export interface Pump {
  pump_id: string;
  station_code: string;
  risk_probability: number;
  health_deviation_index: number;
  sensors: Sensors;
  rul_hours: number | null;
  rul_ci_low: number | null;
  rul_ci_high: number | null;
  shap_top_features: ShapFeature[];
  component_states: ComponentStates;
  actual_will_fail: boolean;
  actual_failure_mode: string | null;
}

export interface ModelMetrics {
  classification_accuracy: number;
  classification_sensitivity: number;
  confusion_matrix: [[number, number], [number, number]];
  rul_mae_hours: number;
}

export interface Snapshot {
  generated_at: string;
  model_metrics: ModelMetrics;
  stations: Station[];
  pumps: Pump[];
}

export type RiskLevel = "critical" | "watch" | "healthy";
