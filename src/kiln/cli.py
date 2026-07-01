from __future__ import annotations

import argparse
from pathlib import Path

from kiln.eval.harness import (
    run_all_tracks,
    run_detection_track,
    run_tabular_track,
    run_unsupervised_track,
    run_vision_track,
)


def main() -> None:
    parser = argparse.ArgumentParser(description="Kiln — forge every algorithm on real data")
    parser.add_argument(
        "--track",
        choices=["all", "tabular", "unsupervised", "vision", "detection"],
        default="all",
        help="Benchmark track to run",
    )
    parser.add_argument("--output", type=Path, default=Path("benchmarks/results"))
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--epochs", type=int, default=3, help="Keras epochs (vision track)")
    parser.add_argument("--no-vision", action="store_true", help="Skip Keras vision track")
    parser.add_argument("--no-detection", action="store_true", help="Skip YOLO detection track")
    args = parser.parse_args()

    if args.track == "all":
        run_all_tracks(
            args.output,
            seed=args.seed,
            epochs=args.epochs,
            vision=not args.no_vision,
            detection=not args.no_detection,
        )
        print(f"All tracks complete → {args.output}")
        return

    output = args.output
    if args.track == "tabular":
        for _t, results, meta in run_tabular_track(seed=args.seed):
            from kiln.eval.metrics import results_to_leaderboard, write_leaderboard

            lb = results_to_leaderboard(
                results,
                track="tabular",
                dataset=meta["name"],
                num_samples=meta["num_samples"],
                seed=args.seed,
            )
            write_leaderboard(lb, output / "tabular" / f"{meta['name']}_leaderboard.json")
        print(f"Tabular complete → {output / 'tabular'}")
    elif args.track == "unsupervised":
        results = run_unsupervised_track(seed=args.seed)
        from kiln.eval.metrics import results_to_leaderboard, write_leaderboard

        lb = results_to_leaderboard(
            results,
            track="unsupervised",
            dataset="iris+digits",
            num_samples=1257,
            seed=args.seed,
        )
        write_leaderboard(lb, output / "unsupervised" / "leaderboard.json")
        print(f"Unsupervised complete → {output / 'unsupervised'}")
    elif args.track == "vision":
        results = run_vision_track(seed=args.seed, epochs=args.epochs)
        from kiln.eval.metrics import results_to_leaderboard, write_leaderboard

        lb = results_to_leaderboard(results, track="vision", dataset="fashion_mnist", num_samples=10000, seed=args.seed)
        write_leaderboard(lb, output / "vision" / "leaderboard.json")
        print(f"Vision complete → {output / 'vision'}")
    elif args.track == "detection":
        results = run_detection_track(seed=args.seed)
        from kiln.eval.metrics import results_to_leaderboard, write_leaderboard

        lb = results_to_leaderboard(
            results, track="detection", dataset="hard_hat_workers", num_samples=0, seed=args.seed
        )
        write_leaderboard(lb, output / "detection" / "leaderboard.json")
        print(f"Detection complete → {output / 'detection'}")


if __name__ == "__main__":
    main()
