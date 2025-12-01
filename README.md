# Research Paper Validator v3 — Brief README

**What It Does**
- Validates and anchors research paper integrity by hashing uploaded PDFs and creating a verifiable proof via MetaMask.
- Renders PDF pages for quick visual review before validation.
- Produces a result panel with document hash, timestamp, and cryptographic signature (off‑chain via MetaMask).

**How It Works (End‑to‑End)**
- Upload PDF: User drags/drops or selects a file (max 10 MB).
- Preview: PDF.js renders pages in a canvas with next/prev controls.
- Hash: Browser computes SHA‑256 of the PDF using Web Crypto API.
- Sign: MetaMask signs the hash (`personal_sign`), proving authorship without on‑chain fees.
- Result: UI shows the hash, signature, recovered signer, and timestamp for sharing and later verification.

**Backend (Flask)**
- Serves a single route `/` from `app.py` rendering `templates/index.html`.
- Static assets (`static/css`, `static/js`) delivered by Flask’s static handler.
- No server‑side file processing; all validation runs client‑side for privacy.

**Frontend Design**
- Structure: `templates/index.html` (single page), `static/js/script.js` (logic), `static/css/styles.css` (styling).
- UI: Upload zone, PDF viewer, pagination controls, wallet connect button, validate button, and result panel.
- Theme: Light background, solid button colors, responsive layout.

**Components Count**
- Pages: 1 (index).
- Major UI components: 6
	- Connect Wallet button + status
	- Upload zone + file input
	- PDF viewer (`canvas`) + controls
	- Validate button
	- Result panel (hash, signature, signer, timestamp)
	- Notification/alerts via simple JS

**Complete Working (Flow)**
- Connect MetaMask → Upload PDF → Preview pages → Click Validate → MetaMask signs PDF hash → Show signature + signer → Share/verify later.

**Exceptions & Edge Cases**
- No MetaMask: Shows detection error and prevents validation.
- File too large: Blocks files >10 MB.
- Invalid file type: Only `application/pdf` accepted.
- Signature rejected/cancelled: Displays error; validation halts.
- Rendering errors: Fallback alerts if PDF.js cannot parse the document.

**Technologies Used**
- Backend: Python 3, Flask.
- Frontend: HTML5, CSS3, Vanilla JS.
- Libraries: PDF.js (rendering), Web3.js (wallet/provider), Web Crypto API (hashing).
- Wallet: MetaMask (`personal_sign` off‑chain signature).

**Factors Affecting Behavior**
- Browser support: PDF.js and Web Crypto availability in modern browsers.
- MetaMask state: Installation, unlock status, and selected network.
- File size/quality: Large or corrupted PDFs may fail to render.
- Network policies: Some RPCs disallow EOA→EOA data transfers; signature flow avoids this.
- User permissions: Wallet connection and signing must be approved.

**Quick Start**
- Install deps: `pip install -r requirements.txt`
- Run backend: `python app.py`
- Open: `http://localhost:8080` in a browser with MetaMask.

**Verify a Signature (Concept)**
- Keep the `hash` and `signature` values.
- Use `ecRecover` (Web3/ethers or backend script) to recover the signer and compare with the displayed address.

**Future Enhancements**
- On‑chain anchoring via a minimal proof‑of‑existence smart contract.
- Style‑profile validations (APA/IEEE sections and references).
- PDF/DOCX text extraction and semantic checks.

