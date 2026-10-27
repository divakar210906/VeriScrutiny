import io
import numpy as np
from PIL import Image, ImageChops, ImageEnhance

def compute_ela(image: Image.Image, quality: int = 90, scale: int = 15) -> tuple[float, list[str]]:
    """
    Error Level Analysis (ELA) detects digital image manipulation / splicing.
    Takes a PIL Image, re-compresses it at a specified quality,
    and computes the absolute difference matrix.
    Returns:
      tampering_score (0.0 to 100.0)
      forensic_flags (list of detected anomaly descriptions)
    """
    forensic_flags = []
    
    if image is None:
        return 0.0, ["No visual page render available for ELA forensics."]

    try:
        # Normalize size for consistent analysis
        img = image.convert("RGB")
        if img.width > 1600 or img.height > 2200:
            img.thumbnail((1600, 2200), Image.Resampling.LANCZOS)

        # Re-save to JPEG in memory at chosen quality
        buffer = io.BytesIO()
        img.save(buffer, "JPEG", quality=quality)
        buffer.seek(0)
        recompressed = Image.open(buffer).convert("RGB")

        # Compute difference
        diff = ImageChops.difference(img, recompressed)
        
        # Calculate pixel variance and extrema
        diff_arr = np.array(diff, dtype=np.float32)
        mean_diff = np.mean(diff_arr)
        max_diff = np.max(diff_arr)
        std_diff = np.std(diff_arr)

        # Localized anomaly detection: high local std indicates copy-paste spliced text/seals
        # Divide into 16x16 grid and evaluate standard deviation distribution
        h, w, _ = diff_arr.shape
        grid_rows, grid_cols = 8, 8
        cell_h, cell_w = h // grid_rows, w // grid_cols
        cell_means = []

        for r in range(grid_rows):
            for c in range(grid_cols):
                cell = diff_arr[r*cell_h:(r+1)*cell_h, c*cell_w:(c+1)*cell_w]
                if cell.size > 0:
                    cell_means.append(np.mean(cell))

        cell_means = np.array(cell_means)
        anomaly_ratio = float(np.max(cell_means) / (np.median(cell_means) + 1e-5))

        # Calculate Tampering Risk Score (0-100)
        # Normal scan variance typically yields anomaly_ratio < 3.5
        score = 0.0
        if anomaly_ratio > 4.5:
            score += min(55.0, (anomaly_ratio - 3.5) * 15.0)
            forensic_flags.append(f"Localized compression divergence detected (ELA ratio {anomaly_ratio:.2f}x). Possible spliced stamp or altered text.")
        elif anomaly_ratio > 3.0:
            score += 20.0
            forensic_flags.append(f"Minor compression inconsistency detected across page sections ({anomaly_ratio:.2f}x).")

        if max_diff > 180:
            score += 25.0
            forensic_flags.append(f"High-frequency edge mismatch found (peak delta {max_diff:.0f}). Digital overlay suspected.")

        final_score = float(min(100.0, max(0.0, score)))
        return round(final_score, 1), forensic_flags

    except Exception as e:
        return 0.0, [f"Forensics processing notice: {str(e)}"]
