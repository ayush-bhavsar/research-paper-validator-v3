# Research Paper Validator v3 — Viva Summary

## 1. Project Overview
- **Purpose:** Validate research papers and prove integrity using cryptographic hashing and wallet-based signing.
- **Outcome:** Users upload a PDF, preview it, generate a SHA‑256 hash, and sign that hash via MetaMask to produce verifiable proof of authorship and time.
- **Scope:** Client‑side validation and signing for privacy; minimal Flask backend for serving.

## 2. Problem Statement & Motivation
- Manual checks for structure and formatting are time‑consuming and error‑prone.
- Submissions often lack consistent sections (Abstract, Introduction, etc.) and properly formatted references.
- Need a tool to quickly pre‑validate documents and provide tamper‑evident proof that a specific version existed at a certain time.

## 3. Core Features
- PDF upload (drag‑and‑drop or file picker) with size limit (10 MB).
- In‑browser PDF preview using PDF.js; pagination controls.
- Client‑side SHA‑256 hashing via Web Crypto API (document stays local).
- MetaMask wallet connect and off‑chain signature of the hash (`personal_sign`).
- Results panel: shows hash, timestamp, signature, and recovered signer.

## 4. System Architecture
- **Frontend:** `templates/index.html`, `static/css/styles.css`, `static/js/script.js`.
- **Backend:** Flask app (`app.py`) serving a single route and static assets.
- **Flow:** Browser handles file, hashing, and wallet signing; backend does not process file contents.
- **Security:** No document upload to server; only hash/signature displayed to the user.

## 5. Detailed Workflow
1. User opens the app and clicks “Connect MetaMask”.
2. MetaMask prompts for account access; on approval, the address is shown.
3. User uploads a PDF; the app renders it with PDF.js for review.
4. On “Validate Paper”, the app computes SHA‑256 of the PDF and calls `personal_sign` via MetaMask.
5. Signature and signer are displayed along with the hash and timestamp.
6. User can share hash + signature for independent verification later.

## 6. Backend Design (Flask)
- **Routes:**
  - `/` → Renders `index.html`.
- **Responsibilities:** Serve static files and template; no heavy processing.
- **Rationale:** Keep privacy by performing hashing/signing entirely client‑side.

## 7. Frontend Design & Components
- **Layout:** Single page with sections for wallet, upload zone, viewer, controls, validation, and result.
- **Components (6):**
  - Wallet connect button + status label
  - Upload zone + file input
  - PDF viewer (`canvas`) + pagination controls
  - Validate button
  - Result panel (hash, signature, signer, timestamp)
  - Alert/notification messages
- **Styling:** Light theme, accessible colors, responsive behavior for mobile.

## 8. Key Modules & Responsibilities
- `app.py`: Flask app bootstrapping and static/template serving.
- `templates/index.html`: Structure and script/style includes.
- `static/css/styles.css`: Visual styling, buttons, containers, viewer.
- `static/js/script.js`: Wallet connect, file handling, hashing, signing, UI updates.

## 9. Technologies Used
- **Backend:** Python 3, Flask.
- **Frontend:** HTML5, CSS3, Vanilla JS.
- **Libraries:** PDF.js (rendering), Web3.js (provider/wallet interaction), Web Crypto API (hashing).
- **Wallet:** MetaMask using `personal_sign`.

## 10. Exceptions & Edge Cases
- **No MetaMask:** Detection alert; validation disabled.
- **User denies connection/signature:** Operation cancelled with clear error.
- **Large/invalid PDFs:** Files >10 MB or corrupted PDFs blocked/fail to render.
- **Network/RPC restrictions:** Signature approach avoids EOA→EOA data transfer issues.
- **Browser limitations:** Must use modern browsers supporting PDF.js and Web Crypto.

## 11. Privacy & Security Considerations
- Document never leaves the user’s machine.
- Hash and signature are safe to share; they do not reveal content.
- Off‑chain signature avoids gas fees and unnecessary on‑chain exposure.

## 12. Verification Guide
- Keep the `hash` (hex) and `signature`.
- Verification approach (concept): Use `ecRecover` to recover the signer from `hash + signature`, then compare with the displayed address.
- Can be done with Web3/ethers or a server‑side script.

## 13. Setup & Usage
- **Install:** `pip install -r requirements.txt`
- **Run:** `python app.py`
- **Open:** `http://localhost:8080` in a browser with MetaMask.
- **Use:** Connect wallet → Upload PDF → Validate → Sign → Review results.

## 14. Factors Affecting Behavior
- Browser support and permissions
- MetaMask installation and unlock state
- Selected network (any for signature; testnets recommended for experiments)
- PDF size, structure, and renderability

## 15. Future Enhancements
- On‑chain anchoring via a minimal proof‑of‑existence smart contract.
- Style/section validators (APA/IEEE compliance checks).
- DOCX/PDF text extraction with semantic validation (NLP).
- Exportable validation reports and batch processing.

## 16. Appendix: File Structure
```
app.py
README.md
requirements.txt
static/
  css/
    styles.css
  js/
    script.js
templates/
  index.html
docs/
  Research-Paper-Validator-v3-Viva-Summary.md
```

---

### Export to PDF
- Open this Markdown file and use VS Code’s “Markdown: Print to PDF” or a Markdown-to-PDF tool.
- Alternatively, paste into any document tool (Word/Google Docs) and export as PDF.
