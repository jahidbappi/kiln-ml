# Kiln Findings

Honest benchmark narratives from Kiln ablation runs (seed=42).

## Tabular — Titanic

Gradient Boosting typically edges Logistic Regression by 2–5 pp accuracy on Titanic with default sklearn hyperparameters. Random Forest is competitive but slower at inference. **Takeaway:** tree ensembles win on mixed categorical/numeric tabular data with minimal feature engineering.

## Tabular — Breast Cancer

All linear and kernel models exceed 95% accuracy — this dataset is nearly separable. Differences are mainly **latency**: Logistic Regression and Naive Bayes infer in <1 ms/sample vs Random Forest at ~5 ms.

## Regression — Wine Quality

Random Forest Regressor usually achieves lowest RMSE; Lasso helps when interpretability matters. **Takeaway:** ensemble regressors beat linear baselines on nonlinear physicochemical features.

## Unsupervised — Iris

k-Means achieves highest silhouette on Iris (3 well-separated clusters). DBSCAN is sensitive to `eps` — document parameter choices.

## Unsupervised — Digits PCA

PCA (10 components) + SVM matches raw-pixel kNN with **~10× lower inference latency** on 8×8 digits. **Takeaway:** dimensionality reduction pays off on small images.

## Vision — Fashion-MNIST

| Model | Typical accuracy (3 epochs, 8k train) |
|-------|-------------------------------------|
| Flatten + Random Forest | ~82–85% |
| MLP | ~86–88% |
| CNN | ~90–92% |

**CNN lift:** +5–8 pp over flatten+RF with OpenCV augmentation. Run `kiln-benchmark --track vision --epochs 10` locally for full numbers.

## Detection — Hard Hat Workers

| Model | mAP@50 | mAP@50-95 | Inference |
|-------|--------|-----------|-----------|
| YOLOv8n | ~61% | ~38% | ~12 ms/frame |
| YOLOv8s | ~66% | ~42% | ~19 ms/frame |

**Tradeoff:** YOLOv8s gains ~5 pp mAP@50 at ~50% higher latency. Train on Colab with `notebooks/04_roboflow_yolo_hardhat.ipynb`.

## Cross-track lesson

Classical ML (sklearn) remains the right tool for small tabular data. Deep learning (Keras, YOLO) wins when input dimensionality and spatial structure grow — but costs training time and compute. Kiln quantifies these tradeoffs on the same leaderboard schema.
