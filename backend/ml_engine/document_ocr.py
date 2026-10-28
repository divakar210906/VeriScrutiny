import io
import logging
from threading import Lock
from typing import Any

import numpy as np
import pymupdf
from PIL import Image

logger = logging.getLogger(__name__)
MAX_OCR_PAGES = 30
_ocr_engine: Any = None
_ocr_error: str | None = None
_ocr_lock = Lock()


class OCRUnavailableError(RuntimeError):
    pass


def _get_ocr_engine() -> Any:
    global _ocr_engine, _ocr_error
    if _ocr_error:
        raise OCRUnavailableError(_ocr_error)
    with _ocr_lock:
        if _ocr_error:
            raise OCRUnavailableError(_ocr_error)
        if _ocr_engine is None:
            try:
                from rapidocr import RapidOCR

                _ocr_engine = RapidOCR()
            except Exception as exc:
                _ocr_error = "RapidOCR could not be initialized."
                raise OCRUnavailableError(_ocr_error) from exc
    return _ocr_engine


def get_ocr_status() -> dict[str, str]:
    if _ocr_error:
        status = "unavailable"
    elif _ocr_engine is not None:
        status = "ready"
    else:
        status = "not_loaded"
    return {"engine": "RapidOCR with ONNX Runtime", "status": status}


def _recognize_page(image: Image.Image) -> str:
    engine = _get_ocr_engine()
    rgb_image = image.convert("RGB")
    rgb_image.thumbnail((1800, 2400), Image.Resampling.LANCZOS)
    bgr_array = np.asarray(rgb_image)[:, :, ::-1].copy()
    result = engine(bgr_array)
    if result is None:
        return ""
    recognized_lines = []
    texts = getattr(result, "txts", ())
    scores = getattr(result, "scores", ())
    for text, score in zip(texts, scores):
        if float(score) >= 0.25:
            text = str(text).strip()
            if text:
                recognized_lines.append(text)
    return "\n".join(recognized_lines)


def extract_document_ocr(
    file_bytes: bytes,
    parsed_document: dict[str, Any],
) -> tuple[str, dict[str, Any]]:
    """OCR image uploads and PDF pages that do not already contain embedded text."""
    file_type = parsed_document["file_type"]
    if file_type == "IMAGE":
        try:
            with Image.open(io.BytesIO(file_bytes)) as image:
                text = _recognize_page(image)
        except OCRUnavailableError:
            raise
        except Exception as exc:
            logger.exception("OCR failed for uploaded image")
            raise OCRUnavailableError("RapidOCR could not process the uploaded image.") from exc
        return text, {
            **get_ocr_status(),
            "pagesProcessed": 1,
            "pagesTotal": 1,
            "truncated": False,
        }

    text_pages = []
    pages_processed = 0
    page_count = int(parsed_document["page_count"])
    truncated = False
    try:
        with pymupdf.open(stream=file_bytes, filetype="pdf") as document:
            for page_index, page in enumerate(document):
                if page.get_text("text").strip():
                    continue
                if pages_processed >= MAX_OCR_PAGES:
                    truncated = True
                    break
                pages_processed += 1
                pixmap = page.get_pixmap(dpi=150, alpha=False)
                with Image.open(io.BytesIO(pixmap.tobytes("png"))) as image:
                    page_text = _recognize_page(image)
                if page_text:
                    text_pages.append(f"[OCR page {page_index + 1}]\n{page_text}")
    except OCRUnavailableError:
        raise
    except Exception as exc:
        logger.exception("OCR failed while processing PDF pages")
        raise OCRUnavailableError("RapidOCR could not process the uploaded PDF.") from exc

    return "\n\n".join(text_pages), {
        **get_ocr_status(),
        "pagesProcessed": pages_processed,
        "pagesTotal": page_count,
        "truncated": truncated,
    }
