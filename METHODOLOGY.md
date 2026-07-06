# Kiln Methodology

How every leaderboard number is produced, verified, and reproduced.

## Principles

1. **Fixed seed** — All tracks default to `seed=42` for reproducible splits and training.
2. **Real public data** — Kaggle CSV, sklearn bundled sets, Roboflow Universe exports. See [DATASETS.md](./DATASETS.md).
3. **Committed JSON** — Results live in `benchmarks/results/` and sync to the web app.
4. **Honest fallbacks** — When a dataset is not local (e.g. Hard Hat YOLO), verified Colab GPU runs are committed with full run metadata.

## Tracks

| Track | Primary metric | Default command |
|-------|----------------|-----------------|
| Tabular | accuracy / RMSE | `kiln-benchmark --track tabular --seed 42` |
| Unsupervised | silhouette / accuracy | `kiln-benchmark --track unsupervised --seed 42` |
| Vision | accuracy | `kiln-benchmark --track vision --epochs 5 --seed 42` |
| Detection | mAP@50 | `kiln-benchmark --track detection --seed 42` |

## Detection (YOLO) verification

Hard Hat Workers detection metrics are from **verified Colab GPU runs**:

| Parameter | Value |
|-----------|-------|
| Models | YOLOv8n vs YOLOv8s |
| Epochs | 10 |
| Image size | 640 |
| Seed | 42 |
| Environment | Google Colab T4 GPU |
| Notebook | `notebooks/04_roboflow_yolo_hardhat.ipynb` |
| Dataset | [Roboflow Hard Hat Workers](https://universe.roboflow.com/roboflow-100/hard-hat-workers) |

To reproduce with local data:

```bash
# Extract Roboflow YOLOv8 export to ~/.cache/kiln/datasets/hardhat/
kiln-benchmark --track detection --seed 42
```

## Leaderboard metadata

Each `leaderboard.json` includes:

- `timestamp` — UTC run time
- `seed` — random seed
- `commit` — git short SHA at run time
- `citation` / `source_url` — dataset attribution

## CI

GitHub Actions runs `pytest`, `ruff`, tabular smoke, and Keras vision smoke on every push. See `.github/workflows/ci.yml`.
