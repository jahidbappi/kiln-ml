from __future__ import annotations

from pathlib import Path

import pandas as pd
from sklearn.datasets import load_breast_cancer, load_digits, load_iris
from sklearn.model_selection import train_test_split

from kiln.types import DatasetMeta

DATA_DIR = Path(__file__).resolve().parents[3] / "data"


def _meta(name: str, source: str, citation: str, license_: str, url: str, n: int) -> DatasetMeta:
    return DatasetMeta(name=name, source=source, citation=citation, license=license_, url=url, num_samples=n)


def load_titanic(*, seed: int = 42, test_size: float = 0.2) -> tuple[pd.DataFrame, pd.Series, DatasetMeta]:
    path = DATA_DIR / "titanic.csv"
    df = pd.read_csv(path)
    df = df.dropna(subset=["Survived", "Pclass", "Sex", "Age", "SibSp", "Parch", "Fare"])
    df["Sex"] = (df["Sex"] == "male").astype(int)
    df["Age"] = df["Age"].fillna(df["Age"].median())
    features = df[["Pclass", "Sex", "Age", "SibSp", "Parch", "Fare"]]
    target = df["Survived"].astype(int)
    meta = _meta(
        "titanic",
        "Kaggle (bundled CSV)",
        "Titanic: Machine Learning from Disaster. Kaggle competition dataset.",
        "CC0 / Public domain (competition data)",
        "https://www.kaggle.com/c/titanic",
        len(df),
    )
    return features, target, meta


def load_breast_cancer_data(*, seed: int = 42, test_size: float = 0.2):
    data = load_breast_cancer()
    x_train, x_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=test_size, random_state=seed, stratify=data.target
    )
    meta = _meta(
        "breast_cancer",
        "sklearn.datasets",
        "Wolberg, W.N., Street, W.N., Mangasarian, O.L. (1995). Breast Cancer Wisconsin.",
        "BSD / UCI",
        "https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_breast_cancer.html",
        len(data.data),
    )
    return (x_train, x_test, y_train, y_test), meta


def load_wine_quality(*, seed: int = 42, test_size: float = 0.2):
    path = DATA_DIR / "winequality-red.csv"
    df = pd.read_csv(path, sep=";")
    target = df["quality"]
    features = df.drop(columns=["quality"])
    x_train, x_test, y_train, y_test = train_test_split(
        features.values, target.values, test_size=test_size, random_state=seed
    )
    meta = _meta(
        "wine_quality",
        "UCI / Kaggle (bundled CSV)",
        "Cortez et al. (2009). Modeling wine preferences by data mining.",
        "CC BY 4.0",
        "https://archive.ics.uci.edu/dataset/186/wine+quality",
        len(df),
    )
    return (x_train, x_test, y_train, y_test), meta


def load_iris_clustering(*, seed: int = 42):
    data = load_iris()
    meta = _meta(
        "iris",
        "sklearn.datasets",
        "Fisher (1936). The use of multiple measurements in taxonomic problems.",
        "BSD",
        "https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_iris.html",
        len(data.data),
    )
    return data.data, data.target, meta


def load_digits_pca(*, seed: int = 42, test_size: float = 0.2):
    data = load_digits()
    x_train, x_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=test_size, random_state=seed, stratify=data.target
    )
    meta = _meta(
        "digits",
        "sklearn.datasets",
        "UCI ML hand-written digits (8x8).",
        "BSD",
        "https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_digits.html",
        len(data.data),
    )
    return (x_train, x_test, y_train, y_test), meta
