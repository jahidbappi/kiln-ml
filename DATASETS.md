# Kiln Datasets

All datasets used in Kiln benchmarks. Hero path uses **bundled CSVs** or **sklearn/keras built-ins** — no API keys required.

## Tabular

### Titanic (Kaggle)

- **File:** `data/titanic.csv` (bundled)
- **Source:** [Kaggle Titanic competition](https://www.kaggle.com/c/titanic)
- **License:** Competition terms / public redistribution via community mirrors
- **Features:** Pclass, Sex, Age, SibSp, Parch, Fare → Survived

### Breast Cancer Wisconsin (sklearn)

- **Loader:** `sklearn.datasets.load_breast_cancer`
- **License:** BSD / UCI
- **Citation:** Wolberg, Street, Mangasarian (1995)

### Wine Quality Red (UCI)

- **File:** `data/winequality-red.csv` (bundled)
- **Source:** [UCI Wine Quality](https://archive.ics.uci.edu/dataset/186/wine+quality)
- **License:** CC BY 4.0
- **Citation:** Cortez et al. (2009)

## Unsupervised

### Iris / Digits (sklearn)

- Built-in sklearn datasets for clustering and PCA experiments.

## Vision

### Fashion-MNIST (Keras)

- **Loader:** `keras.datasets.fashion_mnist`
- **License:** MIT
- **Citation:** Xiao et al. (2017)

## Detection

### Hard Hat Workers (Roboflow Universe)

- **Source:** [Roboflow Universe — Hard Hat Workers](https://universe.roboflow.com/roboflow-100/hard-hat-workers)
- **Format:** YOLOv8 export
- **Download:** See `notebooks/04_roboflow_yolo_hardhat.ipynb` or extract to `~/.cache/kiln/datasets/hardhat/`
- **CI:** Committed mAP metrics from documented Colab run when dataset not present locally

## Reproducibility

All benchmarks use `--seed 42` by default. Leaderboard JSON includes timestamp, seed, and git commit SHA.
