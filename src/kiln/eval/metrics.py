from __future__ import annotations

import subprocess
from datetime import UTC, datetime
from pathlib import Path

from kiln.types import BenchmarkResult, LeaderboardEntry, LeaderboardFile, MasterLeaderboard


def utc_timestamp() -> str:
    return datetime.now(tz=UTC).isoformat()


def git_commit_short() -> str | None:
    try:
        out = subprocess.check_output(["git", "rev-parse", "--short", "HEAD"], stderr=subprocess.DEVNULL, text=True)
        return out.strip()
    except Exception:
        return None


def results_to_leaderboard(
    results: list[BenchmarkResult],
    *,
    track: str,
    dataset: str,
    num_samples: int,
    seed: int,
    citation: str = "",
    license_: str = "",
    source_url: str = "",
) -> LeaderboardFile:
    entries = [
        LeaderboardEntry(
            name=r.name,
            model=r.model,
            dataset=r.dataset,
            track=r.track,
            task=str(r.task),
            tool=r.tool,
            metrics=r.metrics,
        )
        for r in results
    ]
    entries.sort(
        key=lambda e: e.metrics.primary_value,
        reverse=_higher_is_better(entries[0].metrics.primary_metric) if entries else True,
    )
    return LeaderboardFile(
        track=track,
        dataset=dataset,
        num_samples=num_samples,
        timestamp=utc_timestamp(),
        seed=seed,
        commit=git_commit_short(),
        citation=citation,
        license=license_,
        source_url=source_url,
        results=entries,
    )


def _higher_is_better(metric: str) -> bool:
    return metric not in {"rmse", "mae", "inference_ms", "train_time_ms"}


def write_leaderboard(lb: LeaderboardFile, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(lb.model_dump_json(indent=2), encoding="utf-8")


def merge_master(track_files: list[LeaderboardFile], path: Path, *, seed: int) -> MasterLeaderboard:
    master = MasterLeaderboard(
        timestamp=utc_timestamp(),
        seed=seed,
        commit=git_commit_short(),
        tracks=track_files,
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(master.model_dump_json(indent=2), encoding="utf-8")
    return master


def load_leaderboard(path: Path) -> LeaderboardFile:
    return LeaderboardFile.model_validate_json(path.read_text(encoding="utf-8"))
