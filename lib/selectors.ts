import { pumps } from "@/data/mockData";
import { CRIT, WARN } from "@/lib/utils";

export const atRiskPumps = pumps
  .filter((p) => p.risk_probability > WARN)
  .sort((a, b) => b.risk_probability - a.risk_probability);

export const criticalPumps = pumps.filter((p) => p.risk_probability > CRIT);

export const watchPumps = atRiskPumps.filter((p) => p.risk_probability <= CRIT);

export const healthyPumps = pumps.filter((p) => p.risk_probability <= WARN);
