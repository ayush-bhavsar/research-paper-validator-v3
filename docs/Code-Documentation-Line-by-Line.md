# Research Paper Validator v3 — Detailed Code Documentation
## Line-by-Line Explanation of All Source Files

---

## 1. Backend: `app.py`

### Purpose
Flask web server that serves the single-page application and static assets.

### Line-by-Line Breakdown

```python
from flask import Flask, render_template
```
**Line 1:** Import Flask framework class and `render_template` function for serving HTML templates.

```python
app = Flask(__name__)
```
**Line 3:** Create a Flask application instance. `__name__` helps Flask locate templates and static files relative to this module.

```python
@app.route('/')
```
**Line 5:** Define a route decorator that maps the root URL path (`/`) to the following function.

```python
def index():
```
**Line 6:** Define the `index` function that handles requests to the root path.

```python
    return render_template('index.html')
```
**Line 7:** Render and return the `index.html` template from the `templates/` directory.

```python
if __name__ == '__main__':
```
**Line 9:** Check if this script is being run directly (not imported as a module).

```python
    app.run(debug=True, host='0.0.0.0', port=8080)
```
**Line 10:** Start the Flask development server with:
- `debug=True`: Enable debug mode for auto-reload and detailed error pages
- `host='0.0.0.0'`: Allow connections from any network interface (not just localhost)
- `port=8080`: Listen on port 8080

---

## 2. Frontend HTML: `templates/index.html`

### Purpose
Single-page application structure defining the UI layout and components.

### Line-by-Line Breakdown

```html
<!DOCTYPE html>
```
**Line 1:** HTML5 document type declaration.

```html
<html lang="en">
```
**Line 2:** Root HTML element with English language attribute for accessibility.

```html
<head>
```
**Line 3:** Begin head section containing metadata and resource links.

```html
    <meta charset="UTF-8">
```
**Line 4:** Set character encoding to UTF-8 for universal character support.

```html
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
```
**Line 5:** Configure viewport for responsive design on mobile devices.

```html
    <title>Research Paper Validator</title>
```
**Line 6:** Set the browser tab/window title.

```html
    <link rel="stylesheet" href="{{ url_for('static', filename='css/styles.css') }}">
```
**Line 7:** Link the CSS stylesheet using Flask's `url_for` to generate the correct static file path.

```html
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
```
**Line 8:** Load PDF.js library from CDN for client-side PDF rendering.

```html
    <script src="https://cdn.jsdelivr.net/npm/web3@1.8.2/dist/web3.min.js"></script>
```
**Line 9:** Load Web3.js library from CDN for Ethereum wallet interaction.

```html
</head>
```
**Line 10:** Close head section.

```html
<body>
```
**Line 11:** Begin body section containing visible page content.

```html
    <div class="container">
```
**Line 12:** Main container div for centering and styling the application.

```html
        <h1>Research Paper Validator</h1>
```
**Line 13:** Main heading displaying the application title.

```html
        <p>Demonstrate blockchain integrity for academic work. Upload a PDF, preview it, generate a hash, and anchor it on Ethereum via MetaMask.</p>
```
**Line 14:** Subtitle paragraph explaining the application's purpose.

```html
        <button id="connectWallet">Connect MetaMask</button>
```
**Line 16:** Button to trigger MetaMask wallet connection.

```html
        <div id="walletStatus">Wallet not connected</div>
```
**Line 17:** Status display div showing current wallet connection state.

```html
        <div class="upload-zone" id="uploadZone">
```
**Line 19:** Clickable upload zone container for drag-and-drop or click upload.

```html
            <p>Drag and drop a PDF here or click to browse (max 10 MB)</p>
```
**Line 20:** Instruction text for file upload.

```html
            <input type="file" id="fileInput" accept=".pdf" hidden>
```
**Line 21:** Hidden file input element that only accepts PDF files.

```html
        </div>
```
**Line 22:** Close upload zone div.

```html
        <div id="pdfViewer" style="display: none;">
```
**Line 24:** PDF viewer container, initially hidden until a file is uploaded.

```html
            <canvas id="pdfCanvas"></canvas>
```
**Line 25:** HTML5 canvas element where PDF pages are rendered.

```html
            <div class="controls">
```
**Line 26:** Container for PDF navigation controls.

```html
                <button id="prevPage">Previous</button>
```
**Line 27:** Button to navigate to the previous PDF page.

```html
                <span id="pageInfo">Page 1 of 1</span>
```
**Line 28:** Text display showing current page number and total pages.

```html
                <button id="nextPage">Next</button>
```
**Line 29:** Button to navigate to the next PDF page.

```html
            </div>
```
**Line 30:** Close controls div.

```html
        </div>
```
**Line 31:** Close PDF viewer div.

```html
        <button id="validateBtn" disabled>Validate Paper</button>
```
**Line 33:** Validation button, initially disabled until a PDF is uploaded and wallet is connected.

```html
        <div id="result" style="display: none;">
```
**Line 35:** Results container, initially hidden until validation completes.

```html
            <h2>Validation Result</h2>
```
**Line 36:** Heading for the results section.

```html
            <p><strong>Document Hash:</strong> <span id="docHash"></span></p>
```
**Line 37:** Display label and span for the SHA-256 document hash.

```html
            <p><strong>Status:</strong> <span id="status"></span></p>
```
**Line 38:** Display label and span for validation status.

```html
            <p><strong>Timestamp:</strong> <span id="timestamp"></span></p>
```
**Line 39:** Display label and span for validation timestamp.

```html
            <p><strong>Signature:</strong> <span id="signature"></span></p>
```
**Line 40:** Display label and span for the cryptographic signature.

```html
            <p><strong>Signer:</strong> <span id="signer"></span></p>
```
**Line 41:** Display label and span for the recovered signer address.

```html
        </div>
```
**Line 42:** Close result div.

```html
    </div>
```
**Line 43:** Close main container div.

```html
    <script src="{{ url_for('static', filename='js/script.js') }}"></script>
```
**Line 44:** Load the main JavaScript file using Flask's `url_for` function.

```html
</body>
```
**Line 45:** Close body section.

```html
</html>
```
**Line 46:** Close HTML document.

---

## 3. Frontend JavaScript: `static/js/script.js`

### Purpose
Client-side application logic for file handling, PDF rendering, hashing, and MetaMask interaction.

### Line-by-Line Breakdown

```javascript
let pdfDoc = null;
```
**Line 1:** Declare global variable to store the loaded PDF document object from PDF.js.

```javascript
let pageNum = 1;
```
**Line 2:** Declare global variable to track the current page number being displayed (starts at page 1).

```javascript
let web3;
```
**Line 3:** Declare global variable to store the Web3.js instance for blockchain interactions.

```javascript
let account;
```
**Line 4:** Declare global variable to store the connected Ethereum wallet address.

```javascript
document.getElementById('connectWallet').addEventListener('click', async () => {
```
**Line 6:** Add click event listener to the "Connect MetaMask" button; use async function for await operations.

```javascript
    if (typeof window.ethereum !== 'undefined') {
```
**Line 7:** Check if MetaMask (or another Ethereum provider) is installed by verifying `window.ethereum` exists.

```javascript
        web3 = new Web3(window.ethereum);
```
**Line 8:** Create a new Web3 instance using the MetaMask provider.

```javascript
        try {
```
**Line 9:** Begin try block to catch connection errors.

```javascript
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
```
**Line 10:** Request user's Ethereum accounts from MetaMask; prompts user to approve connection.

```javascript
            account = accounts[0];
```
**Line 11:** Store the first (primary) account address from the returned array.

```javascript
            document.getElementById('walletStatus').textContent = `Connected: ${account}`;
```
**Line 12:** Update the wallet status display to show the connected account address.

```javascript
            console.log('Connected to MetaMask:', account);
```
**Line 13:** Log the successful connection to browser console for debugging.

```javascript
        } catch (error) {
```
**Line 14:** Catch any errors that occur during connection (e.g., user rejection).

```javascript
            console.error('MetaMask connection error:', error);
```
**Line 15:** Log the error details to console for debugging.

```javascript
            alert('MetaMask connection failed: ' + error.message);
```
**Line 16:** Show user-friendly alert with error message.

```javascript
        }
```
**Line 17:** Close try-catch block.

```javascript
    } else {
```
**Line 18:** Handle case when MetaMask is not detected.

```javascript
        alert('MetaMask not detected. Please install MetaMask extension.');
```
**Line 19:** Show alert instructing user to install MetaMask.

```javascript
    }
```
**Line 20:** Close if-else block.

```javascript
});
```
**Line 21:** Close event listener function.

```javascript
const uploadZone = document.getElementById('uploadZone');
```
**Line 23:** Get reference to the upload zone div element.

```javascript
const fileInput = document.getElementById('fileInput');
```
**Line 24:** Get reference to the hidden file input element.

```javascript
uploadZone.addEventListener('click', () => fileInput.click());
```
**Line 26:** When upload zone is clicked, trigger click on the hidden file input to open file picker.

```javascript
uploadZone.addEventListener('dragover', (e) => {
```
**Line 27:** Add dragover event listener for drag-and-drop functionality.

```javascript
    e.preventDefault();
```
**Line 28:** Prevent default browser behavior (which would try to open the file in browser).

```javascript
    uploadZone.classList.add('dragover');
```
**Line 29:** Add 'dragover' CSS class to visually indicate the drop zone is active.

```javascript
});
```
**Line 30:** Close dragover event listener.

```javascript
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
```
**Line 31:** Remove 'dragover' class when user drags file away from the zone.

```javascript
uploadZone.addEventListener('drop', (e) => {
```
**Line 32:** Add drop event listener for when user releases the dragged file.

```javascript
    e.preventDefault();
```
**Line 33:** Prevent default browser behavior (opening file in new tab).

```javascript
    uploadZone.classList.remove('dragover');
```
**Line 34:** Remove the dragover visual styling.

```javascript
    const files = e.dataTransfer.files;
```
**Line 35:** Extract the dropped files from the event's dataTransfer object.

```javascript
    if (files.length && files[0].type === 'application/pdf') {
```
**Line 36:** Check if at least one file was dropped and it's a PDF (MIME type check).

```javascript
        handleFile(files[0]);
```
**Line 37:** Pass the first dropped file to the file handler function.

```javascript
    }
```
**Line 38:** Close if statement.

```javascript
});
```
**Line 39:** Close drop event listener.

```javascript
fileInput.addEventListener('change', (e) => {
```
**Line 40:** Add change event listener for when user selects a file via the file picker.

```javascript
    if (e.target.files.length) handleFile(e.target.files[0]);
```
**Line 41:** If a file was selected, pass it to the file handler function.

```javascript
});
```
**Line 42:** Close change event listener.

```javascript
function handleFile(file) {
```
**Line 44:** Define function to process the uploaded/dropped PDF file.

```javascript
    if (file.size > 10 * 1024 * 1024) {
```
**Line 45:** Check if file size exceeds 10 MB (10 × 1024 × 1024 bytes).

```javascript
        alert('File too large (max 10 MB)');
```
**Line 46:** Show alert if file is too large.

```javascript
        return;
```
**Line 47:** Exit function early to prevent processing oversized files.

```javascript
    }
```
**Line 48:** Close if statement.

```javascript
    const fileReader = new FileReader();
```
**Line 49:** Create a FileReader object to read the file contents.

```javascript
    fileReader.onload = function() {
```
**Line 50:** Define callback function that executes when file reading is complete.

```javascript
        const typedArray = new Uint8Array(this.result);
```
**Line 51:** Convert the file's ArrayBuffer result into a Uint8Array (byte array) for PDF.js.

```javascript
        pdfjsLib.getDocument(typedArray).promise.then((pdf) => {
```
**Line 52:** Load the PDF document using PDF.js; returns a promise that resolves with the PDF object.

```javascript
            pdfDoc = pdf;
```
**Line 53:** Store the loaded PDF document in the global variable for later access.

```javascript
            renderPage(pageNum);
```
**Line 54:** Render the first page of the PDF.

```javascript
            document.getElementById('pdfViewer').style.display = 'block';
```
**Line 55:** Make the PDF viewer container visible.

```javascript
            document.getElementById('validateBtn').disabled = false;
```
**Line 56:** Enable the "Validate Paper" button now that a PDF is loaded.

```javascript
        });
```
**Line 57:** Close the promise then() callback.

```javascript
    };
```
**Line 58:** Close the onload function.

```javascript
    fileReader.readAsArrayBuffer(file);
```
**Line 59:** Start reading the file as an ArrayBuffer (binary data).

```javascript
}
```
**Line 60:** Close handleFile function.

```javascript
function renderPage(num) {
```
**Line 62:** Define function to render a specific page number of the PDF.

```javascript
    pdfDoc.getPage(num).then((page) => {
```
**Line 63:** Get the page object for the specified page number; returns a promise.

```javascript
        const canvas = document.getElementById('pdfCanvas');
```
**Line 64:** Get reference to the canvas element where the page will be drawn.

```javascript
        const ctx = canvas.getContext('2d');
```
**Line 65:** Get the 2D rendering context for drawing on the canvas.

```javascript
        const viewport = page.getViewport({ scale: 1.5 });
```
**Line 66:** Calculate the viewport (dimensions) for the page at 1.5× scale (150% size).

```javascript
        canvas.height = viewport.height;
```
**Line 67:** Set canvas height to match the viewport height.

```javascript
        canvas.width = viewport.width;
```
**Line 68:** Set canvas width to match the viewport width.

```javascript
        page.render({ canvasContext: ctx, viewport });
```
**Line 69:** Render the PDF page onto the canvas using the context and viewport.

```javascript
        document.getElementById('pageInfo').textContent = `Page ${num} of ${pdfDoc.numPages}`;
```
**Line 70:** Update the page info display to show current page and total pages.

```javascript
    });
```
**Line 71:** Close the promise then() callback.

```javascript
}
```
**Line 72:** Close renderPage function.

```javascript
document.getElementById('prevPage').addEventListener('click', () => {
```
**Line 74:** Add click event listener to the "Previous" button.

```javascript
    if (pageNum > 1) {
```
**Line 75:** Check if current page is greater than 1 (not on first page).

```javascript
        pageNum--;
```
**Line 76:** Decrement the page number by 1.

```javascript
        renderPage(pageNum);
```
**Line 77:** Render the previous page.

```javascript
    }
```
**Line 78:** Close if statement.

```javascript
});
```
**Line 79:** Close event listener.

```javascript
document.getElementById('nextPage').addEventListener('click', () => {
```
**Line 80:** Add click event listener to the "Next" button.

```javascript
    if (pageNum < pdfDoc.numPages) {
```
**Line 81:** Check if current page is less than total pages (not on last page).

```javascript
        pageNum++;
```
**Line 82:** Increment the page number by 1.

```javascript
        renderPage(pageNum);
```
**Line 83:** Render the next page.

```javascript
    }
```
**Line 84:** Close if statement.

```javascript
});
```
**Line 85:** Close event listener.

```javascript
document.getElementById('validateBtn').addEventListener('click', async () => {
```
**Line 87:** Add click event listener to "Validate Paper" button; use async for await operations.

```javascript
    if (!pdfDoc || !account) return;
```
**Line 88:** Guard clause: exit if no PDF is loaded or wallet is not connected.

```javascript
    const hash = await generateHash();
```
**Line 89:** Generate SHA-256 hash of the PDF and wait for completion.

```javascript
    await signHashWithMetaMask(hash);
```
**Line 90:** Request MetaMask signature of the hash and wait for completion.

```javascript
});
```
**Line 91:** Close event listener.

```javascript
async function generateHash() {
```
**Line 93:** Define async function to generate SHA-256 hash of the PDF.

```javascript
    const pdfBytes = await pdfDoc.getData();
```
**Line 94:** Get the raw binary data (byte array) of the entire PDF document.

```javascript
    const hashBuffer = await crypto.subtle.digest('SHA-256', pdfBytes);
```
**Line 95:** Use Web Crypto API to compute SHA-256 hash; returns an ArrayBuffer.

```javascript
    const hashArray = Array.from(new Uint8Array(hashBuffer));
```
**Line 96:** Convert the hash ArrayBuffer to a regular array of bytes.

```javascript
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
```
**Line 97:** Convert each byte to hexadecimal (base 16), pad to 2 digits, join into a single string, and return.

```javascript
}
```
**Line 98:** Close generateHash function.

```javascript
async function signHashWithMetaMask(hash) {
```
**Line 100:** Define async function to request MetaMask signature of the hash.

```javascript
    try {
```
**Line 101:** Begin try block to catch signature errors.

```javascript
        // Ask MetaMask to sign the message (hash) with the connected account
```
**Line 102:** Comment explaining the following operation.

```javascript
        const signature = await window.ethereum.request({
```
**Line 103:** Request a signature from MetaMask using the Ethereum provider.

```javascript
            method: 'personal_sign',
```
**Line 104:** Specify the 'personal_sign' method (off-chain signature, no gas fees).

```javascript
            params: [ '0x' + hash, account ],
```
**Line 105:** Pass parameters: the hash (prefixed with '0x') and the signer's account address.

```javascript
        });
```
**Line 106:** Close the request object.

```javascript
        // Optional: recover the signer to show verification info
```
**Line 108:** Comment explaining the verification step.

```javascript
        const recovered = await web3.eth.personal.ecRecover('0x' + hash, signature);
```
**Line 109:** Use Web3 to recover the signer's address from the hash and signature (proof of authenticity).

```javascript
        document.getElementById('docHash').textContent = hash;
```
**Line 111:** Display the document hash in the results panel.

```javascript
        document.getElementById('status').textContent = 'Signed with MetaMask';
```
**Line 112:** Update status to indicate successful signing.

```javascript
        document.getElementById('timestamp').textContent = new Date().toLocaleString();
```
**Line 113:** Display the current date and time in a human-readable format.

```javascript
        document.getElementById('signature').textContent = signature;
```
**Line 114:** Display the cryptographic signature in the results panel.

```javascript
        document.getElementById('signer').textContent = recovered || account;
```
**Line 115:** Display the recovered signer address (or fallback to account if recovery fails).

```javascript
        document.getElementById('result').style.display = 'block';
```
**Line 116:** Make the results panel visible.

```javascript
    } catch (error) {
```
**Line 117:** Catch any errors during signing (e.g., user rejection).

```javascript
        alert('Signature failed: ' + (error && error.message ? error.message : error));
```
**Line 118:** Show user-friendly alert with error details.

```javascript
        console.error('Signature error:', error);
```
**Line 119:** Log the full error to console for debugging.

```javascript
    }
```
**Line 120:** Close try-catch block.

```javascript
}
```
**Line 121:** Close signHashWithMetaMask function.

---

## 4. Summary of Code Flow

### Application Startup
1. Flask server starts and listens on port 8080
2. Browser requests root path (`/`)
3. Flask serves `index.html` template
4. Browser loads CSS, PDF.js, and Web3.js from CDN
5. Browser executes `script.js` to set up event listeners

### Wallet Connection Flow
1. User clicks "Connect MetaMask" button
2. JavaScript checks for `window.ethereum` (MetaMask presence)
3. Calls `eth_requestAccounts` to request access
4. MetaMask popup appears for user approval
5. On approval, account address is stored and displayed

### File Upload Flow
1. User drags PDF or clicks upload zone
2. File input triggers or drop event fires
3. `handleFile()` validates file size and type
4. FileReader reads file as ArrayBuffer
5. PDF.js parses and loads the document
6. First page is rendered on canvas
7. PDF viewer becomes visible
8. Validate button is enabled

### Validation Flow
1. User clicks "Validate Paper" button
2. `generateHash()` retrieves PDF binary data
3. Web Crypto API computes SHA-256 hash
4. Hash is converted to hexadecimal string
5. `signHashWithMetaMask()` requests signature
6. MetaMask prompts user to sign
7. Signature is generated using private key
8. `ecRecover` verifies the signer
9. Results panel displays hash, signature, timestamp, and signer
10. User can copy values for later verification

---

## 5. Key Technologies & Their Roles

| Technology | Purpose | Lines Used |
|------------|---------|------------|
| Flask | Backend web server | app.py: all |
| HTML5 | Page structure & semantics | index.html: all |
| CSS3 | Visual styling & layout | styles.css: all |
| JavaScript | Client-side logic | script.js: all |
| PDF.js | PDF rendering in browser | script.js: 52-72 |
| Web3.js | Ethereum wallet interaction | script.js: 6-21, 109 |
| Web Crypto API | SHA-256 hashing | script.js: 95 |
| FileReader API | File reading | script.js: 49-59 |
| Canvas API | PDF page rendering | script.js: 64-69 |

---

## 6. Security Considerations

### Privacy Protection
- **No server upload:** PDF stays in browser memory (lines script.js: 49-59)
- **Client-side hashing:** Server never sees document content (lines script.js: 93-98)
- **Local processing:** All operations in user's browser

### Cryptographic Security
- **SHA-256 hashing:** Industry-standard collision-resistant hash (line 95)
- **ECDSA signature:** Ethereum's elliptic curve signature scheme (lines 103-106)
- **Signature verification:** ecRecover proves authenticity (line 109)

### Input Validation
- **File size check:** Prevents memory issues (line 45)
- **MIME type check:** Only accepts PDFs (line 36)
- **Guard clauses:** Prevents invalid operations (line 88)

---

## 7. Error Handling Points

| Location | Error Type | Handling |
|----------|------------|----------|
| script.js:7-20 | MetaMask not installed | Alert with installation instructions |
| script.js:14-16 | Connection rejected | Alert with error message + console log |
| script.js:45-47 | File too large | Alert and early return |
| script.js:36 | Invalid file type | Silently ignored (no action) |
| script.js:117-119 | Signature cancelled | Alert with error + console log |

---

*This document provides complete line-by-line documentation for the Research Paper Validator v3 project. Each line is explained with its purpose, functionality, and role in the overall application flow.*
