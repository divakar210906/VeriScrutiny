import io

import pymupdf as fitz
from PIL import Image, UnidentifiedImageError


class DocumentParseError(ValueError):
    """Raised when an upload is not a supported, readable document."""


def extract_pdf_data(file_bytes: bytes, filename: str) -> dict:
    """Extract a PDF text layer or decode a PNG/JPEG and render its first page.

    OCR is not installed in this backend. Scanned documents and standalone
    images therefore return no extracted text and must be reviewed manually.
    """
    if not file_bytes:
        raise DocumentParseError("The uploaded file is empty.")

    if file_bytes.startswith(b"%PDF-"):
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
        except Exception as exc:
            raise DocumentParseError("The uploaded PDF could not be opened.") from exc

        try:
            if doc.needs_pass:
                raise DocumentParseError("Password-protected PDFs are not supported.")
            if len(doc) == 0:
                raise DocumentParseError("The uploaded PDF contains no pages.")
            if len(doc) > 100:
                raise DocumentParseError("PDFs with more than 100 pages are not supported for one analysis.")

            metadata = doc.metadata or {}
            text_content = "\n".join(page.get_text("text") for page in doc).strip()
            text_truncated = len(text_content) > 2_000_000
            if text_truncated:
                text_content = text_content[:2_000_000]
            pixmap = doc[0].get_pixmap(dpi=120, alpha=False)
            rendered_image = Image.open(io.BytesIO(pixmap.tobytes("png"))).convert("RGB")
            creator = (metadata.get("creator") or "").lower()
            producer = (metadata.get("producer") or "").lower()
            editing_tools = ("photoshop", "canva", "gimp", "illustrator", "inkscape", "coreldraw")
            suspicious_metadata = [
                "PDF metadata mentions image-editing software; this is an indicator for manual review, not proof of alteration."
            ] if any(tool in creator or tool in producer for tool in editing_tools) else []

            return {
                "text": text_content,
                "metadata": metadata,
                "page_count": len(doc),
                "rendered_image": rendered_image,
                "suspicious_metadata": suspicious_metadata,
                "file_type": "PDF",
                "image_format": None,
                "text_extraction": "TEXT FOUND" if text_content else "NO TEXT LAYER",
                "text_truncated": text_truncated,
            }
        except DocumentParseError:
            raise
        except Exception as exc:
            raise DocumentParseError("The PDF could not be fully read or rendered.") from exc
        finally:
            doc.close()

    try:
        with Image.open(io.BytesIO(file_bytes)) as source_image:
            if source_image.format not in {"PNG", "JPEG"}:
                raise DocumentParseError("Only PDF, PNG, and JPEG documents are supported.")
            rendered_image = source_image.convert("RGB")
            image_format = source_image.format
            rendered_image.thumbnail((1800, 2400), Image.Resampling.LANCZOS)
    except DocumentParseError:
        raise
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError) as exc:
        raise DocumentParseError("The upload is not a readable PDF, PNG, or JPEG document.") from exc

    return {
        "text": "",
        "metadata": {},
        "page_count": 1,
        "rendered_image": rendered_image,
        "suspicious_metadata": [],
        "file_type": "IMAGE",
        "image_format": image_format,
        "text_extraction": "NO TEXT LAYER",
        "text_truncated": False,
    }
