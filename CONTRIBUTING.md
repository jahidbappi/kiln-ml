# Contributing to Kiln

Thanks for helping improve Kiln. This project prioritizes **reproducible benchmarks on real public data**.

## Development setup

```bash
git clone https://github.com/jahidbappi/kiln-ml.git
cd kiln-ml
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev,vision]"
ruff check src tests
pytest
```

## Adding a new algorithm

1. Implement in the appropriate module under `src/kiln/models/`
2. Register in the track harness (`src/kiln/eval/harness.py`)
3. Run `kiln-benchmark --track <track> --seed 42 --output benchmarks/results`
4. Update `FINDINGS.md` with an honest narrative of results
5. Open a PR with the updated `leaderboard.json`

## Adding a new track

1. Add dataset loader under `src/kiln/datasets/`
2. Add runner in `src/kiln/eval/harness.py` and CLI in `src/kiln/cli.py`
3. Document in `DATASETS.md` and `METHODOLOGY.md`
4. Add a Colab notebook if GPU is recommended

## Benchmark PR checklist

- [ ] `seed=42` (or document why not)
- [ ] Dataset citation and license noted
- [ ] `benchmarks/results/<track>/leaderboard.json` updated
- [ ] `web/src/data/master_leaderboard.json` synced (auto on `--track all`)
- [ ] FINDINGS.md updated if results are interesting

## Code style

- Python 3.11+
- `ruff` for lint/format
- Type hints encouraged
