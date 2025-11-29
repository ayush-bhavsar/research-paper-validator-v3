# Research Paper Validator

Research Paper Validator is a single-page web application built with Python (Flask) that demonstrates how blockchain can be used to protect the integrity of academic work. Users upload a PDF, preview it in the browser, generate a SHA-256 hash, and push that hash to the Ethereum blockchain through MetaMask. The resulting transaction serves as tamper-evident proof that the document existed in its current form at a specific time.

## Features
- PDF upload and preview powered by Mozilla PDF.js.
- Client-side hashing with the Web Crypto API so the file never leaves the user's machine.
- Blockchain anchoring via Web3.js and MetaMask; the demo sends a zero-value transaction that embeds the document hash.
- Interactive UI with drag-and-drop uploads, pagination controls, and instant validation feedback.

## How It Works
1. Upload a PDF (max 10 MB). The app renders a preview so you can confirm the correct file.
2. Hash generation happens in the browser using SHA-256; only the hash is used after this point.
3. Blockchain commit: MetaMask prompts you to sign a transaction that stores the hash. The default flow sends the transaction back to the same account purely for proof-of-existence.
4. Verification: The UI displays the document hash, timestamp, and transaction hash you can share for auditing.

## Tech Stack
- Python (Flask for backend serving)
- HTML5, CSS3, Vanilla JavaScript
- PDF.js for in-browser PDF rendering
- Web3.js for Ethereum interaction
- Web Crypto API for hashing

## Prerequisites
- Python 3.x installed
- A modern desktop browser (Chrome, Edge, or Firefox recommended)
- MetaMask browser extension with an unlocked wallet
- Access to an Ethereum network (Sepolia testnet recommended for experimentation)

## Getting Started
1. Clone or navigate to the project directory: `d:\Projects\research-paper-validator-v3`
2. Install dependencies: `pip install -r requirements.txt`
3. Run the Flask app: `python app.py`
4. Open the printed URL (e.g., http://localhost:8080) in a browser where MetaMask is installed.

## Using the App
1. Click "Connect MetaMask" and ensure the wallet is unlocked on the desired network (Sepolia or Mainnet).
2. Drag and drop a PDF into the upload zone or click to browse.
3. Review the preview pages using the next/previous controls.
4. Press "Validate Paper".
5. Approve the transaction in MetaMask when prompted. The transaction sends zero ETH with the document hash encoded in the data field.
6. Wait for the confirmation banner showing the hash, status, and timestamp. You can inspect the transaction in a block explorer to verify the data.

## Example Walkthrough
- Download any public-domain PDF (e.g., an open-access research paper) and upload it to the validator.
- After clicking "Validate Paper", MetaMask will prompt for a transaction (To: your address, Value: 0 ETH, Data: hex-encoded hash).
- Once mined, the UI displays details like Document Hash, Status, Timestamp, Tx Hash, and Network.
- Paste the Tx Hash into https://sepolia.etherscan.io/ to verify the hash in the input data.

## Configuration Notes
- Network selection: Switch MetaMask to Sepolia (chain ID 0xaa36a7) for testing to avoid real gas fees.
- Gas limits: Set to 21000 for a simple transfer; adjust for smart contract interactions.
- Smart contract integration: Modify `static/js/script.js` to interact with a deployed contract using its ABI and address.

## Privacy & Security
- The PDF never leaves the browser; only its SHA-256 hash is used.
- Sharing the transaction hash allows others to verify the timestamp and hash without exposing document contents.
- Always test on a testnet before mainnet to avoid costs.

## Roadmap Ideas
- Dedicated smart contract for storing hashes and metadata
- Multi-file batch validation
- REST API for server-side verification
- WalletConnect support for mobile wallets

## images
<img width="533" height="911" alt="image" src="https://github.com/user-attachments/assets/037b7f8a-2358-4306-9118-a4a382d3e80f" />
<img width="1043" height="568" alt="image" src="https://github.com/user-attachments/assets/19b12082-db6e-4b57-8bbd-389ec5d016b0" />

