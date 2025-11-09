// script.js - Research Paper Validator Logic

// Global variables
let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let selectedFile = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    checkWeb3Connection();
});

// Initialize event listeners
function initializeEventListeners() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('paperFile');
    const removeFileBtn = document.getElementById('removeFile');
    const uploadForm = document.getElementById('uploadForm');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');

    // File drop and selection events
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleFileDrop);
    fileInput.addEventListener('change', handleFileSelect);

    // File removal
    removeFileBtn.addEventListener('click', removeFile);

    // Form submission
    uploadForm.addEventListener('submit', handleFormSubmit);

    // PDF navigation
    prevPageBtn.addEventListener('click', () => changePage(-1));
    nextPageBtn.addEventListener('click', () => changePage(1));
}

// Handle drag over event
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

// Handle file drop
function handleFileDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

// Handle file selection
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// Handle file processing
function handleFile(file) {
    if (!file.type.includes('pdf')) {
        showError('Please select a valid PDF file.');
        return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showError('File size must be less than 10MB.');
        return;
    }

    selectedFile = file;
    displayFileInfo(file);
    loadPDF(file);
}

// Display file information
function displayFileInfo(file) {
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.querySelector('.file-name');
    const fileSize = document.querySelector('.file-size');

    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.style.display = 'block';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Remove selected file
function removeFile() {
    selectedFile = null;
    pdfDoc = null;
    currentPage = 1;
    totalPages = 0;

    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('pdfPreview').style.display = 'none';
    document.getElementById('paperFile').value = '';
    document.getElementById('results').style.display = 'none';
}

// Load PDF for preview
function loadPDF(file) {
    const fileReader = new FileReader();

    fileReader.onload = function() {
        const typedArray = new Uint8Array(this.result);

        pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
            pdfDoc = pdf;
            totalPages = pdf.numPages;
            document.getElementById('pageCount').textContent = totalPages;
            document.getElementById('pdfPreview').style.display = 'block';
            renderPage(currentPage);
        }).catch(function(error) {
            console.error('Error loading PDF:', error);
            showError('Error loading PDF file.');
        });
    };

    fileReader.readAsArrayBuffer(file);
}

// Render PDF page
function renderPage(pageNum) {
    pdfDoc.getPage(pageNum).then(function(page) {
        const canvas = document.getElementById('pdfCanvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        page.render(renderContext).promise.then(function() {
            document.getElementById('currentPage').textContent = pageNum;
            updateNavigationButtons();
        });
    });
}

// Change page
function changePage(delta) {
    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderPage(currentPage);
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    if (!selectedFile) {
        showError('Please select a PDF file first.');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    try {
        // Generate hash from file
        const hash = await generateFileHash(selectedFile);

        // Store on blockchain
        await storeHashOnBlockchain(hash);

        // Show results
        displayResults(hash);

    } catch (error) {
        console.error('Error processing file:', error);
        showError('Error processing file. Please try again.');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Generate SHA-256 hash from file
async function generateFileHash(file) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Check Web3 connection
async function checkWeb3Connection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Web3 connected');
        } catch (error) {
            console.error('User denied account access');
        }
    } else {
        console.warn('Web3 not detected. Please install MetaMask.');
    }
}

// Store hash on blockchain
async function storeHashOnBlockchain(hash) {
    if (typeof window.ethereum === 'undefined') {
        throw new Error('Web3 not available. Please install MetaMask.');
    }

    try {
        const web3 = new Web3(window.ethereum);

        // Get current account
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        if (!account) {
            throw new Error('No account connected. Please connect your wallet.');
        }

        // For demonstration, we'll send a transaction with the hash as data
        // In a real application, you'd interact with a smart contract
        const transaction = {
            from: account,
            to: account, // Sending to self for demo
            value: '0',
            data: web3.utils.asciiToHex(hash),
            gas: 21000
        };

        const txHash = await web3.eth.sendTransaction(transaction);
        console.log('Transaction hash:', txHash.transactionHash);

        return txHash.transactionHash;

    } catch (error) {
        console.error('Blockchain transaction failed:', error);
        throw new Error('Failed to store hash on blockchain: ' + error.message);
    }
}

// Display validation results
function displayResults(hash) {
    const resultsSection = document.getElementById('results');
    const resultContent = document.getElementById('resultContent');

    resultContent.innerHTML = `
        <div class="success">
            <h3>✓ Research Paper Validated Successfully!</h3>
            <p><strong>Document Hash:</strong> ${hash}</p>
            <p><strong>Status:</strong> Stored on Blockchain</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p class="text-small">This hash uniquely identifies your research paper and can be used to verify its authenticity and integrity.</p>
        </div>
    `;

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Show error message
function showError(message) {
    const resultContent = document.getElementById('resultContent');
    const resultsSection = document.getElementById('results');

    resultContent.innerHTML = `
        <div class="error">
            <h3>✗ Validation Failed</h3>
            <p>${message}</p>
        </div>
    `;

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}