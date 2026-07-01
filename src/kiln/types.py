from __future__ import annotations

from enum import StrEnum

from typing import Any

from pydantic import BaseModel, Field


class TaskType(StrEnum):
    CLASSIFICATION = "classification"
    REGRESSION = "regression"
    CLUSTERING = "clustering"
    IMAGE_CLASSIFICATION = "image_classification"
    DETECTION = "detection"


class TrackMetrics(BaseModel):
    primary_metric: str
    primary_value: float
    accuracy: float | None = None
    f1: float | None = None
    roc_auc: float | None = None
    rmse: float | None = None
    mae: float | None = None
    r2: float | None = None
    silhouette: float | None = None
    adjusted_rand: float | None = None
    explained_variance: float | None = None
    map50: float | None = None
    map50_95: float | None = None
    precision: float | None = None
    recall: float | None = None
    train_time_ms: float = 0.0
    inference_ms: float = 0.0
    extra: dict[str, Any] = Field(default_factory=dict)


class BenchmarkResult(BaseModel):
    name: str
    model: str
    dataset: str
    track: str
    task: TaskType
    tool: str
    metrics: TrackMetrics


class DatasetMeta(BaseModel):
    name: str
    source: str
    citation: str
    license: str
    url: str
    num_samples: int = 0


class LeaderboardEntry(BaseModel):
    name: str
    model: str
    dataset: str
    track: str
    task: str
    tool: str
    metrics: TrackMetrics


class LeaderboardFile(BaseModel):
    track: str
    dataset: str
    num_samples: int
    timestamp: str
    seed: int
    commit: str | None = None
    citation: str = ""
    license: str = ""
    source_url: str = ""
    results: list[LeaderboardEntry]


class MasterLeaderboard(BaseModel):
    timestamp: str
    seed: int
    commit: str | None = None
    tracks: list[LeaderboardFile]
