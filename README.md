# VeriScrutiny — Institutional Document Verification & Scrutiny Portal

**VeriScrutiny** is an AICTE-inspired institutional document scrutiny and verification platform developed for Smart India Hackathon (SIH 2026). It automates the verification workflow for higher technical education institutions submitting statutory approvals, clearances, and declarations.

---

## 🚀 How to Run in Browser

The development server is already active in the background!

### Quick Start

Simply open your web browser (Chrome, Edge, Firefox, Brave) and navigate to:

👉 **[http://localhost:5173/](http://localhost:5173/)**

---

### Starting the Server Manually (if stopped)

If you ever restart your terminal or machine, run:

1. Open a terminal in the project directory:
   ```bash
   cd c:\PROJECTS\VeriScrutiny
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Credentials

On the **Login** screen (`http://localhost:5173/login`), you can click the **"Quick Fill"** button or enter:

- **Institution ID**: `DEMO001`
- **Password**: `demo123`
- **Captcha**: Enter the 4-character code shown on screen (e.g. `7X8K`)

*Or switch to the **"Scrutiny Officer"** tab to log in with officer credentials (`OFFICER_TN01` / `demo123`).*

---

## 📋 Recommended Demonstration Sequence

1. **Login** (`/login`): Institutional SSO with captcha & role switcher.
2. **Dashboard** (`/dashboard`): Institution header (Kongu Engineering College), compliance rate, statutory notices, recent documents register.
3. **Documents Register** (`/documents`): Filter by category or status, search by keyword, export register to CSV.
4. **Document Details** (`/documents/doc-2`): Metadata breakdown and high-fidelity institutional certificate preview with official seal and QR digest.
5. **Scrutiny Workflow** (`/scrutiny/doc-2`):
   - **5-Stage Pipeline**: *Ingestion → Extraction → Rules Applied → Validation → Final Decision*.
   - **10-Parameter Statutory Checklist**: Live audit matrix evaluating against AICTE Approval Process Handbook (APH) norms.
   - **Document Switcher**: Effortlessly switch between showcase test cases:
     - `Fire Safety Certificate` → **NEEDS REVIEW**
     - `Affiliation Certificate` → **VERIFIED**
     - `Faculty Declaration` → **REJECTED**
6. **Official Scrutiny Report** (`/report/doc-2`): Printable official audit docket with security QR code and digital officer signature.
7. **Verification History** (`/history`): Immutable audit trail log of all scrutiny determinations.
8. **Institution Profile** (`/institution`): Kongu Engineering College master data tabs.
9. **Settings** (`/settings`): Scrutiny rule engine sensitivity and security preferences.

---

## 🛠️ Build for Production

To create a production-optimized build:

```bash
npm run build
```

To preview the production bundle locally:

```bash
npm run preview
```
