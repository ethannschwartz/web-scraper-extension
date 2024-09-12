let highlightedElements = [];
let currentSignature = '';

// Function to get a minimal representation of an element's tag and classes
function getElementSignature(element) {
    const tag = element.tagName.toLowerCase();
    const classes = Array.from(element.classList).sort().join('.');
    return `${tag}.${classes}`;
}

// Function to highlight elements with the same tag and class signature
function highlightElementsWithSignature(signature) {
    // Clear previously highlighted elements
    highlightedElements.forEach(el => el.classList.remove('highlight'));
    highlightedElements = []; // Reset the list of highlighted elements

    // Highlight new elements with the same tag and class signature
    document.querySelectorAll('*').forEach(el => {
        const elSignature = getElementSignature(el);
        if (elSignature === signature) {
            el.classList.add('highlight');
            highlightedElements.push(el);
        }
    });

    currentSignature = signature; // Update current signature
}

// Function to clear highlights
function clearHighlights() {
    highlightedElements.forEach(el => el.classList.remove('highlight'));
    highlightedElements = [];
    currentSignature = ''; // Reset current signature
}

// Function to get text content from highlighted elements and format as JSON
function extractTextContent() {
    return highlightedElements.map(el => {
        const text = el.innerText.trim().replace(/\s+/g, ' ');
        return text ? { value: text } : null;
    }).filter(item => item !== null);
}

// Function to copy text content to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    console.log('Copied to clipboard:', text);
}

// Event listener for mouseover to handle highlighting
document.addEventListener('mouseover', event => {
    const target = event.target;
    if (target) {
        const signature = getElementSignature(target);
        if (currentSignature !== signature) {
            highlightElementsWithSignature(signature);
        }
    }
});

// Event listener for mousemove to keep track of mouse movement over highlighted elements
document.addEventListener('mousemove', event => {
    const relatedTarget = event.relatedTarget;
    if (relatedTarget && !highlightedElements.some(el => el.contains(relatedTarget))) {
        clearHighlights();
    }
});

// Event listener for mouseout to handle clearing highlights
document.addEventListener('mouseout', event => {
    setTimeout(() => {
        if (!highlightedElements.some(el => el.contains(event.relatedTarget))) {
            clearHighlights();
        }
    }, 100);
});

// Event listener for mousedown to prevent navigation if clicking on highlighted elements
document.addEventListener('mousedown', event => {
    if (highlightedElements.includes(event.target)) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }
});

// Event listener for click to handle data extraction and copying
document.addEventListener('click', () => {
    if (highlightedElements.length > 0) {
        const extractedData = extractTextContent();
        if (extractedData.length > 0) {
            const jsonData = JSON.stringify(extractedData, null, 2);
            copyToClipboard(jsonData);
        }
    }
});
