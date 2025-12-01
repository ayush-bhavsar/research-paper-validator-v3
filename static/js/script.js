let pdfDoc = null;
let pageNum = 1;
let web3;
let account;

document.getElementById('connectWallet').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
            document.getElementById('walletStatus').textContent = `Connected: ${account}`;
            console.log('Connected to MetaMask:', account);
        } catch (error) {
            console.error('MetaMask connection error:', error);
            alert('MetaMask connection failed: ' + error.message);
        }
    } else {
        alert('MetaMask not detected. Please install MetaMask extension.');
    }
});

const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');

uploadZone.addEventListener('click', () => fileInput.click());
uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length && files[0].type === 'application/pdf') {
        handleFile(files[0]);
    }
});
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) handleFile(e.target.files[0]);
});

function handleFile(file) {
    if (file.size > 10 * 1024 * 1024) {
        alert('File too large (max 10 MB)');
        return;
    }
    const fileReader = new FileReader();
    fileReader.onload = function() {
        const typedArray = new Uint8Array(this.result);
        pdfjsLib.getDocument(typedArray).promise.then((pdf) => {
            pdfDoc = pdf;
            renderPage(pageNum);
            document.getElementById('pdfViewer').style.display = 'block';
            document.getElementById('validateBtn').disabled = false;
        });
    };
    fileReader.readAsArrayBuffer(file);
}

function renderPage(num) {
    pdfDoc.getPage(num).then((page) => {
        const canvas = document.getElementById('pdfCanvas');
        const ctx = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        page.render({ canvasContext: ctx, viewport });
        document.getElementById('pageInfo').textContent = `Page ${num} of ${pdfDoc.numPages}`;
    });
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (pageNum > 1) {
        pageNum--;
        renderPage(pageNum);
    }
});
document.getElementById('nextPage').addEventListener('click', () => {
    if (pageNum < pdfDoc.numPages) {
        pageNum++;
        renderPage(pageNum);
    }
});

document.getElementById('validateBtn').addEventListener('click', async () => {
    if (!pdfDoc || !account) return;
    const hash = await generateHash();
    await signHashWithMetaMask(hash);
});

async function generateHash() {
    const pdfBytes = await pdfDoc.getData();
    const hashBuffer = await crypto.subtle.digest('SHA-256', pdfBytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function signHashWithMetaMask(hash) {
    try {
        // Ask MetaMask to sign the message (hash) with the connected account
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [ '0x' + hash, account ],
        });

        // Optional: recover the signer to show verification info
        const recovered = await web3.eth.personal.ecRecover('0x' + hash, signature);

        document.getElementById('docHash').textContent = hash;
        document.getElementById('status').textContent = 'Signed with MetaMask';
        document.getElementById('timestamp').textContent = new Date().toLocaleString();
        document.getElementById('signature').textContent = signature;
        document.getElementById('signer').textContent = recovered || account;
        document.getElementById('result').style.display = 'block';
    } catch (error) {
        alert('Signature failed: ' + (error && error.message ? error.message : error));
        console.error('Signature error:', error);
    }
}
