import { GoogleGenAI, Modality } from "@google/genai";

// Since cropperjs is loaded from a CDN, we declare its type here to satisfy TypeScript
declare var Cropper: any;

// --- DOM ELEMENT VARIABLES (to be assigned in initialize) ---
let promptInput: HTMLTextAreaElement;
let companyNameInput: HTMLInputElement;
let contactDetailsInput: HTMLTextAreaElement;
let imageUploadArea: HTMLDivElement;
let logoUpload: HTMLInputElement;
let removeLogoBtn: HTMLButtonElement;
let logoPreview: HTMLImageElement;
let uploadPlaceholder: HTMLDivElement;
let logoCustomizationSection: HTMLDivElement;
let logoSizeOptions: NodeListOf<HTMLDivElement>;
let logoPositionOptions: NodeListOf<HTMLDivElement>;
let paletteOptions: NodeListOf<HTMLDivElement>;
let layoutOptions: NodeListOf<HTMLDivElement>;
let backgroundOptions: NodeListOf<HTMLElement>;
let fontOptions: NodeListOf<HTMLDivElement>;
let sizeOptions: NodeListOf<HTMLDivElement>;
let textEffectOptions: NodeListOf<HTMLDivElement>;
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
// Cropping modal elements
let cropModal: HTMLDivElement;
let imageToCrop: HTMLImageElement;
let applyCropBtn: HTMLButtonElement;
let cancelCropBtn: HTMLButtonElement;


// --- STATE ---
let logoDataUrl: string | null = null;
let cropper: any | null = null; // Cropper instance
let isGenerating = false;
let selectedPalette = 'default';
let selectedLayout = 'balanced';
let selectedBackgroundType: 'none' | 'color' | 'image' = 'none';
let selectedBackgroundValue: string | null = null;
let selectedFont = 'sans-serif';
let selectedSize = 'a4-portrait';
let selectedTextEffects = new Set<string>();
let selectedLogoSize = 'medium';
let selectedLogoPosition = 'top-right';

const PREFERENCES_KEY = 'flyerGeneratorPrefs';


// --- GEMINI SETUP ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- HELPER FUNCTIONS ---

/**
 * Converts an SVG data URL to a PNG base64 string.
 * This is necessary because the model does not support SVG as an input format for backgrounds.
 */
function svgDataUrlToPngBase64(svgDataUrl: string, width: number = 512, height: number = 512): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Enable cross-origin loading to prevent tainted canvas
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

// --- PREFERENCES FUNCTIONS ---

async function handleSavePrefs() {
    const prefs: any = {
        companyName: companyNameInput.value,
        contactDetails: contactDetailsInput.value,
        palette: selectedPalette,
        font: selectedFont,
        bgType: selectedBackgroundType,
        bgValue: selectedBackgroundValue,
        size: selectedSize,
        textEffects: Array.from(selectedTextEffects),
        logoSize: selectedLogoSize,
        logoPosition: selectedLogoPosition,
        logoDataUrl: logoDataUrl,
    };
    
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    showPrefsFeedback('Saved!');
}

function handleLoadPrefs() {
    const prefsString = localStorage.getItem(PREFERENCES_KEY);
    if (!prefsString) return;

    const prefs = JSON.parse(prefsString);

    companyNameInput.value = prefs.companyName || '';
    contactDetailsInput.value = prefs.contactDetails || '';

    // Load Palette
    if (prefs.palette) {
        selectedPalette = prefs.palette;
        paletteOptions.forEach(option => {
            const isSelected = option.getAttribute('data-palette-name') === selectedPalette;
            option.classList.toggle('selected', isSelected);
            option.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        });
    }

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

    // Load Text Effects
    if (prefs.textEffects && Array.isArray(prefs.textEffects)) {
        selectedTextEffects = new Set(prefs.textEffects);
        textEffectOptions.forEach(option => {
            const effect = option.dataset.effect;
            const isSelected = !!effect && selectedTextEffects.has(effect);
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

    // Load Logo Size
    if (prefs.logoSize) {
        selectedLogoSize = prefs.logoSize;
        logoSizeOptions.forEach(option => {
            const isSelected = option.getAttribute('data-size') === selectedLogoSize;
            option.classList.toggle('selected', isSelected);
            option.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        });
    }

    // Load Logo Position
    if (prefs.logoPosition) {
        selectedLogoPosition = prefs.logoPosition;
        logoPositionOptions.forEach(option => {
            const isSelected = option.getAttribute('data-position') === selectedLogoPosition;
            option.classList.toggle('selected', isSelected);
            option.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        });
    }

    // Load Logo
    if (prefs.logoDataUrl) {
        logoDataUrl = prefs.logoDataUrl;
        logoPreview.src = logoDataUrl;
        logoPreview.classList.remove('hidden');
        uploadPlaceholder.classList.add('hidden');
        removeLogoBtn.classList.remove('hidden');
        logoCustomizationSection.classList.remove('hidden');
    }
}

function handleClearPrefs() {
    localStorage.removeItem(PREFERENCES_KEY);
    showPrefsFeedback('Cleared!');
    // Optional: reset form to default state
    companyNameInput.value = '';
    contactDetailsInput.value = '';
    
    // Reset logo
    handleRemoveLogo();
    
    selectedTextEffects.clear();
    textEffectOptions.forEach(option => {
        option.classList.remove('selected');
        option.setAttribute('aria-checked', 'false');
    });

    // Reset palette
    selectedPalette = 'default';
    paletteOptions.forEach(option => {
        const isSelected = option.getAttribute('data-palette-name') === 'default';
        option.classList.toggle('selected', isSelected);
        option.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });

    // Reset logo size
    selectedLogoSize = 'medium';
    logoSizeOptions.forEach(option => {
        const isSelected = option.getAttribute('data-size') === 'medium';
        option.classList.toggle('selected', isSelected);
        option.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });

    // Reset logo position
    selectedLogoPosition = 'top-right';
    logoPositionOptions.forEach(option => {
        const isSelected = option.getAttribute('data-position') === 'top-right';
        option.classList.toggle('selected', isSelected);
        option.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
}

// --- EVENT HANDLERS ---
function handleLogoSelection(files: FileList | null) {
    if (files && files.length > 0) {
        const file = files[0];
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            imageToCrop.src = e.target?.result as string;
            cropModal.classList.remove('hidden');
            
            if (cropper) {
                cropper.destroy();
            }
            cropper = new Cropper(imageToCrop, {
                aspectRatio: NaN, // Free aspect ratio
                viewMode: 1,
                background: false,
                responsive: true,
                autoCropArea: 0.8,
            });
        };
        reader.readAsDataURL(file);
        logoUpload.value = ''; // Allows re-uploading the same file
    }
}

function handleApplyCrop() {
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas();
    if (!canvas) {
        showError("Could not process the cropped image.");
        return;
    }
    logoDataUrl = canvas.toDataURL('image/png');

    logoPreview.src = logoDataUrl;
    logoPreview.classList.remove('hidden');
    uploadPlaceholder.classList.add('hidden');
    removeLogoBtn.classList.remove('hidden');
    logoCustomizationSection.classList.remove('hidden');

    handleCancelCrop(); // Hide modal and destroy cropper instance
}

function handleCancelCrop() {
    cropModal.classList.add('hidden');
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
}

function handleRemoveLogo() {
    logoDataUrl = null;
    if (logoPreview) {
        logoPreview.src = '';
        logoPreview.classList.add('hidden');
    }
    if (uploadPlaceholder) uploadPlaceholder.classList.remove('hidden');
    if (removeLogoBtn) removeLogoBtn.classList.add('hidden');
    if (logoCustomizationSection) logoCustomizationSection.classList.add('hidden');
    if (logoUpload) logoUpload.value = '';
}

function handleLogoSizeSelection(event: Event) {
    const target = event.currentTarget as HTMLDivElement;
    selectedLogoSize = target.dataset.size || 'medium';

    logoSizeOptions.forEach(option => {
        option.classList.remove('selected');
        option.setAttribute('aria-checked', 'false');
    });
    target.classList.add('selected');
    target.setAttribute('aria-checked', 'true');
}

function handleLogoPositionSelection(event: Event) {
    const target = event.currentTarget as HTMLDivElement;
    selectedLogoPosition = target.dataset.position || 'top-right';

    logoPositionOptions.forEach(option => {
        option.classList.remove('selected');
        option.setAttribute('aria-checked', 'false');
    });
    target.classList.add('selected');
    target.setAttribute('aria-checked', 'true');
}

function handlePaletteSelection(event: Event) {
    const target = event.currentTarget as HTMLDivElement;
    
    selectedPalette = target.dataset.paletteName || 'default';

    paletteOptions.forEach(option => {
        option.classList.remove('selected');
        option.setAttribute('aria-checked', 'false');
    });
    target.classList.add('selected');
    target.setAttribute('aria-checked', 'true');
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

function handleTextEffectSelection(event: Event) {
    const target = event.currentTarget as HTMLDivElement;
    const effect = target.dataset.effect;
    if (!effect) return;

    target.classList.toggle('selected');
    const isSelected = target.classList.contains('selected');
    target.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    
    if (isSelected) {
        selectedTextEffects.add(effect);
    } else {
        selectedTextEffects.delete(effect);
    }
}

async function handleGenerateClick() {
    if (isGenerating) return;

    const prompt = promptInput?.value.trim();
    if (!prompt) {
        showError('Please enter a description for your flyer.');
        return;
    }

    if (!logoDataUrl) {
        showError('Please upload and apply a logo.');
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

        let paletteInstruction = '';
        if (selectedPalette && selectedPalette !== 'default') {
            const selectedOption = document.querySelector(`.palette-option[data-palette-name="${selectedPalette}"]`);
            const paletteColors = selectedOption?.getAttribute('data-palette-colors');
            if (paletteColors) {
                 paletteInstruction = `Use the following color palette named '${selectedPalette}' for the flyer's design: ${paletteColors}. This should influence the background, text, and graphical elements to create a cohesive theme.`;
            }
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
            backgroundInstruction = `Use a solid background color of ${selectedBackgroundValue}. If a color palette is also selected, this color should be considered a suggestion that can be overridden by the palette for better harmony.`;
        } else if (selectedBackgroundType === 'image' && selectedBackgroundValue) {
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
            case 'social-banner':
                sizeInstruction = 'The flyer dimensions should be in a landscape 16:9 aspect ratio, suitable for social media banners.';
                break;
            case 'a4-portrait':
            default:
                sizeInstruction = 'The flyer dimensions should be in a standard A4 portrait aspect ratio.';
                break;
        }
        
        let textEffectInstruction = '';
        if (selectedTextEffects.size > 0) {
            const effects = Array.from(selectedTextEffects).join(', ');
            textEffectInstruction = `Apply the following text effects where appropriate for emphasis: ${effects}.`;
        }

        let logoInstruction = `Integrate the provided logo naturally and seamlessly into the design.`;
        if (selectedLogoSize) {
            logoInstruction += ` The logo should be ${selectedLogoSize}-sized relative to the overall flyer design.`;
        }
        if (selectedLogoPosition) {
            const positionText = selectedLogoPosition.replace('-', ' ');
            logoInstruction += ` Place the logo in the ${positionText} area of the flyer.`;
        }

        // Add logo (always PNG after cropping)
        const logoBase64 = logoDataUrl.split(',')[1];
        parts.push({
            inlineData: {
                data: logoBase64,
                mimeType: 'image/png',
            },
        });

        // Add prompt
        const fullPrompt = `Create a professional flyer designed for high-quality printing. The output must be a very high-resolution image, suitable for a 300 DPI print, ensuring all text is perfectly sharp and all graphics are crisp and clear without any pixelation. Based on this description: "${prompt}". ${companyNameInstruction} ${contactDetailsInstruction} ${paletteInstruction} ${logoInstruction} ${layoutInstruction} ${backgroundInstruction} ${fontInstruction} ${textEffectInstruction} ${sizeInstruction}`;
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

    // Prevent multiple clicks if download is already in progress
    if (downloadBtn.classList.contains('disabled')) {
        return;
    }

    const format = formatSelect.value;
    const dataUrl = flyerOutput.src;
    const fileName = `flyer.${format}`;

    if (!dataUrl || !dataUrl.startsWith('data:image')) {
        showError("No flyer image to download.");
        return;
    }
    
    // Set downloading state
    const originalButtonText = downloadBtn.textContent;
    downloadBtn.textContent = 'Preparing...';
    downloadBtn.classList.add('disabled');

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
        
        // This is the key fix: ensure the link is part of the DOM
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
    } finally {
        // Reset button state
        downloadBtn.textContent = originalButtonText;
        downloadBtn.classList.remove('disabled');
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
    removeLogoBtn = document.getElementById('remove-logo-btn') as HTMLButtonElement;
    logoPreview = document.getElementById('logo-preview') as HTMLImageElement;
    uploadPlaceholder = document.getElementById('upload-placeholder') as HTMLDivElement;
    logoCustomizationSection = document.getElementById('logo-customization') as HTMLDivElement;
    logoSizeOptions = document.querySelectorAll('.logo-size-option');
    logoPositionOptions = document.querySelectorAll('.logo-position-option');
    paletteOptions = document.querySelectorAll('.palette-option');
    layoutOptions = document.querySelectorAll('.layout-option');
    backgroundOptions = document.querySelectorAll('.background-option');
    fontOptions = document.querySelectorAll('.font-option');
    sizeOptions = document.querySelectorAll('.size-option');
    textEffectOptions = document.querySelectorAll('.text-effect-option');
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
    cropModal = document.getElementById('crop-modal') as HTMLDivElement;
    imageToCrop = document.getElementById('image-to-crop') as HTMLImageElement;
    applyCropBtn = document.getElementById('apply-crop-btn') as HTMLButtonElement;
    cancelCropBtn = document.getElementById('cancel-crop-btn') as HTMLButtonElement;


    // Comprehensive check for critical elements
    const requiredElements = {
        promptInput, companyNameInput, contactDetailsInput, imageUploadArea, logoUpload,
        generateBtn, downloadBtn, savePrefsBtn, clearPrefsBtn, downloadControls, formatSelect,
        logoPreview, uploadPlaceholder, prefsFeedback, outputPlaceholder, loader, loaderText,
        resultContainer, flyerOutput, errorMessage, removeLogoBtn, logoCustomizationSection,
        cropModal, imageToCrop, applyCropBtn, cancelCropBtn
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
    imageUploadArea.addEventListener('click', (e) => {
        // Prevent click on logoUpload when remove button is clicked
        if (e.target !== removeLogoBtn) {
            logoUpload.click();
        }
    });
    logoUpload.addEventListener('change', () => handleLogoSelection(logoUpload.files));
    removeLogoBtn.addEventListener('click', handleRemoveLogo);

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

    applyCropBtn.addEventListener('click', handleApplyCrop);
    cancelCropBtn.addEventListener('click', handleCancelCrop);
    
    logoSizeOptions.forEach(option => {
        option.addEventListener('click', handleLogoSizeSelection);
        option.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
                e.preventDefault();
                handleLogoSizeSelection(e);
            }
        });
    });

    logoPositionOptions.forEach(option => {
        option.addEventListener('click', handleLogoPositionSelection);
        option.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
                e.preventDefault();
                handleLogoPositionSelection(e);
            }
        });
    });

    paletteOptions.forEach(option => {
        option.addEventListener('click', handlePaletteSelection);
        option.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
                e.preventDefault();
                handlePaletteSelection(e);
            }
        });
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

    textEffectOptions.forEach(option => {
        option.addEventListener('click', handleTextEffectSelection);
        option.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
                e.preventDefault();
                handleTextEffectSelection(e);
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