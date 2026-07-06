import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { CheckCircle2, FlaskConical } from "lucide-react";
import Link from "next/link";

const tracks = [
  {
    name: "Tabular",
    metric: "accuracy / RMSE",
    command: "kiln-benchmark --track tabular --seed 42",
    datasets: "Titanic, Breast Cancer, Wine Quality",
  },
  {
    name: "Unsupervised",
    metric: "silhouette / accuracy",
    command: "kiln-benchmark --track unsupervised --seed 42",
    datasets: "Iris, Digits",
  },
  {
    name: "Vision",
    metric: "accuracy",
    command: "kiln-benchmark --track vision --epochs 5 --seed 42",
    datasets: "Fashion-MNIST",
  },
  {
    name: "Detection",
    metric: "mAP@50",
    command: "kiln-benchmark --track detection --seed 42",
    datasets: "Hard Hat Workers (Roboflow)",
  },
];

const detectionRun = [
  ["Models", "YOLOv8n vs YOLOv8s"],
  ["Epochs", "10"],
  ["Image size", "640"],
  ["Seed", "42"],
  ["Environment", "Google Colab T4 GPU"],
  ["Verified", "2026-07-01"],
  ["Notebook", "04_roboflow_yolo_hardhat.ipynb"],
];

export default function MethodologyPage() {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen px-6 pb-24 pt-28">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 text-orange-400">
            <FlaskConical className="h-6 w-6" />
            <p className="text-sm uppercase tracking-[0.2em]">Methodology</p>
          </div>
          <h1 className="mt-4 text-4xl font-semibold">How benchmarks are run</h1>
          <p className="mt-4 text-white/50">
            Every leaderboard number is reproducible with a documented command, fixed seed, and
            dataset citation. Detection metrics are verified Colab GPU runs — not synthetic placeholders.
          </p>

          <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="text-lg font-medium text-white">Core principles</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              {[
                "Fixed seed (42) for reproducible splits and training",
                "Real public datasets with citations in DATASETS.md",
                "Committed JSON leaderboards synced to the live site",
                "CI smoke tests on every push (pytest, ruff, tabular + Keras)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold">Per-track commands</h2>
            <div className="mt-6 space-y-4">
              {tracks.map((track) => (
                <div
                  key={track.name}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-medium text-orange-200">{track.name}</h3>
                    <span className="text-xs text-white/40">Primary: {track.metric}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/50">{track.datasets}</p>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-black/50 p-3 text-sm text-orange-200/90">
                    {track.command}
                  </pre>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6">
            <h2 className="text-lg font-medium text-yellow-100">Detection verification (YOLO)</h2>
            <p className="mt-2 text-sm text-white/50">
              Hard Hat Workers mAP values are from verified GPU training via Colab. Reproduce locally
              after exporting the Roboflow YOLOv8 dataset to{" "}
              <code className="text-orange-300/90">~/.cache/kiln/datasets/hardhat/</code>.
            </p>
            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              {detectionRun.map(([key, value]) => (
                <div key={key} className="rounded-lg border border-white/5 bg-black/20 px-4 py-3">
                  <dt className="text-white/35">{key}</dt>
                  <dd className="mt-1 text-white/75">{value}</dd>
                </div>
              ))}
            </dl>
            <a
              href="https://colab.research.google.com/github/jahidbappi/kiln-ml/blob/master/notebooks/04_roboflow_yolo_hardhat.ipynb"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-200 transition hover:bg-orange-500/20"
            >
              Open YOLO notebook in Colab
            </a>
          </section>

          <p className="mt-10 text-sm text-white/40">
            Full details in{" "}
            <a
              href="https://github.com/jahidbappi/kiln-ml/blob/master/METHODOLOGY.md"
              className="text-orange-400 hover:text-orange-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              METHODOLOGY.md
            </a>
            . View live results on{" "}
            <Link href="/benchmarks" className="text-orange-400 hover:text-orange-300">
              Benchmarks
            </Link>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
