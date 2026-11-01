import cv2
import numpy as np
from PIL import Image

def analyze_stamps_and_signatures(image: Image.Image) -> dict:
    """
    Uses OpenCV computer vision filters to locate official rubber stamps/seals and handwritten signatures.
    Returns:
      {
        "seal_detected": bool,
        "signature_detected": bool,
        "details": list[str]
      }
    """
    if image is None:
        return {
            "seal_detected": False,
            "signature_detected": False,
            "details": ["No visual page render available for computer vision analysis."]
        }

    try:
        # Convert PIL to BGR OpenCV format
        open_cv_image = np.array(image.convert("RGB"))
        img_bgr = open_cv_image[:, :, ::-1].copy()
        h, w = img_bgr.shape[:2]

        # ----------------------------------------------------
        # 1. Official Seal / Rubber Stamp Detection (Color + Contour)
        # ----------------------------------------------------
        # Indian statutory seals are almost universally purple/violet, dark blue, or dark red/crimson.
        hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)

        # Violet/Blue seal color range
        lower_blue_purple = np.array([100, 40, 40])
        upper_blue_purple = np.array([160, 255, 255])
        mask_seal_bp = cv2.inRange(hsv, lower_blue_purple, upper_blue_purple)

        # Red seal color ranges
        lower_red1 = np.array([0, 50, 50])
        upper_red1 = np.array([10, 255, 255])
        lower_red2 = np.array([170, 50, 50])
        upper_red2 = np.array([180, 255, 255])
        mask_seal_red = cv2.bitwise_or(
            cv2.inRange(hsv, lower_red1, upper_red1),
            cv2.inRange(hsv, lower_red2, upper_red2)
        )

        seal_mask = cv2.bitwise_or(mask_seal_bp, mask_seal_red)

        # Morphological closing to join letters within stamp
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
        closed_seal = cv2.morphologyEx(seal_mask, cv2.MORPH_CLOSE, kernel)

        contours, _ = cv2.findContours(closed_seal, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        seal_found = False
        seal_count = 0

        min_seal_area = (w * h) * 0.0015  # min ~0.15% of page
        max_seal_area = (w * h) * 0.15    # max ~15% of page

        for cnt in contours:
            area = cv2.contourArea(cnt)
            if min_seal_area < area < max_seal_area:
                x, y, cw, ch = cv2.boundingRect(cnt)
                aspect_ratio = float(cw) / ch if ch > 0 else 0
                # Round or elliptical stamps have aspect ratio close to 1.0
                if 0.65 <= aspect_ratio <= 1.5:
                    hull = cv2.convexHull(cnt)
                    hull_area = cv2.contourArea(hull)
                    solidity = float(area) / hull_area if hull_area > 0 else 0
                    if solidity > 0.45:
                        seal_count += 1
                        seal_found = True

        # ----------------------------------------------------
        # 2. Handwritten Signature Detection (Bottom 40% of page)
        # ----------------------------------------------------
        # Signatures typically appear in the lower quadrant of statutory certificates
        bottom_y = int(h * 0.55)
        bottom_region = img_bgr[bottom_y:h, :]
        gray_bottom = cv2.cvtColor(bottom_region, cv2.COLOR_BGR2GRAY)

        # Adaptive thresholding to isolate ink strokes
        thresh = cv2.adaptiveThreshold(
            gray_bottom, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 21, 10
        )

        # Find connected stroke segments with high cursive elongation
        sig_contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        signature_found = False
        sig_candidates = 0

        for cnt in sig_contours:
            area = cv2.contourArea(cnt)
            if (w * 0.04) < cv2.arcLength(cnt, False) < (w * 0.8) and area > 120:
                bx, by, bw, bh = cv2.boundingRect(cnt)
                aspect = float(bw) / bh if bh > 0 else 0
                # Signature strokes are typically horizontal (aspect > 2.0)
                if aspect > 1.8 and bh < (h * 0.12):
                    sig_candidates += 1
                    signature_found = True

        details = []
        if seal_found:
            details.append(f"Colored stamp-like mark detected by a visual heuristic ({seal_count} candidate(s)); not authenticated.")
        else:
            details.append("No colored departmental rubber seal identified via computer vision.")

        if signature_found:
            details.append(f"Signature-like strokes detected by a visual heuristic ({sig_candidates} candidate(s)); not authenticated.")
        else:
            details.append("Official signatory stroke not clearly resolved in footer quadrant.")

        return {
            "seal_detected": seal_found,
            "signature_detected": signature_found,
            "details": details
        }

    except Exception:
        raise
