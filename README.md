# Kiln — Forge Every Algorithm on Real Data

**Kiln** is a unified ML/CV benchmark platform that compares 20+ classical and deep models across Kaggle, sklearn, Keras, Roboflow, and Ultralytics datasets — with reproducible leaderboards and Colab GPU workflows.

**Live benchmarks:** [kiln-ml.vercel.app/benchmarks](https://kiln-ml.vercel.app/benchmarks)

## Portfolio context

| Project | Role |
|---------|------|
| [Iris](https://github.com/jahidbappi/iris) | GenAI multimodal product |
| [Mosaic](https://github.com/jahidbappi/mosaic-rag) | RAG evaluation |
| **Kiln** | Classical + CV ML evaluation |

## Quick start

```bash
cd kiln
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev,vision]"
kiln-benchmark --track all --seed 42 --output benchmarks/results
```

## Tracks

| Track | Datasets | Tools | Models |
|-------|----------|-------|--------|
| **Tabular** | Titanic, Breast Cancer, Wine | sklearn, Kaggle CSV | LR, SVM, kNN, NB, DT, RF, GBM + regressors |
| **Unsupervised** | Iris, Digits | sklearn, OpenCV | k-Means, DBSCAN, Agglomerative, PCA+SVM/kNN |
| **Vision** | Fashion-MNIST | Keras, OpenCV | Flatten+RF, MLP, CNN |
| **Detection** | Hard Hat Workers | Roboflow, Ultralytics, OpenCV | YOLOv8n vs YOLOv8s |

## CLI

```bash
kiln-benchmark --track tabular --seed 42
kiln-benchmark --track vision --epochs 5
kiln-benchmark --track detection   # uses committed Colab metrics if dataset not local
kiln-benchmark --track all --no-vision   # skip Keras (no tensorflow)
```

## Colab notebooks

Open `notebooks/` in Google Colab for GPU YOLO training and full CNN runs.

## Development

```bash
pip install -e ".[dev,vision]"
ruff check src tests
pytest
```

## License

MIT — see [DATASETS.md](./DATASETS.md) for dataset citations.
