# Changelog

All notable changes to Kiln are documented here.

## [0.1.1] — 2026-07-06

### Added

- Methodology page at [kiln-ml.vercel.app/docs/methodology](https://kiln-ml.vercel.app/docs/methodology)
- Verified YOLO run metadata on detection leaderboards (environment, epochs, reproduce steps)
- Open Graph social preview image for site and repo
- `METHODOLOGY.md`, `CONTRIBUTING.md`, demo preview asset
- Leaderboard UI: per-track timestamps and run commands

### Changed

- Refreshed tabular and unsupervised benchmark JSON (seed=42)
- Detection metrics documented as verified Colab GPU runs (not anonymous placeholders)
- README badges (CI, Python, license, release)

## [0.1.0] — 2026-07-01

### Added

- Unified `kiln-benchmark` CLI across 4 tracks
- Live Next.js site with leaderboards and algorithm matrix
- Colab notebooks for GPU YOLO and Keras CNN training
- GitHub Actions CI (pytest, ruff, smoke tests)
- Initial release with committed leaderboards
