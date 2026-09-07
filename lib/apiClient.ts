/**
 * FlowGuard AI Backend API Client Integration
 * Connects Next.js Frontend to FastAPI Backend (Obunde/Flowguard_Backend)
 * Base URL: http://localhost:8000/api/v1
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface ApiClientConfig {
  baseUrl?: string;
  tenantId?: string;
  authToken?: string;
}

class FlowguardApiClient {
  private baseUrl: string;
  private tenantId: string;
  private authToken: string | null = null;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || API_BASE_URL;
    this.tenantId = config.tenantId || "00000000-0000-0000-0000-000000000001"; // Default KPC Tenant ID
    if (config.authToken) {
      this.authToken = config.authToken;
    }
  }

  public setAuthToken(token: string) {
    this.authToken = token;
  }

  public setTenantId(tenantId: string) {
    this.tenantId = tenantId;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Tenant-ID": this.tenantId,
    };
    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = { ...this.getHeaders(), ...options.headers };

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err: any) {
      console.warn(`[FlowguardApiClient] Failed request to ${url}:`, err.message);
      throw err;
    }
  }

  // --- 1. AUTHENTICATION & USER ROUTES ---
  public async login(username: string, password: string): Promise<{ access_token: string }> {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${this.baseUrl}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Invalid username or password");
    }

    const data = await response.json();
    this.authToken = data.access_token;
    return data;
  }

  public async getUsers() {
    return this.request<any[]>("/users");
  }

  // --- 2. STATIONS & PUMPS ---
  public async getStations() {
    return this.request<any[]>("/stations");
  }

  public async getStation(stationId: string) {
    return this.request<any>(`/stations/${stationId}`);
  }

  public async getPumps(stationId?: string, statusFilter?: string) {
    const query = new URLSearchParams();
    if (stationId) query.append("station_id", stationId);
    if (statusFilter) query.append("status_filter", statusFilter);
    return this.request<any[]>(`/pumps?${query.toString()}`);
  }

  public async getPump(pumpId: string) {
    return this.request<any>(`/pumps/${pumpId}`);
  }

  // --- 3. PREDICTIONS & RUL ENGINE ---
  public async getPredictions(pumpId?: string) {
    const query = pumpId ? `?pump_id=${pumpId}` : "";
    return this.request<any[]>(`/predictions${query}`);
  }

  public async getLatestPrediction(pumpId: string) {
    return this.request<any>(`/predictions/pumps/${pumpId}/latest`);
  }

  public async triggerPrediction(pumpId: string) {
    return this.request<any>(`/predictions/pumps/${pumpId}/trigger`, { method: "POST" });
  }

  public async getRulEstimates(pumpId?: string) {
    const query = pumpId ? `?pump_id=${pumpId}` : "";
    return this.request<any[]>(`/rul${query}`);
  }

  public async getLatestRulEstimate(pumpId: string) {
    return this.request<any>(`/rul/pumps/${pumpId}/latest`);
  }

  // --- 4. EXPLAINABILITY & SHAP ---
  public async getFeatureAttributions(pumpId?: string) {
    const query = pumpId ? `?pump_id=${pumpId}` : "";
    return this.request<any[]>(`/explainability${query}`);
  }

  public async getLatestFeatureAttribution(pumpId: string) {
    return this.request<any>(`/explainability/pumps/${pumpId}/latest`);
  }

  public async triggerFeatureAttribution(pumpId: string) {
    return this.request<any>(`/explainability/pumps/${pumpId}/trigger`, { method: "POST" });
  }

  // --- 5. ALERTS ---
  public async getAlerts(statusFilter?: string, pumpId?: string) {
    const query = new URLSearchParams();
    if (statusFilter) query.append("status_filter", statusFilter);
    if (pumpId) query.append("pump_id", pumpId);
    return this.request<any[]>(`/alerts?${query.toString()}`);
  }

  public async createAlert(alertData: any) {
    return this.request<any>("/alerts", {
      method: "POST",
      body: JSON.stringify(alertData),
    });
  }

  public async updateAlert(alertId: string, alertData: any) {
    return this.request<any>(`/alerts/${alertId}`, {
      method: "PATCH",
      body: JSON.stringify(alertData),
    });
  }

  // --- 6. WORK ORDERS ---
  public async getWorkOrders(statusFilter?: string, pumpId?: string) {
    const query = new URLSearchParams();
    if (statusFilter) query.append("status_filter", statusFilter);
    if (pumpId) query.append("pump_id", pumpId);
    return this.request<any[]>(`/work-orders?${query.toString()}`);
  }

  public async createWorkOrder(workOrderData: any) {
    return this.request<any>("/work-orders", {
      method: "POST",
      body: JSON.stringify(workOrderData),
    });
  }

  public async autoGenerateWorkOrder(pumpId: string) {
    return this.request<any>(`/work-orders/auto-generate/pumps/${pumpId}`, { method: "POST" });
  }

  public async updateWorkOrder(workOrderId: string, workOrderData: any) {
    return this.request<any>(`/work-orders/${workOrderId}`, {
      method: "PATCH",
      body: JSON.stringify(workOrderData),
    });
  }

  // --- 7. MAINTENANCE SCHEDULE ---
  public async getMaintenanceSchedule(statusFilter?: string, pumpId?: string) {
    const query = new URLSearchParams();
    if (statusFilter) query.append("status_filter", statusFilter);
    if (pumpId) query.append("pump_id", pumpId);
    return this.request<any[]>(`/maintenance-schedule?${query.toString()}`);
  }

  public async createScheduledMaintenance(data: any) {
    return this.request<any>("/maintenance-schedule", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // --- 8. MODEL METRICS & HEALTH ---
  public async getModelMetrics(modelName?: string, modelVersion?: string) {
    const query = new URLSearchParams();
    if (modelName) query.append("model_name", modelName);
    if (modelVersion) query.append("model_version", modelVersion);
    return this.request<any[]>(`/model-metrics?${query.toString()}`);
  }

  public async checkHealth(): Promise<{ status: string; environment: string }> {
    const res = await fetch(`${this.baseUrl.replace('/api/v1', '')}/health`);
    return await res.json();
  }
}

export const apiClient = new FlowguardApiClient();
