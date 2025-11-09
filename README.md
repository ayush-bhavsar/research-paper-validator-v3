# Research Paper Validator

Research Paper Validator is a single-page web application that demonstrates how blockchain can be used to protect the integrity of academic work. Users upload a PDF, preview it in the browser, generate a SHA-256 hash, and push that hash to the Ethereum blockchain through MetaMask. The resulting transaction serves as tamper-evident proof that the document existed in its current form at a specific time.

## Features
- **PDF upload and preview** powered by Mozilla PDF.js.
- **Client-side hashing** with the Web Crypto API so the file never leaves the user's machine.
- **Blockchain anchoring** via Web3.js and MetaMask; the demo sends a zero-value transaction that embeds the document hash.
- **Interactive UI** with drag-and-drop uploads, pagination controls, and instant validation feedback.

## How It Works
1. **Upload** a PDF (max 10 MB). The app renders a preview so you can confirm the correct file.
2. **Hash** generation happens in the browser using SHA-256; only the hash is used after this point.
3. **Blockchain commit**: MetaMask prompts you to sign a transaction that stores the hash. The default flow sends the transaction back to the same account purely for proof-of-existence.
4. **Verification**: The UI displays the document hash, timestamp, and transaction hash you can share for auditing.

## Tech Stack
- HTML5, CSS3, Vanilla JavaScript
- [PDF.js](https://mozilla.github.io/pdf.js/) for in-browser PDF rendering
- [Web3.js](https://web3js.readthedocs.io/) for Ethereum interaction
- Web Crypto API for hashing

## Prerequisites
- A modern desktop browser (Chrome, Edge, or Firefox recommended)
- [MetaMask](https://metamask.io/) browser extension with an unlocked wallet
- Access to an Ethereum network (Sepolia testnet recommended for experimentation)
- Optional: a simple HTTP server to avoid cross-origin restrictions when running locally

## Getting Started
```bash
# Clone the repository
git clone https://github.com/ayush-bhavsar/research-paper-validator-v3.git
cd research-paper-validator-v3

# Serve the project (choose your preferred static server)
# Option 1: Node.js
npx serve .
# Option 2: Python 3
python -m http.server 8080
```

Open the printed URL (for example, `http://localhost:8080`) in a browser where MetaMask is installed.

## Using the App
1. Click **Connect** in MetaMask and make sure the wallet is unlocked on the desired network (Sepolia or Mainnet).
2. Drag and drop a PDF into the upload zone or click to browse.
3. Review the preview pages using the next/previous controls.
4. Press **Validate Paper**.
5. Approve the transaction in MetaMask when prompted. The transaction sends zero ETH with the document hash encoded in the data field.
6. Wait for the confirmation banner showing the hash, status, and timestamp. You can inspect the transaction in a block explorer to verify the data.

### Example Walkthrough
To see what a successful run looks like, try the following sample scenario on the Sepolia testnet:

1. Download any public-domain PDF (for instance, an open-access research paper) and upload it to the validator.
2. After clicking **Validate Paper**, MetaMask will prompt you to confirm a transaction similar to:

```
To:          0xYourWalletAddress
Value:       0 ETH
Gas Limit:   21000
Data:        0x2f2c2e5f... (hex-encoded SHA-256 hash)
```

3. Once the transaction is mined, the UI will display details such as:

```
Document Hash:  8f1342af4f3c6eb6a6c43d14c1c4a7e52ac8a7b9d7f94e0e4a9dfe1bf4d3c119
Status:         Stored on Blockchain
Timestamp:      11/09/2025, 16:32:10
Tx Hash:        0x7c39af2d8f8f4b5d2a64db3a4ef9385b5dc1aabc2c1f8b0e8bb0f3d9e4a1f6c2
Network:        Sepolia Testnet
```

4. Paste the transaction hash into [https://sepolia.etherscan.io/](https://sepolia.etherscan.io/) to verify that the same hash appears in the transaction `input data` field. Anyone with this hash and timestamp can confirm the document’s existence without accessing its contents.

## Configuration Notes
- **Network selection:** Switch MetaMask to Sepolia (chain ID `0xaa36a7`) for testing to avoid real gas fees. The UI will work on any Ethereum-compatible network once MetaMask is connected.
- **Gas limits:** The demo sets a basic gas limit of `21000`, sufficient for a simple value transfer. If you upgrade the logic to interact with a smart contract, adjust gas estimates accordingly.
- **Smart contract integration:** To anchor hashes in a dedicated contract, replace the `storeHashOnBlockchain` function in `script.js` with contract interaction code using the ABI and deployed address.

## Privacy & Security
- The PDF never leaves the browser; only its SHA-256 hash is used.
- Sharing the transaction hash allows others to verify the timestamp and hash without exposing document contents.
- Always test new workflows on a testnet before moving to mainnet to avoid unintended costs.

## Roadmap Ideas
- Dedicated smart contract for storing hashes and metadata
- Multi-file batch validation
- REST API for server-side verification
- WalletConnect support for mobile wallets

## License
This project is provided under the MIT License. See [`LICENSE`](LICENSE) if available or adapt the licence to suit your needs.
