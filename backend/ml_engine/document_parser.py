import os
import io
import pymupdf as fitz
from PIL import Image

def extract_pdf_data(file_bytes: bytes, filename: str):
    """
    Extracts text, metadata, page count, and renders the first page image for vision analysis.
    """
    text_content = ""
    metadata = {}
    rendered_image = None
    page_count = 0
    suspicious_metadata = []

    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        page_count = len(doc)
        metadata = doc.metadata or {}

        # Check for suspicious editing software
        creator = (metadata.get("creator") or "").lower()
        producer = (metadata.get("producer") or "").lower()
        for flag in ["photoshop", "canva", "gimp", "illustrator", "inkscape", "coreldraw"]:
            if flag in creator or flag in producer:
                suspicious_metadata.append(f"Document created/modified using image editing software: {creator or producer}")

        # Extract text across pages
        full_text = []
        for page_idx in range(page_count):
            page = doc[page_idx]
            page_text = page.get_text("text")
            full_text.append(page_text)

        text_content = "\n".join(full_text).strip()

        # Render first page to image for computer vision & ELA
        if page_count > 0:
            first_page = doc[0]
            pix = first_page.get_pixmap(dpi=150)
            img_bytes = pix.tobytes("png")
            rendered_image = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    except Exception as e:
        # If not a PDF, attempt opening as image
        try:
            rendered_image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
            text_content = f"Image file: {filename}"
            page_count = 1
        except Exception:
            text_content = f"Unable to parse binary stream for {filename}: {str(e)}"

    return {
        "text": text_content,
        "metadata": metadata,
        "page_count": page_count,
        "rendered_image": rendered_image,
        "suspicious_metadata": suspicious_metadata
    }
