import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import masterData from "@/data/master_leaderboard.json";

type Metrics = {
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
};

type Row = {
  name: string;
  model: string;
  dataset: string;
  track: string;
  task: string;
  tool: string;
  metrics: Metrics;
};

type TrackFile = {
  track: string;
  dataset: string;
  num_samples: number;
  seed: number;
  timestamp: string;
  commit?: string;
  citation?: string;
  results: Row[];
};

type MasterFile = {
  timestamp: string;
  seed: number;
  commit?: string;
  tracks: TrackFile[];
};

const data = masterData as MasterFile;

function fmtMetric(row: Row): string {
  const m = row.metrics;
  if (m.primary_metric === "accuracy") return `${(m.primary_value * 100).toFixed(1)}%`;
  if (m.primary_metric === "rmse") return m.rmse?.toFixed(3) ?? m.primary_value.toFixed(3);
  if (m.primary_metric === "silhouette") return m.primary_value.toFixed(3);
  if (m.primary_metric === "map50") return `${(m.primary_value * 100).toFixed(1)}% mAP@50`;
  return m.primary_value.toFixed(3);
}

export default function BenchmarksPage() {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen px-6 pb-20 pt-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm uppercase tracking-[0.2em] text-orange-400/80">Evaluation</p>
          <h1 className="mt-4 text-4xl font-semibold">Benchmark Leaderboards</h1>
          <p className="mt-4 text-white/50">
            Reproducible results across 4 tracks · seed {data.seed}
            {data.commit && (
              <>
                {" "}
                · commit <code className="text-orange-300">{data.commit}</code>
              </>
            )}
          </p>

          {data.tracks.map((track) => (
            <section key={track.track} className="mt-12">
              <h2 className="text-xl font-medium capitalize text-orange-200">{track.track}</h2>
              <p className="mt-1 text-sm text-white/45">
                {track.dataset} · {track.num_samples > 0 ? `${track.num_samples} samples` : "see DATASETS.md"}
              </p>
              <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-white/10 bg-white/[0.03] text-white/50">
                    <tr>
                      <th className="px-4 py-3">Model</th>
                      <th className="px-4 py-3">Dataset</th>
                      <th className="px-4 py-3">Tool</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Train ms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {track.results.slice(0, 12).map((row, i) => (
                      <tr key={row.name} className={i % 2 ? "bg-white/[0.02]" : ""}>
                        <td className="px-4 py-3 font-medium">{row.model}</td>
                        <td className="px-4 py-3 text-white/60">{row.dataset}</td>
                        <td className="px-4 py-3 text-white/60">{row.tool}</td>
                        <td className="px-4 py-3 text-orange-300">{fmtMetric(row)}</td>
                        <td className="px-4 py-3 text-white/40">{row.metrics.train_time_ms?.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}

          <div className="mt-12 rounded-xl border border-white/10 bg-white/[0.02] p-5 text-sm text-white/50">
            <p>
              Run locally:{" "}
              <code className="text-orange-300">kiln-benchmark --track all --seed 42</code>
            </p>
            <p className="mt-2">
              Colab GPU notebooks in{" "}
              <a
                href="https://github.com/jahidbappi/kiln-ml/tree/master/notebooks"
                className="text-orange-400 hover:underline"
              >
                notebooks/
              </a>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
