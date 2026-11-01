# VeriScrutiny

VeriScrutiny is a browser-based demonstration of an institutional application and document scrutiny workflow. It provides separate institution and AICTE-officer portals, document submission and replacement, officer review, workflow status, and a printable workflow record.

## Run locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with `npm run build`; run the configured linter with `npm run lint`.

To run document analysis locally, start the FastAPI backend in a second terminal:

```powershell
python -m pip install -r backend/requirements.txt
python -m uvicorn main:app --app-dir backend --reload --host 127.0.0.1 --port 8000
```

Vite proxies `/api` requests to this service. The browser sends the selected uploaded file and its submitted metadata to the local backend when an officer runs analysis.
On the first analysis, RapidOCR initializes its packaged ONNX OCR weights and FastEmbed downloads the `BAAI/bge-small-en-v1.5` ONNX model (about 67 MB) into its model cache. The first request can take longer than later requests; subsequent analysis runs locally without a paid API.

## Demonstration accounts

Both accounts use the password `demo123`.

| Portal | ID |
|---|---|
| Institution — Kongu Engineering College | `KEC001` |
| AICTE Officer — Southern Region | `AICTE-SR-9042` |

These are client-side demonstration credentials, not production authentication. A browser-local session is stored to support the demo journeys.

## Current integration boundary

- Application metadata, workflow state, and uploaded files are stored in the current browser (`localStorage` and IndexedDB). When an officer runs analysis, that document and its submitted metadata are sent to the configured backend (locally by default); they are not sent to AICTE systems.
- PDF and image previews are shown only for files actually uploaded in this browser. Seed records without a source file are identified as missing source documents.
- The backend uses RapidOCR for scanned PDF pages and PNG/JPEG text, and the pretrained `BAAI/bge-small-en-v1.5` text-embedding model through FastEmbed/ONNX Runtime to rank likely document types and surface semantically relevant text sections. Similarity scores are rankings, not calibrated probabilities. Existing regex-based extraction and deterministic compliance rules remain in place; cross-document checks compare only metadata supplied by this browser session.
- OCR/model initialization failures are reported in analysis results while deterministic checks continue. Unsupported scripts, poor scan quality, OCR mistakes, and documents beyond the OCR page limit can require manual review. Findings do not establish authenticity, regulatory compliance, or final approval.
- Analysis results are advisory, stored with that document in the browser, and never change its workflow status. The officer remains the final decision-maker.
- Downloaded and printed records are demonstration workflow records, not official AICTE reports, certificates, or approvals.
- Demo data is illustrative and should not be treated as real application or regulatory information.
