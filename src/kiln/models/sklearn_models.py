from __future__ import annotations

import time
from typing import Any

import numpy as np
from sklearn.calibration import CalibratedClassifierCV
from sklearn.cluster import DBSCAN, AgglomerativeClustering, KMeans
from sklearn.decomposition import PCA
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import Lasso, LinearRegression, LogisticRegression, Ridge
from sklearn.metrics import (
    accuracy_score,
    adjusted_rand_score,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    roc_auc_score,
    silhouette_score,
)
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC, SVR
from sklearn.tree import DecisionTreeClassifier

from kiln.types import BenchmarkResult, TaskType, TrackMetrics


def _timed_fit_predict(
    model: Any, x_train: np.ndarray, y_train: np.ndarray, x_test: np.ndarray
) -> tuple[Any, float, float]:
    t0 = time.perf_counter()
    model.fit(x_train, y_train)
    train_ms = (time.perf_counter() - t0) * 1000
    t1 = time.perf_counter()
    preds = model.predict(x_test)
    infer_ms = (time.perf_counter() - t1) * 1000 / max(len(x_test), 1)
    return preds, train_ms, infer_ms


def classification_models() -> dict[str, Any]:
    return {
        "logistic_regression": LogisticRegression(max_iter=1000, random_state=42),
        "svm_rbf": CalibratedClassifierCV(SVC(kernel="rbf", random_state=42), cv=3),
        "knn": KNeighborsClassifier(n_neighbors=5),
        "naive_bayes": GaussianNB(),
        "decision_tree": DecisionTreeClassifier(max_depth=8, random_state=42),
        "random_forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "gradient_boosting": GradientBoostingClassifier(random_state=42),
    }


def regression_models() -> dict[str, Any]:
    return {
        "linear_regression": LinearRegression(),
        "ridge": Ridge(alpha=1.0),
        "lasso": Lasso(alpha=0.01, max_iter=5000),
        "svr": SVR(kernel="rbf"),
        "random_forest_regressor": RandomForestRegressor(n_estimators=100, random_state=42),
    }


def run_classifiers(
    x: np.ndarray,
    y: np.ndarray,
    *,
    dataset: str,
    track: str,
    seed: int = 42,
) -> list[BenchmarkResult]:
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=seed, stratify=y)
    scaler = StandardScaler()
    x_train_s = scaler.fit_transform(x_train)
    x_test_s = scaler.transform(x_test)
    results: list[BenchmarkResult] = []
    for name, model in classification_models().items():
        preds, train_ms, infer_ms = _timed_fit_predict(model, x_train_s, y_train, x_test_s)
        proba = None
        if hasattr(model, "predict_proba"):
            try:
                proba = model.predict_proba(x_test_s)
            except Exception:
                proba = None
        acc = float(accuracy_score(y_test, preds))
        f1 = float(f1_score(y_test, preds, average="weighted"))
        roc = None
        if proba is not None:
            n_classes = proba.shape[1]
            if n_classes == 2:
                roc = float(roc_auc_score(y_test, proba[:, 1]))
            elif n_classes > 2:
                roc = float(roc_auc_score(y_test, proba, multi_class="ovr", average="weighted"))
        metrics = TrackMetrics(
            primary_metric="accuracy",
            primary_value=acc,
            accuracy=acc,
            f1=f1,
            roc_auc=roc,
            train_time_ms=train_ms,
            inference_ms=infer_ms,
        )
        results.append(
            BenchmarkResult(
                name=f"{dataset}-{name}",
                model=name,
                dataset=dataset,
                track=track,
                task=TaskType.CLASSIFICATION,
                tool="scikit-learn",
                metrics=metrics,
            )
        )
    return results


def run_regressors(
    x: np.ndarray,
    y: np.ndarray,
    *,
    dataset: str,
    track: str,
    seed: int = 42,
) -> list[BenchmarkResult]:
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=seed)
    scaler = StandardScaler()
    x_train_s = scaler.fit_transform(x_train)
    x_test_s = scaler.transform(x_test)
    results: list[BenchmarkResult] = []
    for name, model in regression_models().items():
        preds, train_ms, infer_ms = _timed_fit_predict(model, x_train_s, y_train, x_test_s)
        rmse = float(np.sqrt(mean_squared_error(y_test, preds)))
        mae = float(mean_absolute_error(y_test, preds))
        r2 = float(r2_score(y_test, preds))
        metrics = TrackMetrics(
            primary_metric="rmse",
            primary_value=rmse,
            rmse=rmse,
            mae=mae,
            r2=r2,
            train_time_ms=train_ms,
            inference_ms=infer_ms,
        )
        results.append(
            BenchmarkResult(
                name=f"{dataset}-{name}",
                model=name,
                dataset=dataset,
                track=track,
                task=TaskType.REGRESSION,
                tool="scikit-learn",
                metrics=metrics,
            )
        )
    return results


def run_clustering(x: np.ndarray, y_true: np.ndarray, *, dataset: str, seed: int = 42) -> list[BenchmarkResult]:
    scaler = StandardScaler()
    x_s = scaler.fit_transform(x)
    results: list[BenchmarkResult] = []
    configs: dict[str, Any] = {
        "kmeans": KMeans(n_clusters=3, random_state=seed, n_init=10),
        "dbscan": DBSCAN(eps=1.2, min_samples=5),
        "agglomerative": AgglomerativeClustering(n_clusters=3),
    }
    for name, model in configs.items():
        t0 = time.perf_counter()
        labels = model.fit_predict(x_s)
        train_ms = (time.perf_counter() - t0) * 1000
        sil = float(silhouette_score(x_s, labels)) if len(set(labels)) > 1 else 0.0
        ari = float(adjusted_rand_score(y_true, labels))
        metrics = TrackMetrics(
            primary_metric="silhouette",
            primary_value=sil,
            silhouette=sil,
            adjusted_rand=ari,
            train_time_ms=train_ms,
            inference_ms=0.0,
        )
        results.append(
            BenchmarkResult(
                name=f"{dataset}-{name}",
                model=name,
                dataset=dataset,
                track="unsupervised",
                task=TaskType.CLUSTERING,
                tool="scikit-learn",
                metrics=metrics,
            )
        )
    return results


def run_pca_classifiers(
    x_train: np.ndarray,
    x_test: np.ndarray,
    y_train: np.ndarray,
    y_test: np.ndarray,
    *,
    dataset: str,
    n_components: int = 10,
) -> list[BenchmarkResult]:
    results: list[BenchmarkResult] = []
    configs = {
        "raw_knn": (None, KNeighborsClassifier(n_neighbors=5)),
        "raw_svm": (None, SVC(kernel="rbf", random_state=42)),
        "pca_knn": (PCA(n_components=n_components, random_state=42), KNeighborsClassifier(n_neighbors=5)),
        "pca_svm": (PCA(n_components=n_components, random_state=42), SVC(kernel="rbf", random_state=42)),
    }
    for name, (pca, clf) in configs.items():
        steps: list[tuple[str, Any]] = [("scaler", StandardScaler())]
        if pca is not None:
            steps.append(("pca", pca))
        steps.append(("clf", clf))
        pipe = Pipeline(steps)
        preds, train_ms, infer_ms = _timed_fit_predict(pipe, x_train, y_train, x_test)
        acc = float(accuracy_score(y_test, preds))
        ev = 0.0
        if pca is not None:
            pipe.fit(x_train, y_train)
            pca_fit = pipe.named_steps["pca"]
            ev = float(sum(pca_fit.explained_variance_ratio_))
        metrics = TrackMetrics(
            primary_metric="accuracy",
            primary_value=acc,
            accuracy=acc,
            explained_variance=ev if pca else None,
            train_time_ms=train_ms,
            inference_ms=infer_ms,
        )
        results.append(
            BenchmarkResult(
                name=f"{dataset}-{name}",
                model=name,
                dataset=dataset,
                track="unsupervised",
                task=TaskType.CLASSIFICATION,
                tool="scikit-learn",
                metrics=metrics,
            )
        )
    return results


def run_flatten_rf(
    x_train: np.ndarray,
    x_test: np.ndarray,
    y_train: np.ndarray,
    y_test: np.ndarray,
    *,
    dataset: str,
    max_train: int = 8000,
) -> BenchmarkResult:
    x_tr = x_train.reshape(len(x_train), -1)[:max_train]
    y_tr = y_train[:max_train]
    x_te = x_test.reshape(len(x_test), -1)
    clf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    preds, train_ms, infer_ms = _timed_fit_predict(clf, x_tr, y_tr, x_te)
    acc = float(accuracy_score(y_test, preds))
    return BenchmarkResult(
        name=f"{dataset}-flatten_rf",
        model="flatten_random_forest",
        dataset=dataset,
        track="vision",
        task=TaskType.IMAGE_CLASSIFICATION,
        tool="scikit-learn",
        metrics=TrackMetrics(
            primary_metric="accuracy",
            primary_value=acc,
            accuracy=acc,
            train_time_ms=train_ms,
            inference_ms=infer_ms,
        ),
    )
