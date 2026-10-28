import logging
import re
from threading import Lock
from typing import Any

import numpy as np

logger = logging.getLogger(__name__)
AI_MODEL_NAME = "BAAI/bge-small-en-v1.5"

_MODEL: Any = None
_MODEL_ERROR: str | None = None
_MODEL_LOCK = Lock()

DOCUMENT_TYPES = (
    {
        "label": "Fire safety certificate",
        "category": "Fire & Safety",
        "description": "A fire safety certificate, fire department no-objection certificate, or fire and rescue service approval.",
    },
    {
        "label": "Academic affiliation or regulatory approval",
        "category": "Academic / Affiliation",
        "description": "An academic affiliation order, university affiliation, AICTE approval, or extension of approval.",
    },
    {
        "label": "Building stability or occupancy certificate",
        "category": "Infrastructure",
        "description": "A structural stability, building safety, completion, or occupancy certificate for institutional premises.",
    },
    {
        "label": "Land ownership or registered title deed",
        "category": "Infrastructure",
        "description": "A registered property title deed, land ownership record, lease deed, or land-use document.",
    },
    {
        "label": "Faculty declaration or staffing record",
        "category": "Governance & Finance",
        "description": "A faculty declaration, teaching staff list, faculty appointment record, or cadre details.",
    },
    {
        "label": "Fee structure or financial declaration",
        "category": "Governance & Finance",
        "description": "An approved fee structure, fee committee order, financial statement, or institutional finance declaration.",
    },
    {
        "label": "Governance or anti-ragging declaration",
        "category": "Governance & Finance",
        "description": "An anti-ragging undertaking, governance declaration, statutory compliance undertaking, or institutional policy.",
    },
    {
        "label": "Other statutory institution document",
        "category": "Other",
        "description": "Another official statutory or regulatory document submitted by an educational institution.",
    },
)

SECTION_QUERIES = (
    ("Document purpose or title", "The document title, certificate type, and purpose."),
    ("Institution name", "The name of the college, institution, applicant, or organization."),
    ("Document reference number", "The certificate, reference, registration, order, or document number."),
    ("Issuing authority", "The government department, university, regulator, or authority issuing this document."),
    ("Issue and validity dates", "The issue date, effective date, expiry date, or validity period."),
)


def _get_model() -> Any:
    global _MODEL, _MODEL_ERROR
    if _MODEL_ERROR:
        raise RuntimeError(_MODEL_ERROR)
    if _MODEL is None:
        try:
            from fastembed import TextEmbedding

            _MODEL = TextEmbedding(model_name=AI_MODEL_NAME)
        except Exception as exc:
            _MODEL_ERROR = f"The local semantic model {AI_MODEL_NAME} could not be loaded."
            raise RuntimeError(_MODEL_ERROR) from exc
    return _MODEL


def get_ai_model_status() -> dict[str, str]:
    if _MODEL_ERROR:
        status = "unavailable"
    elif _MODEL is not None:
        status = "ready"
    else:
        status = "not_loaded"
    return {"provider": "FastEmbed / ONNX Runtime", "model": AI_MODEL_NAME, "status": status}


def _text_chunks(text: str, max_chunks: int = 40, chunk_size: int = 700) -> list[str]:
    normalized_text = re.sub(r"\s+", " ", text).strip()
    if not normalized_text:
        return []
    chunks = [
        normalized_text[start : start + chunk_size]
        for start in range(0, len(normalized_text), chunk_size)
    ]
    if len(chunks) <= max_chunks:
        return chunks
    indexes = np.linspace(0, len(chunks) - 1, num=max_chunks, dtype=int)
    return [chunks[index] for index in indexes]


def _cosine_similarity(left: np.ndarray, right: np.ndarray) -> np.ndarray:
    left_norms = np.linalg.norm(left, axis=1, keepdims=True)
    right_norms = np.linalg.norm(right, axis=1, keepdims=True)
    return (left @ right.T) / np.maximum(left_norms @ right_norms.T, 1e-12)


def analyze_document_understanding(text: str, expected_category: str | None) -> dict[str, Any]:
    """Use a pretrained embedding model to rank document types and relevant passages."""
    base_result: dict[str, Any] = {
        **get_ai_model_status(),
        "task": "Semantic document-type ranking and relevant-section retrieval",
        "predictedDocumentType": None,
        "similarity": None,
        "expectedCategory": expected_category,
        "expectedCategoryMatch": None,
        "relevantSections": [],
    }
    chunks = _text_chunks(text)
    if not chunks:
        return {
            **base_result,
            "status": "skipped",
            "message": "No readable text was available for semantic analysis.",
        }

    try:
        with _MODEL_LOCK:
            model = _get_model()
            inputs = (
                chunks
                + [candidate["description"] for candidate in DOCUMENT_TYPES]
                + [query for _field, query in SECTION_QUERIES]
            )
            vectors = np.asarray(list(model.embed(inputs)), dtype=np.float32)

        chunk_vectors = vectors[: len(chunks)]
        type_start = len(chunks)
        type_vectors = vectors[type_start : type_start + len(DOCUMENT_TYPES)]
        section_start = type_start + len(DOCUMENT_TYPES)
        section_vectors = vectors[section_start:]

        type_similarities = _cosine_similarity(type_vectors, chunk_vectors)
        ranked_types = []
        for index, candidate in enumerate(DOCUMENT_TYPES):
            scores = np.sort(type_similarities[index])[-min(3, len(chunks)) :]
            ranked_types.append(
                {
                    **candidate,
                    "similarity": round(float(np.mean(scores)), 4),
                }
            )
        ranked_types.sort(key=lambda item: item["similarity"], reverse=True)
        predicted_type = ranked_types[0]

        expected_match = (
            predicted_type["category"] == expected_category
            if expected_category
            else None
        )
        section_similarities = _cosine_similarity(section_vectors, chunk_vectors)
        relevant_sections = []
        for index, (field, _query) in enumerate(SECTION_QUERIES):
            best_index = int(np.argmax(section_similarities[index]))
            relevant_sections.append(
                {
                    "field": field,
                    "text": chunks[best_index][:240],
                    "similarity": round(float(section_similarities[index, best_index]), 4),
                }
            )

        return {
            **base_result,
            "status": "complete",
            "predictedDocumentType": predicted_type["label"],
            "similarity": predicted_type["similarity"],
            "expectedCategoryMatch": expected_match,
            "rankedDocumentTypes": ranked_types[:3],
            "relevantSections": relevant_sections,
            "message": (
                "Similarity scores rank candidate descriptions; they are not calibrated probabilities "
                "or evidence of authenticity."
            ),
        }
    except Exception as exc:
        logger.exception("Pretrained document-understanding analysis failed")
        return {
            **get_ai_model_status(),
            "status": "unavailable",
            "task": base_result["task"],
            "predictedDocumentType": None,
            "similarity": None,
            "expectedCategory": expected_category,
            "expectedCategoryMatch": None,
            "relevantSections": [],
            "message": (
                f"Semantic model analysis did not run: {exc}. "
                "Rule-based checks continue; review the document manually."
            ),
        }
