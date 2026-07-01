from __future__ import annotations

from kiln.types import DatasetMeta


def load_fashion_mnist(*, max_train: int | None = None, max_test: int | None = None):
    import numpy as np
    from keras.datasets import fashion_mnist

    (x_train, y_train), (x_test, y_test) = fashion_mnist.load_data()
    if max_train is not None:
        x_train, y_train = x_train[:max_train], y_train[:max_train]
    if max_test is not None:
        x_test, y_test = x_test[:max_test], y_test[:max_test]

    x_train = x_train.astype(np.float32) / 255.0
    x_test = x_test.astype(np.float32) / 255.0

    meta = DatasetMeta(
        name="fashion_mnist",
        source="keras.datasets",
        citation=(
            "Xiao et al. (2017). Fashion-MNIST: a Novel Image Dataset "
            "for Benchmarking Machine Learning Algorithms."
        ),
        license="MIT",
        url="https://github.com/zalandoresearch/fashion-mnist",
        num_samples=len(x_train) + len(x_test),
    )
    return (x_train, y_train), (x_test, y_test), meta
