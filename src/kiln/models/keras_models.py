from __future__ import annotations

import time
from typing import Any

import numpy as np
from sklearn.metrics import accuracy_score

from kiln.models.sklearn_models import run_flatten_rf
from kiln.types import BenchmarkResult, TaskType, TrackMetrics


def build_mlp(input_shape: tuple[int, ...], num_classes: int = 10) -> Any:
    from keras import layers, models

    model = models.Sequential(
        [
            layers.Input(shape=input_shape),
            layers.Flatten(),
            layers.Dense(256, activation="relu"),
            layers.Dropout(0.2),
            layers.Dense(128, activation="relu"),
            layers.Dense(num_classes, activation="softmax"),
        ]
    )
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    return model


def build_cnn(input_shape: tuple[int, int, int] = (28, 28, 1), num_classes: int = 10) -> Any:
    from keras import layers, models

    model = models.Sequential(
        [
            layers.Input(shape=input_shape),
            layers.Conv2D(32, 3, activation="relu", padding="same"),
            layers.MaxPooling2D(),
            layers.Conv2D(64, 3, activation="relu", padding="same"),
            layers.MaxPooling2D(),
            layers.Conv2D(64, 3, activation="relu", padding="same"),
            layers.Flatten(),
            layers.Dense(64, activation="relu"),
            layers.Dense(num_classes, activation="softmax"),
        ]
    )
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    return model


def _run_keras_model(
    model: Any,
    x_train: np.ndarray,
    y_train: np.ndarray,
    x_test: np.ndarray,
    y_test: np.ndarray,
    *,
    model_name: str,
    dataset: str,
    epochs: int,
    batch_size: int = 128,
) -> BenchmarkResult:
    if x_train.ndim == 3:
        x_train = x_train[..., np.newaxis]
        x_test = x_test[..., np.newaxis]

    t0 = time.perf_counter()
    model.fit(x_train, y_train, epochs=epochs, batch_size=batch_size, verbose=0, validation_split=0.1)
    train_ms = (time.perf_counter() - t0) * 1000

    t1 = time.perf_counter()
    probs = model.predict(x_test, verbose=0)
    infer_ms = (time.perf_counter() - t1) * 1000 / max(len(x_test), 1)
    preds = np.argmax(probs, axis=1)
    acc = float(accuracy_score(y_test, preds))
    top3 = float(np.mean([y_test[i] in np.argsort(probs[i])[-3:] for i in range(len(y_test))]))

    params = int(model.count_params())
    return BenchmarkResult(
        name=f"{dataset}-{model_name}",
        model=model_name,
        dataset=dataset,
        track="vision",
        task=TaskType.IMAGE_CLASSIFICATION,
        tool="keras",
        metrics=TrackMetrics(
            primary_metric="accuracy",
            primary_value=acc,
            accuracy=acc,
            train_time_ms=train_ms,
            inference_ms=infer_ms,
            extra={"top3_accuracy": top3, "params": float(params)},
        ),
    )


def run_fashion_benchmark(
    x_train: np.ndarray,
    y_train: np.ndarray,
    x_test: np.ndarray,
    y_test: np.ndarray,
    *,
    epochs: int = 5,
    include_rf: bool = True,
) -> list[BenchmarkResult]:
    results: list[BenchmarkResult] = []
    if include_rf:
        results.append(run_flatten_rf(x_train, x_test, y_train, y_test, dataset="fashion_mnist"))
    mlp = build_mlp((28, 28), num_classes=10)
    results.append(
        _run_keras_model(
            mlp, x_train, y_train, x_test, y_test, model_name="mlp", dataset="fashion_mnist", epochs=epochs
        )
    )
    cnn = build_cnn()
    results.append(
        _run_keras_model(
            cnn, x_train, y_train, x_test, y_test, model_name="cnn", dataset="fashion_mnist", epochs=epochs
        )
    )
    return results
