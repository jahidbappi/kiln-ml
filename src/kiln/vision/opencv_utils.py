from __future__ import annotations

import numpy as np

try:
    import cv2
except ImportError:
    cv2 = None  # type: ignore[assignment]


def augment_image(img: np.ndarray, *, flip: bool = True, rotate_deg: float = 15.0) -> np.ndarray:
    if cv2 is None:
        return img
    out = img.copy()
    if flip and np.random.random() > 0.5:
        out = cv2.flip(out, 1)
    if rotate_deg:
        h, w = out.shape[:2]
        matrix = cv2.getRotationMatrix2D((w / 2, h / 2), rotate_deg, 1.0)
        out = cv2.warpAffine(out, matrix, (w, h), borderMode=cv2.BORDER_REFLECT)
    return out


def normalize_brightness(img: np.ndarray, alpha: float = 1.1, beta: int = 10) -> np.ndarray:
    if cv2 is None:
        return img
    return cv2.convertScaleAbs(img, alpha=alpha, beta=beta)


def draw_detection_box(
    img: np.ndarray,
    box: tuple[int, int, int, int],
    label: str,
    *,
    color: tuple[int, int, int] = (0, 255, 0),
) -> np.ndarray:
    if cv2 is None:
        return img
    x1, y1, x2, y2 = box
    out = img.copy()
    cv2.rectangle(out, (x1, y1), (x2, y2), color, 2)
    cv2.putText(out, label, (x1, max(y1 - 8, 0)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)
    return out


def pca_heatmap(component: np.ndarray, size: int = 8) -> np.ndarray:
    if cv2 is None:
        return component.reshape(size, size)
    grid = component.reshape(size, size)
    norm = cv2.normalize(grid, None, 0, 255, cv2.NORM_MINMAX)
    return norm.astype(np.uint8)
