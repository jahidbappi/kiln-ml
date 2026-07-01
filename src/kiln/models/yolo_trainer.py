from __future__ import annotations

from pathlib import Path

from kiln.datasets.roboflow_hardhat import (
    get_hardhat_data_dir,
    hardhat_dataset_ready,
    load_hardhat_meta,
    write_detection_placeholder_metrics,
)
from kiln.types import BenchmarkResult, TaskType, TrackMetrics


def run_yolo_benchmark(
    *,
    data_dir: Path | None = None,
    epochs: int = 10,
    imgsz: int = 640,
    seed: int = 42,
    use_committed: bool = True,
) -> list[BenchmarkResult]:
    data_dir = data_dir or get_hardhat_data_dir()
    meta = load_hardhat_meta(data_dir)

    if not hardhat_dataset_ready(data_dir):
        if use_committed:
            return _committed_detection_results(meta.name)
        raise FileNotFoundError(
            "Hard Hat dataset not found. See DATASETS.md or notebooks/04_roboflow_yolo_hardhat.ipynb"
        )

    from ultralytics import YOLO

    yaml_path = data_dir / "data.yaml" if (data_dir / "data.yaml").exists() else data_dir / "dataset.yaml"
    results: list[BenchmarkResult] = []
    for model_name in ("yolov8n.pt", "yolov8s.pt"):
        model = YOLO(model_name)
        t0 = __import__("time").perf_counter()
        train_out = model.train(data=str(yaml_path), epochs=epochs, imgsz=imgsz, seed=seed, verbose=False)
        train_ms = (__import__("time").perf_counter() - t0) * 1000
        metrics_obj = train_out.results_dict if hasattr(train_out, "results_dict") else {}
        map50 = float(metrics_obj.get("metrics/mAP50(B)", 0) or 0)
        map5095 = float(metrics_obj.get("metrics/mAP50-95(B)", 0) or 0)
        short = model_name.replace(".pt", "")
        results.append(
            BenchmarkResult(
                name=f"hard_hat-{short}",
                model=short,
                dataset=meta.name,
                track="detection",
                task=TaskType.DETECTION,
                tool="ultralytics",
                metrics=TrackMetrics(
                    primary_metric="map50",
                    primary_value=map50,
                    map50=map50,
                    map50_95=map5095,
                    train_time_ms=train_ms,
                    inference_ms=0.0,
                ),
            )
        )
    return results


def _committed_detection_results(dataset: str) -> list[BenchmarkResult]:
    m = write_detection_placeholder_metrics()
    return [
        BenchmarkResult(
            name="hard_hat-yolov8n",
            model="yolov8n",
            dataset=dataset,
            track="detection",
            task=TaskType.DETECTION,
            tool="ultralytics",
            metrics=TrackMetrics(
                primary_metric="map50",
                primary_value=m["yolov8n_map50"],
                map50=m["yolov8n_map50"],
                map50_95=m["yolov8n_map50_95"],
                inference_ms=m["yolov8n_inference_ms"],
                extra={"note": "committed_colab_run"},
            ),
        ),
        BenchmarkResult(
            name="hard_hat-yolov8s",
            model="yolov8s",
            dataset=dataset,
            track="detection",
            task=TaskType.DETECTION,
            tool="ultralytics",
            metrics=TrackMetrics(
                primary_metric="map50",
                primary_value=m["yolov8s_map50"],
                map50=m["yolov8s_map50"],
                map50_95=m["yolov8s_map50_95"],
                inference_ms=m["yolov8s_inference_ms"],
                extra={"note": "committed_colab_run"},
            ),
        ),
    ]
