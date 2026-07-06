import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { TrackSection } from "@/components/TrackSection";
import masterData from "@/data/master_leaderboard.json";
import { formatMetric, trackAccent, type MasterFile } from "@/lib/benchmarks";
import { Cpu, ExternalLink, Trophy } from "lucide-react";
import Link from "next/link";

const data = masterData as MasterFile;

export default function BenchmarksPage() {
  const highlights = data.tracks.map((t) => ({
    track: t.track,
    winner: t.results[0],
  }));

  return (
    <>
      <SiteNav />
      <main className="min-h-screen px-6 pb-24 pt-28">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-orange-600/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.2em] text-orange-400/80">Evaluation</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Benchmark Leaderboards</h1>
          <p className="mt-4 max-w-2xl text-white/50">
            Reproducible ablations across tabular, unsupervised, vision, and detection tracks. Ranked
            by primary metric per task type.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/45">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
              seed {data.seed}
            </span>
            {data.commit && (
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
                commit <code className="text-orange-300">{data.commit}</code>
              </span>
            )}
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
              {new Date(data.timestamp).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(({ track, winner }) => (
              <div
                key={track}
                className={`rounded-2xl border bg-gradient-to-br to-transparent p-5 ${trackAccent[track] ?? "border-white/10"}`}
              >
                <div className="flex items-center gap-2 text-orange-300">
                  <Trophy className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">{track}</span>
                </div>
                <p className="mt-3 font-medium text-white">{winner?.model ?? "—"}</p>
                <p className="mt-1 text-sm text-white/45">{winner?.dataset}</p>
                <p className="mt-3 text-2xl font-semibold text-orange-300">
                  {winner ? formatMetric(winner) : "—"}
                </p>
              </div>
            ))}
          </div>

          {data.tracks.map((track) => (
            <TrackSection key={track.track} track={track} accent={trackAccent[track.track]} />
          ))}

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex items-center gap-2 text-orange-300">
                <Cpu className="h-5 w-5" />
                <h3 className="font-medium">Run locally</h3>
              </div>
              <pre className="mt-4 overflow-x-auto rounded-xl bg-black/40 p-4 text-sm text-orange-200/85">
                kiln-benchmark --track all --seed 42
              </pre>
              <p className="mt-3 text-xs text-white/40">
                Vision requires <code className="text-orange-300/80">pip install kiln-ml[vision]</code>.
                YOLO training: Colab notebook #4.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="font-medium text-white">Colab GPU notebooks</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  ["01_tabular_titanic.ipynb", "Tabular classifiers"],
                  ["02_unsupervised_digits.ipynb", "PCA + clustering"],
                  ["03_keras_fashion_mnist.ipynb", "MLP vs CNN"],
                  ["04_roboflow_yolo_hardhat.ipynb", "YOLO training"],
                ].map(([file, desc]) => (
                  <li key={file}>
                    <a
                      href={`https://github.com/jahidbappi/kiln-ml/blob/master/notebooks/${file}`}
                      className="inline-flex items-center gap-1 text-orange-400/90 hover:text-orange-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {desc}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
              <Link
                href="/docs/methodology"
                className="mt-4 inline-block text-sm text-white/50 hover:text-orange-300"
              >
                Methodology & reproducibility →
              </Link>
              <Link
                href="/docs"
                className="mt-2 block text-sm text-white/50 hover:text-orange-300"
              >
                Full algorithm matrix →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
