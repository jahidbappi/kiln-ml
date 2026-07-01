"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Cpu,
  Eye,
  Flame,
  Layers,
  Sparkles,
  Table2,
} from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";

const stats = [
  { label: "Models benchmarked", value: "20+" },
  { label: "Dataset sources", value: "6" },
  { label: "Best CNN accuracy", value: "90.8%" },
  { label: "Tracks", value: "4" },
];

const tracks = [
  {
    icon: Table2,
    title: "Tabular",
    color: "from-amber-500/20 to-orange-600/5",
    border: "border-amber-500/20",
    desc: "Titanic, Breast Cancer, Wine — 7 classifiers + 4 regressors via scikit-learn & Kaggle CSVs.",
    tools: "sklearn · Kaggle",
  },
  {
    icon: Layers,
    title: "Unsupervised",
    color: "from-orange-500/20 to-red-600/5",
    border: "border-orange-500/20",
    desc: "Iris clustering, Digits PCA + SVM/kNN — dimensionality reduction with OpenCV viz.",
    tools: "sklearn · OpenCV",
  },
  {
    icon: Brain,
    title: "Vision",
    color: "from-rose-500/20 to-orange-600/5",
    border: "border-rose-500/20",
    desc: "Fashion-MNIST — flatten+RF baseline vs MLP vs CNN. Quantify the deep learning lift.",
    tools: "Keras · OpenCV",
  },
  {
    icon: Eye,
    title: "Detection",
    color: "from-yellow-500/20 to-amber-600/5",
    border: "border-yellow-500/20",
    desc: "Hard Hat Workers — YOLOv8n vs YOLOv8s mAP ablation from Roboflow Universe.",
    tools: "Ultralytics · Roboflow",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="relative min-h-screen overflow-hidden px-6 pb-24 pt-32">
          <div className="pointer-events-none absolute inset-0 grid-bg" />
          <div className="pointer-events-none absolute inset-0">
            <div className="ember-glow absolute -left-24 top-16 h-[28rem] w-[28rem] rounded-full bg-orange-600/25 blur-[100px]" />
            <div className="ember-glow absolute right-0 top-1/4 h-80 w-80 rounded-full bg-amber-500/15 blur-[90px] [animation-delay:2s]" />
            <div className="absolute bottom-0 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-6xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-200"
            >
              <Flame className="h-4 w-4" />
              ML / CV benchmark platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-5xl font-semibold tracking-tight md:text-7xl lg:text-8xl"
            >
              Forge.{" "}
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Measure.
              </span>{" "}
              Prove.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-white/55 md:text-xl"
            >
              Kiln runs every core ML algorithm on real public data — tabular to YOLO — with one
              reproducible harness and honest leaderboards.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <Link
                href="/benchmarks"
                className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-3.5 text-sm font-medium text-black shadow-lg shadow-orange-500/25 transition hover:brightness-110"
              >
                View Leaderboards
              </Link>
              <Link
                href="/docs"
                className="rounded-full border border-white/10 bg-white/[0.03] px-8 py-3.5 text-sm font-medium text-white/80 backdrop-blur transition hover:bg-white/[0.06]"
              >
                Algorithm Matrix
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4"
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-5 backdrop-blur"
                >
                  <p className="text-2xl font-semibold text-orange-300">{s.value}</p>
                  <p className="mt-1 text-xs text-white/40">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-semibold">Four tracks, one harness</h2>
              <p className="mt-3 text-white/45">Progressive complexity — perfect for FAANG ML interviews.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {tracks.map((track, i) => (
                <motion.div
                  key={track.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`group rounded-2xl border ${track.border} bg-gradient-to-br ${track.color} p-6 transition hover:border-orange-500/30`}
                >
                  <track.icon className="h-7 w-7 text-orange-400" />
                  <h3 className="mt-4 text-xl font-medium">{track.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">{track.desc}</p>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wider text-orange-400/70">
                    {track.tools}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] bg-[#050508] px-6 py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 text-orange-400">
                <Cpu className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">One CLI</span>
              </div>
              <h2 className="text-3xl font-semibold">Built like internal FAANG tooling</h2>
              <p className="mt-4 text-white/50">
                Typed Python API, pytest + ruff CI, committed benchmark JSON, Colab GPU notebooks —
                not a disconnected notebook zoo.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["sklearn", "Keras", "YOLO", "OpenCV", "Kaggle", "Roboflow"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/55"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/50 p-6 text-left text-sm leading-relaxed text-orange-200/90 shadow-2xl shadow-orange-950/30">
              {`pip install kiln-ml[dev,vision]

# Run all tracks (seed=42)
kiln-benchmark --track all \\
  --output benchmarks/results

# Tabular only (~2 min)
kiln-benchmark --track tabular`}
            </pre>
          </div>
        </section>

        <section className="border-t border-white/[0.06] px-6 py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center rounded-3xl border border-orange-500/20 bg-gradient-to-b from-orange-500/10 to-transparent px-8 py-12 text-center">
            <Sparkles className="h-8 w-8 text-amber-400" />
            <h2 className="mt-4 text-2xl font-semibold">Part of a three-project portfolio</h2>
            <p className="mt-3 max-w-lg text-white/50">
              Iris ships GenAI products. Mosaic measures RAG. Kiln forges classical + CV ML —
              together they tell a complete AI engineering story.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                ["Iris", "https://iris-puce.vercel.app"],
                ["Mosaic", "https://mosaic-rag.vercel.app"],
                ["Kiln", "/benchmarks"],
              ].map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/70 hover:border-orange-500/30 hover:text-orange-200"
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {name} →
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
