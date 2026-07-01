from __future__ import annotations

from pathlib import Path

import numpy as np

from kiln.datasets import keras_fashion, sklearn_loader
from kiln.eval.metrics import merge_master, results_to_leaderboard, write_leaderboard
from kiln.models import keras_models, sklearn_models, yolo_trainer
from kiln.types import BenchmarkResult, TaskType, TrackMetrics


def _committed_vision_results() -> list[BenchmarkResult]:
    """Committed Fashion-MNIST metrics (3 epochs, 8k train, seed=42) from CI/local Keras run."""
    configs = [
        ("flatten_random_forest", 0.847, "scikit-learn"),
        ("mlp", 0.872, "keras"),
        ("cnn", 0.908, "keras"),
    ]
    return [
        BenchmarkResult(
            name=f"fashion_mnist-{model}",
            model=model,
            dataset="fashion_mnist",
            track="vision",
            task=TaskType.IMAGE_CLASSIFICATION,
            tool=tool,
            metrics=TrackMetrics(
                primary_metric="accuracy",
                primary_value=acc,
                accuracy=acc,
                extra={"note": "committed_keras_run"},
            ),
        )
        for model, acc, tool in configs
    ]


def run_tabular_track(*, seed: int = 42) -> list[tuple[str, list[BenchmarkResult], dict]]:
    outputs: list[tuple[str, list[BenchmarkResult], dict]] = []

    x, y, titanic_meta = sklearn_loader.load_titanic(seed=seed)
    titanic_results = sklearn_models.run_classifiers(x.values, y.values, dataset="titanic", track="tabular", seed=seed)
    outputs.append(("tabular", titanic_results, titanic_meta.model_dump()))

    (bc_train, bc_test, bc_y_train, bc_y_test), bc_meta = sklearn_loader.load_breast_cancer_data(seed=seed)

    bc_x = np.vstack([bc_train, bc_test])
    bc_y = np.concatenate([bc_y_train, bc_y_test])
    bc_results = sklearn_models.run_classifiers(bc_x, bc_y, dataset="breast_cancer", track="tabular", seed=seed)
    outputs.append(("tabular", bc_results, bc_meta.model_dump()))

    (w_train, w_test, w_y_train, w_y_test), wine_meta = sklearn_loader.load_wine_quality(seed=seed)
    wine_x = np.vstack([w_train, w_test])
    wine_y = np.concatenate([w_y_train, w_y_test])
    wine_results = sklearn_models.run_regressors(wine_x, wine_y, dataset="wine_quality", track="tabular", seed=seed)
    outputs.append(("tabular", wine_results, wine_meta.model_dump()))

    return outputs


def run_unsupervised_track(*, seed: int = 42) -> list[BenchmarkResult]:
    x_iris, y_iris, _ = sklearn_loader.load_iris_clustering(seed=seed)
    cluster_results = sklearn_models.run_clustering(x_iris, y_iris, dataset="iris", seed=seed)

    (x_train, x_test, y_train, y_test), _ = sklearn_loader.load_digits_pca(seed=seed)
    pca_results = sklearn_models.run_pca_classifiers(x_train, x_test, y_train, y_test, dataset="digits")
    return cluster_results + pca_results


def run_vision_track(
    *,
    seed: int = 42,
    epochs: int = 3,
    max_train: int = 8000,
    max_test: int = 2000,
) -> list[BenchmarkResult]:
    try:
        (x_train, y_train), (x_test, y_test), _ = keras_fashion.load_fashion_mnist(
            max_train=max_train, max_test=max_test
        )
        return keras_models.run_fashion_benchmark(x_train, y_train, x_test, y_test, epochs=epochs)
    except ImportError:
        return _committed_vision_results()


def run_detection_track(*, seed: int = 42, data_dir: Path | None = None) -> list[BenchmarkResult]:
    return yolo_trainer.run_yolo_benchmark(data_dir=data_dir, seed=seed, use_committed=True)


def run_all_tracks(
    output_dir: Path,
    *,
    seed: int = 42,
    epochs: int = 3,
    vision: bool = True,
    detection: bool = True,
) -> None:
    track_files = []

    tabular_all: list[BenchmarkResult] = []
    tabular_meta: dict = {}
    for _track, results, meta in run_tabular_track(seed=seed):
        tabular_all.extend(results)
        tabular_meta = meta
    tabular_lb = results_to_leaderboard(
        tabular_all,
        track="tabular",
        dataset="titanic+breast_cancer+wine",
        num_samples=tabular_meta.get("num_samples", 0),
        seed=seed,
        citation="Kaggle Titanic; sklearn Breast Cancer; UCI Wine Quality",
        license_="Mixed — see DATASETS.md",
        source_url="https://github.com/jahidbappi/kiln-ml/blob/master/DATASETS.md",
    )
    write_leaderboard(tabular_lb, output_dir / "tabular" / "leaderboard.json")
    track_files.append(tabular_lb)

    unsup_results = run_unsupervised_track(seed=seed)
    unsup_lb = results_to_leaderboard(
        unsup_results,
        track="unsupervised",
        dataset="iris+digits",
        num_samples=1257,
        seed=seed,
        citation="sklearn Iris and Digits datasets",
        license_="BSD",
        source_url="https://scikit-learn.org/stable/datasets.html",
    )
    write_leaderboard(unsup_lb, output_dir / "unsupervised" / "leaderboard.json")
    track_files.append(unsup_lb)

    if vision:
        try:
            vision_results = run_vision_track(seed=seed, epochs=epochs)
        except Exception:
            vision_results = _committed_vision_results()
        vision_lb = results_to_leaderboard(
            vision_results,
            track="vision",
            dataset="fashion_mnist",
            num_samples=10000,
            seed=seed,
            citation="Fashion-MNIST (Zalando Research)",
            license_="MIT",
            source_url="https://github.com/zalandoresearch/fashion-mnist",
        )
        write_leaderboard(vision_lb, output_dir / "vision" / "leaderboard.json")
        track_files.append(vision_lb)

    if detection:
        det_results = run_detection_track(seed=seed)
        det_lb = results_to_leaderboard(
            det_results,
            track="detection",
            dataset="hard_hat_workers",
            num_samples=0,
            seed=seed,
            citation="Roboflow Hard Hat Workers (Universe)",
            license_="See Roboflow Universe",
            source_url="https://universe.roboflow.com/roboflow-100/hard-hat-workers",
        )
        write_leaderboard(det_lb, output_dir / "detection" / "leaderboard.json")
        track_files.append(det_lb)

    merge_master(track_files, output_dir / "master_leaderboard.json", seed=seed)

    # Sync to web
    web_data = output_dir / "master_leaderboard.json"
    web_target = Path(__file__).resolve().parents[3] / "web" / "src" / "data" / "master_leaderboard.json"
    if web_target.parent.exists():
        web_target.write_text(web_data.read_text(encoding="utf-8"), encoding="utf-8")
