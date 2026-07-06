import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { BookOpen } from "lucide-react";

const matrix = [
  {
    layer: "Tabular",
    datasets: "Titanic · Breast Cancer · Wine Quality",
    algorithms: "Logistic Regression, SVM, kNN, Naive Bayes, Decision Tree, Random Forest, Gradient Boosting, Ridge, Lasso, SVR",
    tools: "scikit-learn · Kaggle CSV",
  },
  {
    layer: "Unsupervised",
    datasets: "Iris · Digits",
    algorithms: "k-Means, DBSCAN, Agglomerative, PCA + kNN/SVM",
    tools: "scikit-learn · OpenCV",
  },
  {
    layer: "Vision",
    datasets: "Fashion-MNIST",
    algorithms: "Flatten + Random Forest, MLP, CNN (3 conv blocks)",
    tools: "Keras · OpenCV augment",
  },
  {
    layer: "Detection",
    datasets: "Hard Hat Workers (Roboflow Universe)",
    algorithms: "YOLOv8n vs YOLOv8s",
    tools: "Ultralytics · OpenCV viz",
  },
];

const notebooks = [
  {
    name: "01_tabular_titanic.ipynb",
    url: "https://colab.research.google.com/github/jahidbappi/kiln-ml/blob/master/notebooks/01_tabular_titanic.ipynb",
  },
  {
    name: "02_unsupervised_digits.ipynb",
    url: "https://colab.research.google.com/github/jahidbappi/kiln-ml/blob/master/notebooks/02_unsupervised_digits.ipynb",
  },
  {
    name: "03_keras_fashion_mnist.ipynb",
    url: "https://colab.research.google.com/github/jahidbappi/kiln-ml/blob/master/notebooks/03_keras_fashion_mnist.ipynb",
  },
  {
    name: "04_roboflow_yolo_hardhat.ipynb",
    url: "https://colab.research.google.com/github/jahidbappi/kiln-ml/blob/master/notebooks/04_roboflow_yolo_hardhat.ipynb",
  },
];

export default function DocsPage() {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen px-6 pb-24 pt-28">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 text-orange-400">
            <BookOpen className="h-6 w-6" />
            <p className="text-sm uppercase tracking-[0.2em]">Documentation</p>
          </div>
          <h1 className="mt-4 text-4xl font-semibold">Algorithm & Dataset Matrix</h1>
          <p className="mt-4 text-white/50">
            Every core ML algorithm FAANG interviews expect — mapped to real datasets and tools.
          </p>

          <div className="mt-12 space-y-6">
            {matrix.map((row) => (
              <div
                key={row.layer}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
              >
                <h2 className="text-lg font-medium text-orange-200">{row.layer}</h2>
                <dl className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                  <div>
                    <dt className="text-white/35">Datasets</dt>
                    <dd className="mt-1 text-white/70">{row.datasets}</dd>
                  </div>
                  <div>
                    <dt className="text-white/35">Algorithms</dt>
                    <dd className="mt-1 text-white/70">{row.algorithms}</dd>
                  </div>
                  <div>
                    <dt className="text-white/35">Tools</dt>
                    <dd className="mt-1 text-white/70">{row.tools}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <section className="mt-16">
            <h2 className="text-xl font-semibold">Open in Colab</h2>
            <p className="mt-2 text-sm text-white/45">GPU path for Keras CNN and YOLO training.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {notebooks.map((nb) => (
                <a
                  key={nb.name}
                  href={nb.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-sm text-orange-200 transition hover:bg-orange-500/20"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.5 2.5h-6A2.5 2.5 0 006 5v14a2.5 2.5 0 002.5 2.5h11A2.5 2.5 0 0022 19V9.5L14.5 2.5zm0 1.7L20.3 9H15a.5.5 0 01-.5-.5V4.2z" />
                  </svg>
                  {nb.name.replace(".ipynb", "").replace(/_/g, " ")}
                </a>
              ))}
            </div>
          </section>

          <section className="mt-16 rounded-2xl border border-white/10 bg-black/30 p-6">
            <h2 className="font-medium">CLI reference</h2>
            <pre className="mt-4 overflow-x-auto text-sm text-orange-200/85">
{`kiln-benchmark --track all --seed 42
kiln-benchmark --track tabular
kiln-benchmark --track vision --epochs 5
kiln-benchmark --track detection   # Colab recommended`}
            </pre>
            <a
              href="/docs/methodology"
              className="mt-4 inline-block text-sm text-orange-400 hover:text-orange-300"
            >
              Read full methodology →
            </a>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
