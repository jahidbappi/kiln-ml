import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen px-6 pb-20 pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-orange-400/80">ML / CV Benchmarks</p>
          <h1 className="mt-4 text-5xl font-semibold">Kiln</h1>
          <p className="mt-6 text-lg text-white/60">Forge every algorithm on real data.</p>
          <p className="mx-auto mt-4 max-w-2xl text-white/45">
            Unified evaluation across tabular ML, unsupervised learning, Fashion-MNIST CNNs, and YOLO
            detection — sklearn, Kaggle, Keras, Roboflow, Ultralytics, and OpenCV.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/benchmarks"
              className="rounded-full bg-orange-500 px-6 py-3 text-sm font-medium text-black hover:bg-orange-400"
            >
              View Leaderboards
            </Link>
            <a
              href="https://github.com/jahidbappi/kiln-ml"
              className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 hover:border-white/40"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
          <div className="mt-16 grid gap-4 text-left sm:grid-cols-2">
            {[
              ["Tabular", "Titanic, Breast Cancer, Wine — 7 classifiers + 4 regressors"],
              ["Unsupervised", "Iris clustering, Digits PCA + SVM/kNN"],
              ["Vision", "Fashion-MNIST — RF vs MLP vs CNN"],
              ["Detection", "Hard Hat Workers — YOLOv8n vs YOLOv8s"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="font-medium text-orange-300">{title}</h3>
                <p className="mt-2 text-sm text-white/50">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
