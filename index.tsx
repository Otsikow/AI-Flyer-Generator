import { GoogleGenAI, Modality } from "@google/genai";

// --- DOM ELEMENT VARIABLES (to be assigned in initialize) ---
let promptInput: HTMLTextAreaElement;
let companyNameInput: HTMLInputElement;
let contactDetailsInput: HTMLTextAreaElement;
let imageUploadArea: HTMLDivElement;
let logoUpload: HTMLInputElement;
let logoPreview: HTMLImageElement;
let uploadPlaceholder: HTMLDivElement;
let layoutOptions: NodeListOf<HTMLDivElement>;
let backgroundOptions: NodeListOf<HTMLElement>;
let fontOptions: NodeListOf<HTMLDivElement>;
let sizeOptions: NodeListOf<HTMLDivElement>;
let generateBtn: HTMLButtonElement;
let generateBtnSpan: HTMLSpanElement;
let savePrefsBtn: HTMLButtonElement;
let clearPrefsBtn: HTMLButtonElement;
let prefsFeedback: HTMLSpanElement;
let outputPlaceholder: HTMLDivElement;
let loader: HTMLDivElement;
let loaderText: HTMLParagraphElement;
let resultContainer: HTMLDivElement;
let flyerOutput: HTMLImageElement;
let downloadControls: HTMLDivElement;
let downloadBtn: HTMLAnchorElement;
let formatSelect: HTMLSelectElement;
let errorMessage: HTMLDivElement;

// --- STATE ---
let logoFile: File | null = null;
let loadedLogo: { data: string, type: string } | null = null;
let isGenerating = false;
let selectedLayout = 'balanced';
let selectedBackgroundType: 'none' | 'color' | 'image' = 'none';
let selectedBackgroundValue: string | null = null;
let selectedFont = 'sans-serif';
let selectedSize = 'a4-portrait';

const PREFERENCES_KEY = 'flyerGeneratorPrefs';


// --- GEMINI SETUP ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- HELPER FUNCTIONS ---
function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        // Return only the base64 part
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

function dataUrlToBase64(dataUrl: string): string {
    return dataUrl.split(',')[1];
}

/**
 * Converts an SVG data URL to a PNG base64 string.
 * This is necessary because the model does not support SVG as an input format.
 */
function svgDataUrlToPngBase64(svgDataUrl: string, width: number = 512, height: number = 512): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }
            ctx.drawImage(img, 0, 0, width, height);
            // Get PNG data URL and extract base64 part
            resolve(canvas.toDataURL('image/png').split(',')[1]);
        };
        img.onerror = (err) => reject(new Error(`Failed to load SVG image for conversion: ${err}`));
        img.src = svgDataUrl;
    });
}


function showPrefsFeedback(message: string) {
    prefsFeedback.textContent = message;
    prefsFeedback.classList.add('show');
    setTimeout(() => {
        prefsFeedback.classList.remove('show');
    }, 2000);
}

// --- UI UPDATE FUNCTIONS ---

function setGenerating(generating: boolean) {
    isGenerating = generating;
    generateBtn.disabled = generating;
    if (generating) {
        generateBtn.classList.add('loading');
        if (generateBtnSpan) generateBtnSpan.textContent = 'Generating...';
    } else {
        generateBtn.classList.remove('loading');
        if (generateBtnSpan) generateBtnSpan.textContent = 'Generate Flyer';
    }
}

function showLoading(message: string) {
    if (outputPlaceholder) outputPlaceholder.classList.add('hidden');
    if (resultContainer) resultContainer.classList.add('hidden');
    if (errorMessage) errorMessage.classList.add('hidden');
    if (loader) loader.classList.remove('hidden');
    if (loaderText) loaderText.textContent = message;
}

function showResult(imageDataUrl: string) {
    if (loader) loader.classList.add('hidden');
    if (flyerOutput) flyerOutput.src = imageDataUrl;
    if (resultContainer) resultContainer.classList.remove('hidden');
    if (downloadControls) downloadControls.classList.remove('hidden');
}

function showError(message: string) {
    if (loader) loader.classList.add('hidden');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
}

function updateLogoPreview(file: File) {
    logoFile = file;
    loadedLogo = null; // Clear loaded logo if a new file is uploaded
    const reader = new FileReader();
    reader.onload = (e) => {
        if (e.target?.result) {
            if (logoPreview) {
                logoPreview.src = e.target.result as string;
                logoPreview.classList.remove('hidden');
            }
            if (uploadPlaceholder) uploadPlaceholder.classList.add('hidden');
        }
    };
    reader.readAsDataURL(file);
}

// --- PREFERENCES FUNCTIONS ---

async function handleSavePrefs() {
    const prefs: any = {
        companyName: companyNameInput.value,
        contactDetails: contactDetailsInput.value,
        font: selectedFont,
        bgType: selectedBackgroundType,
        bgValue: selectedBackgroundValue,
        size: selectedSize,
    };

    const currentLogoSource = logoFile || loadedLogo;

    if (currentLogoSource) {
        if (logoFile) {
            prefs.logoData = await fileToBase64(logoFile);
            prefs.logoType = logoFile.type;
        } else if (loadedLogo) {
            prefs.logoData = loadedLogo.data;
            prefs.logoType = loadedLogo.type;
        }
    }
    
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    showPrefsFeedback('Saved!');
}

function handleLoadPrefs() {
    const prefsString = localStorage.getItem(PREFERENCES_KEY);
    if (!prefsString) return;

    const prefs = JSON.parse(prefsString);

    companyNameInput.value = prefs.companyName || '';
    contactDetailsInput.value = prefs.contactDetails || '';

    // Load Font
    if (prefs.font) {
        selectedFont = prefs.font;
        fontOptions.forEach(option => {
            const isSelected = option.getAttribute('data-font') === selectedFont;
            option.classList.toggle('selected', isSelected);
            option.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        });
    }

    // Load Size
    if (prefs.size) {
        selectedSize = prefs.size;
        sizeOptions.forEach(option => {
            const isSelected = option.getAttribute('data-size') === selectedSize;
            option.classList.toggle('selected', isSelected);
            option.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        });
    }
    
    // Load Background
    if (prefs.bgType && prefs.bgValue) {
        selectedBackgroundType = prefs.bgType;
        selectedBackgroundValue = prefs.bgValue;
        backgroundOptions.forEach(option => {
            const el = option as HTMLElement;
            const isSelected = el.dataset.bgType === selectedBackgroundType && (el.dataset.bgValue === selectedBackgroundValue || (el as HTMLImageElement).src === selectedBackgroundValue);
            el.classList.toggle('selected', isSelected);
            el.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        });
    }

    // Load Logo
    if (prefs.logoData && prefs.logoType) {
        loadedLogo = { data: prefs.logoData, type: prefs.logoType };
        logoFile = null;
        const logoDataUrl = `data:${loadedLogo.type};base64,${loadedLogo.data}`;
        logoPreview.src = logoDataUrl;
        logoPreview.classList.remove('hidden');
        uploadPlaceholder.classList.add('hidden');
    }
}

function handleClearPrefs() {
    localStorage.removeItem(PREFERENCES_KEY);
    showPrefsFeedback('Cleared!');
    // Optional: reset form to default state
    companyNameInput.value = '';
    contactDetailsInput.value = '';
    logoFile = null;
    loadedLogo = null;
    logoPreview.classList.add('hidden');
    logoPreview.src = '';
    uploadPlaceholder.classList.remove('hidden');
    // Consider resetting other options to default as well
}

// --- EVENT HANDLERS ---
function handleLogoSelection(files: FileList | null) {
    if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            updateLogoPreview(file);
        } else {
            alert('Please select an image file.');
        }
    }
}

function handleLayoutSelection(event: Event) {
    const target = event.currentTarget as HTMLDivElement;
    
    selectedLayout = target.dataset.layout || 'balanced';

    layoutOptions.forEach(option => {
        option.classList.remove('selected');
        option.setAttribute('aria-checked', 'false');
    });
    target.classList.add('selected');
    target.setAttribute('aria-checked', 'true');
}

function handleBackgroundSelection(event: Event) {
    const target = event.currentTarget as HTMLElement;
    
    selectedBackgroundType = (target.dataset.bgType as 'none' | 'color' | 'image') || 'none';
    selectedBackgroundValue = target.dataset.bgValue || (target as HTMLImageElement).src || null;

    backgroundOptions.forEach(option => {
        option.classList.remove('selected');
        option.setAttribute('aria-checked', 'false');
    });
    target.classList.add('selected');
    target.setAttribute('aria-checked', 'true');
}

function handleFontSelection(event: Event) {
    const target = event.currentTarget as HTMLDivElement;
    
    selectedFont = target.dataset.font || 'sans-serif';

    fontOptions.forEach(option => {
        option.classList.remove('selected');
        option.setAttribute('aria-checked', 'false');
    });
    target.classList.add('selected');
    target.setAttribute('aria-checked', 'true');
}

function handleSizeSelection(event: Event) {
    const target = event.currentTarget as HTMLDivElement;
    
    selectedSize = target.dataset.size || 'a4-portrait';

    sizeOptions.forEach(option => {
        option.classList.remove('selected');
        option.setAttribute('aria-checked', 'false');
    });
    target.classList.add('selected');
    target.setAttribute('aria-checked', 'true');
}

async function handleGenerateClick() {
    if (isGenerating) return;

    const prompt = promptInput?.value.trim();
    if (!prompt) {
        showError('Please enter a description for your flyer.');
        return;
    }

    let logoBase64: string | null = null;
    let logoMimeType: string | null = null;
    
    if (logoFile) {
        logoBase64 = await fileToBase64(logoFile);
        logoMimeType = logoFile.type;
    } else if (loadedLogo) {
        logoBase64 = loadedLogo.data;
        logoMimeType = loadedLogo.type;
    }

    if (!logoBase64 || !logoMimeType) {
        showError('Please upload a logo.');
        return;
    }

    setGenerating(true);
    showLoading('Warming up the design studio...');

    try {
        const parts: ({ text: string } | { inlineData: { data: string, mimeType: string } })[] = [];
        
        const companyName = companyNameInput?.value.trim();
        let companyNameInstruction = '';
        if (companyName) {
            companyNameInstruction = `The company name is "${companyName}". Make sure to feature it prominently where appropriate.`;
        }
        
        const contactDetails = contactDetailsInput?.value.trim();
        let contactDetailsInstruction = '';
        if (contactDetails) {
            contactDetailsInstruction = `Include the following contact details in the flyer, making them clear and easy to read: "${contactDetails}".`;
        }

        let layoutInstruction = '';
        switch (selectedLayout) {
            case 'text-focus':
                layoutInstruction = 'Arrange the content with a primary focus on the text, making it the most prominent element, with the logo and imagery being secondary.';
                break;
            case 'image-focus':
                layoutInstruction = 'Arrange the content to be image-heavy, where the visuals are the main focus. The text and logo should complement the imagery without dominating it.';
                break;
            case 'balanced':
            default:
                layoutInstruction = 'Arrange the content in a balanced layout, giving the logo, text, and imagery equal importance and visual weight.';
                break;
        }

        let backgroundInstruction = '';
        if (selectedBackgroundType === 'color' && selectedBackgroundValue) {
            backgroundInstruction = `Use a solid background color of ${selectedBackgroundValue}.`;
        } else if (selectedBackgroundType === 'image' && selectedBackgroundValue) {
            // FIX: Convert SVG to PNG as model doesn't support SVG
            showLoading('Preparing background image...');
            const bgPngBase64 = await svgDataUrlToPngBase64(selectedBackgroundValue);
            parts.push({
                inlineData: {
                    data: bgPngBase64,
                    mimeType: 'image/png', // Use the correct, converted MIME type
                },
            });
            backgroundInstruction = 'Use the first image provided as the main background for the flyer. The second image provided is the company logo.';
            showLoading('Warming up the design studio...'); // Reset loading message
        }

        let fontInstruction = '';
        switch (selectedFont) {
            case 'serif':
                fontInstruction = 'Use a classic and elegant Serif font style for the text.';
                break;
            case 'script':
                fontInstruction = 'Use a flowing and decorative Script font style for the text.';
                break;
            case 'modern':
                fontInstruction = 'Use a clean, geometric, and Modern font style for the text.';
                break;
            case 'classic':
                fontInstruction = 'Use a timeless and traditional Classic font style for the text.';
                break;
            case 'futuristic':
                fontInstruction = 'Use a sleek, minimalist, and Futuristic font style for the text.';
                break;
            case 'sans-serif':
            default:
                fontInstruction = 'Use a clean and highly readable Sans-serif font style for the text.';
                break;
        }

        let sizeInstruction = '';
        switch (selectedSize) {
            case 'us-letter':
                sizeInstruction = 'The flyer dimensions should be in a standard US Letter portrait aspect ratio (8.5:11).';
                break;
            case 'square-post':
                sizeInstruction = 'The flyer dimensions should be a perfect square (1:1 aspect ratio), suitable for social media posts.';
                break;
            case 'a4-portrait':
            default:
                sizeInstruction = 'The flyer dimensions should be in a standard A4 portrait aspect ratio.';
                break;
        }
        
        // Add logo
        parts.push({
            inlineData: {
                data: logoBase64,
                mimeType: logoMimeType,
            },
        });

        // Add prompt
        const fullPrompt = `Create a professional flyer designed for high-quality printing. The output must be a very high-resolution image, suitable for a 300 DPI print, ensuring all text is perfectly sharp and all graphics are crisp and clear without any pixelation. Based on this description: "${prompt}". ${companyNameInstruction} ${contactDetailsInstruction} Integrate the provided logo naturally and seamlessly into the design. ${layoutInstruction} ${backgroundInstruction} ${fontInstruction} ${sizeInstruction}`;
        parts.push({ text: fullPrompt });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: parts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        let foundImage = false;
        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType;
                    const imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
                    showResult(imageUrl);
                    foundImage = true;
                    break; 
                }
            }
        }
        
        if (!foundImage) {
             showError("The AI couldn't generate a flyer image. Try refining your prompt.");
        }

    } catch (error) {
        console.error(error);
        const errorMessageText = error instanceof Error ? error.message : JSON.stringify(error);
        showError(`Generation failed: ${errorMessageText}`);
    } finally {
        setGenerating(false);
    }
}

async function handleDownloadClick(event: MouseEvent) {
    event.preventDefault();

    if (!window.confirm('Are you sure you want to download this flyer?')) {
        return;
    }

    const format = formatSelect.value;
    const dataUrl = flyerOutput.src;
    const fileName = `flyer.${format}`;

    if (!dataUrl || !dataUrl.startsWith('data:image')) {
        showError("No flyer image to download.");
        return;
    }

    try {
        let finalDataUrl = dataUrl;

        // If JPG is selected, convert the PNG source to JPG
        if (format === 'jpg') {
            finalDataUrl = await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        return reject(new Error('Could not get canvas context'));
                    }
                    // Fill background with white. PNGs can have transparency, which becomes black in JPGs.
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    // Get JPG data URL with 90% quality
                    resolve(canvas.toDataURL('image/jpeg', 0.9));
                };
                img.onerror = () => reject(new Error('Failed to load image for conversion.'));
                img.src = dataUrl;
            });
        }

        // Convert the final data URL (either original PNG or new JPG) to a blob
        const response = await fetch(finalDataUrl);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        // Create a temporary link to trigger the download
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = fileName;
        
        // This is the key fix: ensure the link is part of the DOM and "visible"
        // for the click event to be reliably dispatched in all environments.
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        
        // Clean up the DOM
        document.body.removeChild(link);
        
        // Delay revoking the object URL to ensure the download has time to start
        setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
        
    } catch (error) {
        console.error("Download failed:", error);
        showError("Sorry, the download could not be completed.");
    }
}


// --- INITIALIZATION ---
function initialize() {
    // Assign all DOM elements
    promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
    companyNameInput = document.getElementById('company-name-input') as HTMLInputElement;
    contactDetailsInput = document.getElementById('contact-details-input') as HTMLTextAreaElement;
    imageUploadArea = document.getElementById('image-upload-area') as HTMLDivElement;
    logoUpload = document.getElementById('logo-upload') as HTMLInputElement;
    logoPreview = document.getElementById('logo-preview') as HTMLImageElement;
    uploadPlaceholder = document.getElementById('upload-placeholder') as HTMLDivElement;
    layoutOptions = document.querySelectorAll('.layout-option');
    backgroundOptions = document.querySelectorAll('.background-option');
    fontOptions = document.querySelectorAll('.font-option');
    sizeOptions = document.querySelectorAll('.size-option');
    generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
    savePrefsBtn = document.getElementById('save-prefs-btn') as HTMLButtonElement;
    clearPrefsBtn = document.getElementById('clear-prefs-btn') as HTMLButtonElement;
    prefsFeedback = document.getElementById('prefs-feedback') as HTMLSpanElement;
    outputPlaceholder = document.getElementById('output-placeholder') as HTMLDivElement;
    loader = document.getElementById('loader') as HTMLDivElement;
    loaderText = document.getElementById('loader-text') as HTMLParagraphElement;
    resultContainer = document.getElementById('result-container') as HTMLDivElement;
    flyerOutput = document.getElementById('flyer-output') as HTMLImageElement;
    downloadControls = document.querySelector('.download-controls') as HTMLDivElement;
    downloadBtn = document.getElementById('download-btn') as HTMLAnchorElement;
    formatSelect = document.getElementById('format-select') as HTMLSelectElement;
    errorMessage = document.getElementById('error-message') as HTMLDivElement;

    // Comprehensive check for critical elements
    const requiredElements = {
        promptInput, companyNameInput, contactDetailsInput, imageUploadArea, logoUpload,
        generateBtn, downloadBtn, savePrefsBtn, clearPrefsBtn, downloadControls, formatSelect,
        logoPreview, uploadPlaceholder, prefsFeedback, outputPlaceholder, loader, loaderText,
        resultContainer, flyerOutput, errorMessage
    };

    for (const [name, el] of Object.entries(requiredElements)) {
        if (!el) {
            console.error(`Initialization failed: Element "${name}" is missing from the DOM.`);
            document.body.innerHTML = `<p style="color: red; font-family: sans-serif; padding: 2rem;">Error: Application could not start. A required UI element (${name}) is missing.</p>`;
            return;
        }
    }
    
    // Now that we know generateBtn exists, we can safely query its inner elements.
    generateBtnSpan = generateBtn.querySelector('span') as HTMLSpanElement;
    if (!generateBtnSpan) {
        console.error("Initialization failed: The 'generate-btn' is missing its inner span element.");
        // We can let the app continue, but the button text won't update.
    }

    // Attach all event listeners
    imageUploadArea.addEventListener('click', () => logoUpload.click());
    logoUpload.addEventListener('change', () => handleLogoSelection(logoUpload.files));

    imageUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadArea.classList.add('drag-over');
    });
    imageUploadArea.addEventListener('dragleave', () => {
        imageUploadArea.classList.remove('drag-over');
    });
    imageUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadArea.classList.remove('drag-over');
        handleLogoSelection(e.dataTransfer?.files ?? null);
    });

    layoutOptions.forEach(option => {
        option.addEventListener('click', handleLayoutSelection);
    });
    
    backgroundOptions.forEach(option => {
        option.addEventListener('click', handleBackgroundSelection);
        option.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
                e.preventDefault();
                handleBackgroundSelection(e);
            }
        });
    });

    fontOptions.forEach(option => {
        option.addEventListener('click', handleFontSelection);
        option.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
                e.preventDefault();
                handleFontSelection(e);
            }
        });
    });

    sizeOptions.forEach(option => {
        option.addEventListener('click', handleSizeSelection);
        option.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
                e.preventDefault();
                handleSizeSelection(e);
            }
        });
    });


    generateBtn.addEventListener('click', handleGenerateClick);
    downloadBtn.addEventListener('click', handleDownloadClick);
    savePrefsBtn.addEventListener('click', handleSavePrefs);
    clearPrefsBtn.addEventListener('click', handleClearPrefs);
    
    handleLoadPrefs();
}

// Run initialization
initialize();

export {};