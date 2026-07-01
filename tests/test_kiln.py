from __future__ import annotations

import json
from pathlib import Path

import numpy as np

from kiln.datasets import sklearn_loader
from kiln.eval.harness import run_tabular_track, run_unsupervised_track
from kiln.eval.metrics import results_to_leaderboard, write_leaderboard
from kiln.models import sklearn_models
from kiln.vision.opencv_utils import augment_image, draw_detection_box, pca_heatmap


def test_titanic_loads() -> None:
    x, y, meta = sklearn_loader.load_titanic()
    assert len(x) == len(y)
    assert meta.name == "titanic"


def test_classification_models_run() -> None:
    x, y, _ = sklearn_loader.load_titanic()
    results = sklearn_models.run_classifiers(x.values[:200], y.values[:200], dataset="titanic", track="tabular")
    assert len(results) == 7
    assert all(0 <= r.metrics.accuracy <= 1 for r in results if r.metrics.accuracy is not None)


def test_tabular_track_smoke() -> None:
    outputs = run_tabular_track(seed=42)
    assert len(outputs) >= 3


def test_unsupervised_track_smoke() -> None:
    results = run_unsupervised_track(seed=42)
    assert len(results) >= 7


def test_leaderboard_roundtrip(tmp_path: Path) -> None:
    x, y, meta = sklearn_loader.load_titanic()
    results = sklearn_models.run_classifiers(x.values[:100], y.values[:100], dataset="titanic", track="tabular")
    lb = results_to_leaderboard(results, track="tabular", dataset=meta.name, num_samples=100, seed=42)
    path = tmp_path / "lb.json"
    write_leaderboard(lb, path)
    data = json.loads(path.read_text())
    assert data["track"] == "tabular"
    assert len(data["results"]) == 7


def test_opencv_utils() -> None:
    img = np.zeros((28, 28), dtype=np.uint8)
    aug = augment_image(img, flip=False, rotate_deg=0)
    assert aug.shape == (28, 28)
    heat = pca_heatmap(np.arange(64, dtype=float))
    assert heat.shape == (8, 8)
    boxed = draw_detection_box(np.zeros((100, 100, 3), dtype=np.uint8), (10, 10, 50, 50), "test")
    assert boxed.shape == (100, 100, 3)


def test_detection_committed_metrics() -> None:
    from kiln.models.yolo_trainer import run_yolo_benchmark

    results = run_yolo_benchmark(use_committed=True)
    assert len(results) == 2
    assert results[0].metrics.map50 is not None
