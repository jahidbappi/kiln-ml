export type Metrics = {
  primary_metric: string;
  primary_value: number;
  accuracy?: number | null;
  f1?: number | null;
  rmse?: number | null;
  r2?: number | null;
  map50?: number | null;
  map50_95?: number | null;
  train_time_ms?: number;
  inference_ms?: number;
  extra?: Record<string, unknown>;
};

export type Row = {
  name: string;
  model: string;
  dataset: string;
  track: string;
  task: string;
  tool: string;
  metrics: Metrics;
};

export type TrackFile = {
  track: string;
  dataset: string;
  num_samples: number;
  seed: number;
  timestamp: string;
  commit?: string;
  citation?: string;
  results: Row[];
};

export type MasterFile = {
  timestamp: string;
  seed: number;
  commit?: string;
  tracks: TrackFile[];
};

export function formatMetric(row: Row): string {
  const m = row.metrics;
  if (m.primary_metric === "accuracy") return `${(m.primary_value * 100).toFixed(1)}%`;
  if (m.primary_metric === "rmse") return `RMSE ${m.rmse?.toFixed(3) ?? m.primary_value.toFixed(3)}`;
  if (m.primary_metric === "silhouette") return `silhouette ${m.primary_value.toFixed(3)}`;
  if (m.primary_metric === "map50") return `${(m.primary_value * 100).toFixed(1)}% mAP@50`;
  return m.primary_value.toFixed(3);
}

export const trackAccent: Record<string, string> = {
  tabular: "border-amber-500/30 from-amber-500/10",
  unsupervised: "border-orange-500/30 from-orange-500/10",
  vision: "border-rose-500/30 from-rose-500/10",
  detection: "border-yellow-500/30 from-yellow-500/10",
};
