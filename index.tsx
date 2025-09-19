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

/**
 * Parses an error from the AI API and displays a user-friendly message.
 */
function parseAndShowError(error: unknown) {
    console.error("Flyer Generation Error:", error);

    let userMessage = "An unexpected error occurred during generation. Please check the console for details and try again.";

    // Convert the error to a string to check for keywords
    if (error instanceof Error) {
        const errorString = error.message.toLowerCase();

        if (errorString.includes('api key')) {
            userMessage = "Generation failed due to an API key issue. Please ensure the key is valid and configured correctly.";
        } else if (errorString.includes('permission denied')) {
             userMessage = "Generation failed due to a permission issue. Please check your API key permissions.";
        } else if (errorString.includes('blocked')) {
            userMessage = "Your request was blocked due to safety policies. Please adjust your prompt text and try again.";
        } else if (errorString.includes('quota')) {
            userMessage = "You have exceeded your API quota. Please check your account usage and limits.";
        } else if (errorString.includes('500') || errorString.includes('503') || errorString.includes('service unavailable')) {
            userMessage = "The AI service is currently unavailable or experiencing issues. Please try again later.";
        }
    }
    
    showError(userMessage);
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
                sizeInstruction = 'The flyer dimensions should be a perfect square (1:1 aspect