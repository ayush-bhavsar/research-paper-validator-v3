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
1. User opens the app and clicks "Connect MetaMask".
2. MetaMask prompts for account access; on approval, the address is shown.
3. User uploads a PDF; the app renders it with PDF.js for review.
4. On "Validate Paper", the app computes SHA‑256 of the PDF and calls `personal_sign` via MetaMask.
5. Signature and signer are displayed along with the hash and timestamp.
6. User can share hash + signature for independent verification later.

## 5a. How the Project Works (Step-by-Step)

### Initial Setup Phase
- Flask server starts on `localhost:8080` and loads the single-page application.
- Browser loads `index.html` with embedded CSS and JavaScript.
- Web3.js library initializes to detect MetaMask presence via `window.ethereum`.

### Wallet Connection Phase
- User clicks "Connect MetaMask" button.
- JavaScript checks if `window.ethereum` exists (MetaMask installed).
- Calls `eth_requestAccounts` method to request wallet access.
- MetaMask popup appears asking user to approve connection.
- On approval, the connected Ethereum address is retrieved and displayed in the status area.
- If MetaMask is not detected, an alert notifies the user to install it.

### File Upload Phase
- User either clicks the upload zone or drags a PDF file onto it.
- JavaScript validates the file type (must be `application/pdf`) and size (max 10 MB).
- If valid, FileReader API reads the file as an ArrayBuffer.
- The raw binary data is passed to PDF.js library for rendering.

### PDF Preview Phase
- PDF.js parses the document and extracts total page count.
- First page is rendered on an HTML5 canvas element at 1.5x scale.
- Page navigation controls (Previous/Next buttons) become active.
- Page indicator shows "Page X of Y" dynamically.
- User can review the document visually before validation.

### Hash Generation Phase
- When user clicks "Validate Paper", JavaScript retrieves the complete PDF binary data.
- Web Crypto API's `crypto.subtle.digest('SHA-256', pdfBytes)` computes the hash.
- Result is a 256-bit (32-byte) hash converted to hexadecimal string.
- This hash uniquely represents the document content.

### Signature Phase
- The hex hash is prefixed with `0x` and passed to MetaMask's `personal_sign` method.
- MetaMask displays the signing prompt with the hash message.
- User reviews and approves the signature request.
- MetaMask generates a cryptographic signature using the user's private key.
- The signature (65 bytes: r, s, v components) is returned to the app.

### Verification & Display Phase
- JavaScript uses Web3's `ecRecover` to extract the signer address from the signature.
- This confirms the signature was created by the connected wallet.
- Result panel displays:
  - **Document Hash:** SHA-256 hex value
  - **Status:** "Signed with MetaMask"
  - **Timestamp:** Current date/time when signed
  - **Signature:** Full cryptographic signature (130 hex characters)
  - **Signer:** Recovered Ethereum address
- User can copy these values for sharing or later verification.

### Error Handling
- **MetaMask not installed:** Alert message with installation instructions.
- **Connection denied:** User-friendly error indicating wallet access was rejected.
- **Invalid file:** Alerts for wrong file type or oversized PDFs.
- **Signature cancelled:** Clear message if user declines signing.
- **PDF rendering errors:** Fallback alerts for corrupted or unsupported PDFs.

### Data Flow Summary
```
User Upload → FileReader → ArrayBuffer → PDF.js Render → Canvas Display
                                       ↓
                                  Web Crypto API
                                       ↓
                                  SHA-256 Hash
                                       ↓
                              MetaMask personal_sign
                                       ↓
                           Signature + ecRecover
                                       ↓
                              Display Results Panel
```

### Privacy & Security Design
- **No server upload:** PDF stays entirely in browser memory; Flask never sees the document.
- **Client-side hashing:** Ensures document content privacy while proving integrity.
- **Off-chain signature:** No gas fees, no blockchain transaction costs, instant results.
- **Verifiable proof:** Anyone with hash + signature can verify authenticity without accessing the original document.

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
