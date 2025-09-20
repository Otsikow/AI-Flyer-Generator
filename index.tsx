import { GoogleGenAI, Modality } from "@google/genai";

// Since cropperjs is loaded from a CDN, we declare its type here to satisfy TypeScript
declare var Cropper: any;

// --- DOM ELEMENT VARIABLES (to be assigned in initialize) ---
let descriptionHeader: HTMLHeadingElement;
let promptInput: HTMLTextAreaElement;
let enhancePromptBtn: HTMLButtonElement;
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
let clearPrefsBtn: HTMLButtonElement;
let outputPlaceholder: HTMLDivElement;
let loader: HTMLDivElement;
let loaderText: HTMLParagraphElement;
let resultContainer: HTMLDivElement;
let flyerOutput: HTMLImageElement;
let downloadControls: HTMLDivElement;
let downloadBtn: HTMLAnchorElement;
let formatSelect: HTMLSelectElement;
let errorMessage: HTMLDivElement;
let themeSwitcherBtn: HTMLButtonElement;
// Cropping modal elements
let cropModal: HTMLDivElement;
let imageToCrop: HTMLImageElement;
let applyCropBtn: HTMLButtonElement;
let cancelCropBtn: HTMLButtonElement;


// --- STATE ---
let logoDataUrl: string | null = null;
let cropper: any | null = null; // Cropper instance
let isGenerating = false;
let isEnhancing = false;
let loadingInterval: number | null = null; // For cycling loading messages
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
const THEME_KEY = 'flyergen-theme';


// --- GEMINI SETUP ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- HELPER FUNCTIONS ---

const loadingMessages = [
    'Warming up the AI design engine...',
    'Sketching initial concepts...',
    'Mixing the perfect color palette...',
    'Choosing a stunning font pairing...',
    'Arranging the layout for impact...',
    'Adding the final creative touches...',
    'Polishing the design to perfection...'
];

/**
 * Creates a debounced function that delays invoking the provided function
 * until after `waitFor` milliseconds have elapsed since the last time
 * the debounced function was invoked. The debounced function also has a
 * `cancel` method to cancel delayed `func` invocations.
 */
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
    let timeout: number | null = null;

    const debounced = (...args: Parameters<F>) => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = window.setTimeout(() => func(...args), waitFor);
    };

    debounced.cancel = () => {
        if (timeout !== null) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    return debounced;
}

/**
 * Hides the main loader and stops any message cycling.
 */
function hideLoading() {
    if (loader) loader.classList.add('hidden');
    if (loadingInterval) {
        clearInterval(loadingInterval);
        loadingInterval = null;
    }
}

// --- UI UPDATE FUNCTIONS ---

/**
 * Updates context-sensitive UI text based on the selected design size.
 * @param size The currently selected size (e.g., 'logo', 'social-banner').
 */
function updateDynamicText(size: string) {
    let designType = 'Flyer';
    let placeholder = 'e.g., A modern tech conference flyer with a blue and white color scheme...';
    if (size === 'logo') {
        designType = 'Logo';
        placeholder = 'e.g., A minimalist logo for a coffee shop, featuring a stylized coffee bean...';
    } else if (size === 'social-banner') {
        designType = 'Banner';
        placeholder = 'e.g., A vibrant banner for a summer sale social media campaign...';
    }

    // Update button text
    if (generateBtnSpan) {
        generateBtnSpan.textContent = `Generate ${designType}`;
    }

    // Update placeholder text in the prompt input
    if (promptInput) {
        promptInput.placeholder = placeholder;
    }

    // Update the section title
    if (descriptionHeader) {
        descriptionHeader.textContent = `1. Describe Your ${designType}`;
    }

    // Update output placeholder
    const outputPlaceholderHeader = outputPlaceholder?.querySelector('h3');
    const outputPlaceholderPara = outputPlaceholder?.querySelector('p');
    if (outputPlaceholderHeader && outputPlaceholderPara) {
        outputPlaceholderHeader.textContent = `Your ${designType.toLowerCase()} will appear here`;
        outputPlaceholderPara.textContent = `Fill out the details on the left and click "Generate ${designType}" to get started.`;
    }
}


function setGenerating(generating: boolean) {
    isGenerating = generating;
    generateBtn.disabled = generating;
    if (generating) {
        generateBtn.classList.add('loading');
        if (generateBtnSpan) generateBtnSpan.textContent = 'Generating...';
    } else {
        generateBtn.classList.remove('loading');
        // Restore the correct, context-aware text
        updateDynamicText(selectedSize);
    }
}

function showLoading(message: string, cycleMessages = false) {
    if (outputPlaceholder) outputPlaceholder.classList.add('hidden');
    if (resultContainer) resultContainer.classList.add('hidden');
    if (errorMessage) errorMessage.classList.add('hidden');
    if (loader) loader.classList.remove('hidden');

    // Stop any existing interval
    if (loadingInterval) {
        clearInterval(loadingInterval);
        loadingInterval = null;
    }

    if (loaderText) loaderText.textContent = message;

    if (cycleMessages) {
        let messageIndex = 0;

        // Immediately set the first message from the array
        if (loaderText) loaderText.textContent = loadingMessages[messageIndex];
        messageIndex = (messageIndex + 1) % loadingMessages.length;

        loadingInterval = window.setInterval(() => {
            if (loaderText) {
                loaderText.textContent = loadingMessages[messageIndex];
            }
            messageIndex = (messageIndex + 1) % loadingMessages.length;
        }, 2200);
    }
}

function showResult(imageDataUrl: string) {
    hideLoading();
    if (flyerOutput) flyerOutput.src = imageDataUrl;
    if (resultContainer) resultContainer.classList.remove('hidden');
    if (downloadControls) downloadControls.classList.remove('hidden');
}

function showError(message: string) {
    hideLoading();
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
}

// --- THEME FUNCTIONS ---
function applyTheme(theme: 'light' | 'dark') {
    document.body.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(systemPrefersDark ? 'dark' : 'light');
    }
}

// --- PREFERENCES FUNCTIONS ---

function savePrefs() {
    const prefs: any = {
        prompt: promptInput.value,
        companyName: companyNameInput.value,
        contactDetails: contactDetailsInput.value,
        palette: selectedPalette,
        layout: selectedLayout,
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
}

// Create a debounced version of savePrefs for efficient auto-saving.
const debouncedSavePrefs = debounce(savePrefs, 500);

function handleLoadPrefs() {
    const prefsString = localStorage.getItem(PREFERENCES_KEY);
    if (!prefsString) {
        // Even if no prefs, update text for default state
        updateDynamicText(selectedSize);
        return;
    };

    const prefs = JSON.parse(prefsString);

    promptInput.value = prefs.prompt || '';
    // After loading, check if the enhance button should be enabled
    enhancePromptBtn.disabled = !promptInput.value.trim();

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
    
    // Load Layout
    if (prefs.layout) {
        selectedLayout = prefs.layout;
        layoutOptions.forEach(option => {
            const isSelected = option.getAttribute('data-layout') === selectedLayout;
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
            let isMatch = false;

            if (el.dataset.bgType === prefs.bgType) {
                 if (prefs.bgType === 'color' || prefs.bgType === 'none') {
                    isMatch = el.dataset.bgValue === prefs.bgValue;
                }
            }

            el.classList.toggle('selected', isMatch);
            el.setAttribute('aria-checked', isMatch ? 'true' : 'false');
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

    // Update all dynamic text fields based on loaded preferences
    updateDynamicText(selectedSize);
}

function handleClearPrefs() {
    // Cancel any pending auto-save before clearing
    debouncedSavePrefs.cancel();
    localStorage.removeItem(PREFERENCES_KEY);
    
    // --- Reset all state variables to default ---
    logoDataUrl = null;
    selectedPalette = 'default';
    selectedLayout = 'balanced';
    selectedBackgroundType = 'none';
    selectedBackgroundValue = null;
    selectedFont = 'sans-serif';
    selectedSize = 'a4-portrait';
    selectedTextEffects.clear();
    selectedLogoSize = 'medium';
    selectedLogoPosition = 'top-right';

    // --- Reset the UI to reflect the default state ---
    promptInput.value = '';
    enhancePromptBtn.disabled = true;
    companyNameInput.value = '';
    contactDetailsInput.value = '';
    
    // Reset logo UI
    logoPreview.src = '';
    logoPreview.classList.add('hidden');
    uploadPlaceholder.classList.remove('hidden');
    removeLogoBtn.classList.add('hidden');
    logoCustomizationSection.classList.add('hidden');
    logoUpload.value = '';

    // Reset all selectable options
    [
        paletteOptions, layoutOptions, backgroundOptions,
        fontOptions, sizeOptions, textEffectOptions,
        logoSizeOptions, logoPositionOptions
    ].forEach(options => {
        options.forEach(option => {
            const el = option as HTMLElement;
            let isDefault = false;
            // Check based on the option type what the default is
            if (el.matches('.palette-option')) isDefault = el.dataset.paletteName === 'default';
            if (el.matches('.layout-option')) isDefault = el.dataset.layout === 'balanced';
            if (el.matches('.background-option')) isDefault = el.dataset.bgType === 'none';
            if (el.matches('.font-option')) isDefault = el.dataset.font === 'sans-serif';
            if (el.matches('.size-option')) isDefault = el.dataset.size === 'a4-portrait';
            if (el.matches('.logo-size-option')) isDefault = el.dataset.size === 'medium';
            if (el.matches('.logo-position-option')) isDefault = el.dataset.position === 'top-right';
            
            el.classList.toggle('selected', isDefault);
            el.setAttribute('aria-checked', isDefault ? 'true' : 'false');

            if(el.matches('.text-effect-option')) {
                el.classList.remove('selected');
                el.setAttribute('aria-checked', 'false');
            }
        });
    });

    // Update all dynamic text fields to reflect the default state
    updateDynamicText(selectedSize);
}

// --- EVENT HANDLERS ---
async function handleEnhancePromptClick() {
    if (isEnhancing || !promptInput.value.trim()) return;

    isEnhancing = true;
    enhancePromptBtn.disabled = true;
    enhancePromptBtn.classList.add('loading');
    
    const currentText = promptInput.value.trim();
    const enhancePrompt = `Enhance and expand upon this flyer description to make it more creative, evocative, and detailed for an AI image generator. Return only the enhanced description text, without any introductory phrases like "Here's the enhanced description:":\n\n"${currentText}"`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: enhancePrompt,
        });
        
        const newText = response.text.trim();
        if (newText) {
            promptInput.value = newText;
            debouncedSavePrefs(); // Auto-save the new description
        } else {
            // Use existing error display to show a message if response is empty
            showError("The AI couldn't enhance the description. Please try again.");
        }
    } catch (error) {
        parseAndShowError(error);
    } finally {
        isEnhancing = false;
        enhancePromptBtn.classList.remove('loading');
        // Re-enable button only if there's still text
        enhancePromptBtn.disabled = !promptInput.value.trim();
    }
}

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
    debouncedSavePrefs();
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
    debouncedSavePrefs();
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
    debouncedSavePrefs();
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
    debouncedSavePrefs();
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
    debouncedSavePrefs();
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
    debouncedSavePrefs();
}

function handleBackgroundSelection(event: Event) {
    const target = event.currentTarget as HTMLElement;

    selectedBackgroundType = (target.dataset.bgType as 'none' | 'color' | 'image') || 'none';
    selectedBackgroundValue = target.dataset.bgValue || null;

    backgroundOptions.forEach(option => {
        option.classList.remove('selected');
        option.setAttribute('aria-checked', 'false');
    });
    target.classList.add('selected');
    target.setAttribute('aria-checked', 'true');
    debouncedSavePrefs();
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
    debouncedSavePrefs();
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

    updateDynamicText(selectedSize);
    debouncedSavePrefs();
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
    debouncedSavePrefs();
}

/**
 * Parses an error from the AI API and displays a user-friendly message.
 */
function parseAndShowError(error: unknown) {
    console.error("Design Generation Error:", error);

    let userMessage = "An unexpected error occurred. Please check the console for details and try again.";

    // Convert the error to a string to check for keywords
    if (error instanceof Error) {
        const errorString = error.message.toLowerCase();

        if (errorString.includes('api key')) {
            userMessage = "Operation failed due to an API key issue. Please ensure the key is valid and configured correctly.";
        } else if (errorString.includes('permission denied')) {
             userMessage = "Operation failed due to a permission issue. Please check your API key permissions.";
        } else if (errorString.includes('blocked')) {
            userMessage = "Your request was blocked due to safety policies. Please adjust your text and try again.";
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
        showError('Please enter a description for your design.');
        return;
    }
    
    const isLogoRequest = selectedSize === 'logo';

    // A logo is required for flyers, but not when generating a logo.
    if (!isLogoRequest && !logoDataUrl) {
        showError('Please upload and apply a logo to generate a flyer.');
        return;
    }

    setGenerating(true);
    showLoading('Warming up the design studio...', true);

    try {
        const parts: ({ text: string } | { inlineData: { data: string, mimeType: string } })[] = [];
        
        // --- Build individual instructions ---
        
        const companyName = companyNameInput?.value.trim();
        const contactDetails = contactDetailsInput?.value.trim();

        let paletteInstruction = `Use an appropriate color palette based on the concept.`;
        if (selectedPalette && selectedPalette !== 'default') {
            const selectedOption = document.querySelector(`.palette-option[data-palette-name="${selectedPalette}"]`);
            const paletteColors = selectedOption?.getAttribute('data-palette-colors');
            if (paletteColors) {
                 paletteInstruction = `Strictly use the color palette named '${selectedPalette}' with these colors: ${paletteColors}. Apply it to all elements for a cohesive theme.`;
            }
        }

        let fontInstruction = '';
        switch (selectedFont) {
            case 'serif': fontInstruction = 'a classic and elegant Serif font style.'; break;
            case 'script': fontInstruction = 'a flowing and decorative Script font style.'; break;
            case 'modern': fontInstruction = 'a clean, geometric, and Modern font style.'; break;
            case 'classic': fontInstruction = 'a timeless and traditional Classic font style.'; break;
            case 'futuristic': fontInstruction = 'a sleek, minimalist, and Futuristic font style.'; break;
            case 'sans-serif': default: fontInstruction = 'a clean and highly readable Sans-serif font style.'; break;
        }

        let sizeInstruction = '';
        switch (selectedSize) {
            case 'us-letter': sizeInstruction = 'US Letter portrait aspect ratio (8.5:11).'; break;
            case 'us-letter-landscape': sizeInstruction = 'US Letter landscape aspect ratio (11:8.5).'; break;
            case 'square-post': sizeInstruction = 'perfect square aspect ratio (1:1).'; break;
            case 'social-banner': sizeInstruction = 'landscape 16:9 aspect ratio.'; break;
            case 'a4-landscape': sizeInstruction = 'standard A4 landscape aspect ratio.'; break;
            case 'logo': sizeInstruction = 'perfect square aspect ratio (1:1), designed as a high-resolution logo.'; break;
            case 'a4-portrait': default: sizeInstruction = 'standard A4 portrait aspect ratio.'; break;
        }
        
        let textEffectInstruction = 'None';
        if (selectedTextEffects.size > 0) {
            textEffectInstruction = Array.from(selectedTextEffects).join(', ');
        }
        
        // --- Assemble the final, structured prompt ---
        let fullPrompt = '';

        if (isLogoRequest) {
            const textContent = companyName ? `- **Primary Text/Company Name:** "${companyName}" (This must be the central text, rendered accurately).` : '';
            fullPrompt = `
# INSTRUCTION: CREATE A PROFESSIONAL LOGO

## Primary Goal
Generate a professional, visually appealing logo. The final image must be exceptionally sharp with crisp graphics. The design should be clean, memorable, and suitable for branding.

## Core Logo Concept
Based on this user description: "${prompt}"

## Text to Include
${textContent}

## Design Specifications
- **Color Palette:** ${paletteInstruction}
- **Typography:** Use ${fontInstruction} and these effects if they fit the design: ${textEffectInstruction}.
- **Style:** The overall layout style should be "${selectedLayout}".
- **Dimensions:** The final image must have a ${sizeInstruction}.
- **Background:** The background should be clean and simple (e.g., solid white, transparent, or a very subtle gradient) to ensure the logo is the main focus.
`;
        } else {
            // This is a flyer request, use the detailed flyer prompt
            let layoutInstruction = '';
            switch (selectedLayout) {
                case 'text-focus': layoutInstruction = 'A text-focused layout where typography is the dominant visual element.'; break;
                case 'image-focus': layoutInstruction = 'An image-focused layout where visuals are central. Text should complement the imagery.'; break;
                case 'balanced': default: layoutInstruction = 'A balanced layout, giving equal visual weight to the logo, text, and any imagery.'; break;
            }

            let backgroundInstruction = `Use a background that complements the overall design. A transparent background is acceptable if no specific background is requested.`;
            if (selectedBackgroundType === 'color' && selectedBackgroundValue) {
                backgroundInstruction = `Use a solid background color of ${selectedBackgroundValue}. If a palette is selected, this color may be adjusted to fit the palette.`;
            }
            
            let logoInstruction = `Integrate the provided logo naturally.`;
            if (selectedLogoSize) { logoInstruction += ` The logo's size should be ${selectedLogoSize} relative to the flyer.`; }
            if (selectedLogoPosition) {
                const positionText = selectedLogoPosition.replace('-', ' ');
                logoInstruction += ` Place it in the ${positionText} area.`;
            }
            
            const textElements = [];
            if (companyName) { textElements.push(`- **Company Name:** "${companyName}" (This must be rendered exactly as written and featured prominently).`); }
            if (contactDetails) { textElements.push(`- **Contact Details:** "${contactDetails}" (This must be rendered exactly as written and be perfectly legible).`); }
            const textContentInstruction = textElements.length > 0
                ? `## Text Content to Include\n**Crucial:** Render all text below with 100% accuracy—no extra words, no misspellings. The text must be sharp and easy to read.\n${textElements.join('\n')}`
                : '';

            fullPrompt = `
# INSTRUCTION: CREATE A HIGH-QUALITY PRINT FLYER

## Primary Goal
Generate a professional, visually appealing flyer suitable for high-quality printing (300 DPI). The final image must be exceptionally sharp, with crisp graphics and perfectly legible, accurately rendered text.

## Core Flyer Concept
Based on this user description: "${prompt}"
${textContentInstruction}

## Design Specifications
- **Layout:** ${layoutInstruction}
- **Color Palette:** ${paletteInstruction}
- **Background:** ${backgroundInstruction}
- **Typography:** Use ${fontInstruction} Apply these effects where appropriate for emphasis: ${textEffectInstruction}.
- **Dimensions:** The final image must have a ${sizeInstruction}
- **Logo Integration:** ${logoInstruction}
`;
        }
        
        // Add uploaded logo for flyer requests, but not for logo generation requests.
        if (!isLogoRequest && logoDataUrl) {
            const logoBase64 = logoDataUrl.split(',')[1];
            parts.push({
                inlineData: {
                    data: logoBase64,
                    mimeType: 'image/png',
                },
            });
        }

        // Add prompt
        parts.push({ text: fullPrompt.trim() });

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
             showError("The AI couldn't generate an image. Try refining your prompt.");
        }

    } catch (error) {
        parseAndShowError(error);
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
    
    // Determine the type of design for the filename
    const designType = selectedSize === 'logo' ? 'logo' : selectedSize.includes('banner') ? 'banner' : 'flyer';
    const fileName = `${designType}-design.${format}`;

    if (!dataUrl || !dataUrl.startsWith('data:image')) {
        showError("No image to download.");
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
    descriptionHeader = document.getElementById('description-header') as HTMLHeadingElement;
    promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
    enhancePromptBtn = document.getElementById('enhance-prompt-btn') as HTMLButtonElement;
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
    clearPrefsBtn = document.getElementById('clear-prefs-btn') as HTMLButtonElement;
    outputPlaceholder = document.getElementById('output-placeholder') as HTMLDivElement;
    loader = document.getElementById('loader') as HTMLDivElement;
    loaderText = document.getElementById('loader-text') as HTMLParagraphElement;
    resultContainer = document.getElementById('result-container') as HTMLDivElement;
    flyerOutput = document.getElementById('flyer-output') as HTMLImageElement;
    downloadControls = document.querySelector('.download-controls') as HTMLDivElement;
    downloadBtn = document.getElementById('download-btn') as HTMLAnchorElement;
    formatSelect = document.getElementById('format-select') as HTMLSelectElement;
    errorMessage = document.getElementById('error-message') as HTMLDivElement;
    themeSwitcherBtn = document.getElementById('theme-switcher') as HTMLButtonElement;
    cropModal = document.getElementById('crop-modal') as HTMLDivElement;
    imageToCrop = document.getElementById('image-to-crop') as HTMLImageElement;
    applyCropBtn = document.getElementById('apply-crop-btn') as HTMLButtonElement;
    cancelCropBtn = document.getElementById('cancel-crop-btn') as HTMLButtonElement;


    // Comprehensive check for critical elements
    const requiredElements = {
        descriptionHeader, promptInput, enhancePromptBtn, companyNameInput, contactDetailsInput, imageUploadArea, logoUpload,
        generateBtn, downloadBtn, clearPrefsBtn, downloadControls, formatSelect,
        logoPreview, uploadPlaceholder, outputPlaceholder, loader, loaderText,
        resultContainer, flyerOutput, errorMessage, removeLogoBtn, logoCustomizationSection,
        themeSwitcherBtn, cropModal, imageToCrop, applyCropBtn, cancelCropBtn
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
    themeSwitcherBtn.addEventListener('click', toggleTheme);
    enhancePromptBtn.addEventListener('click', handleEnhancePromptClick);

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

    // Add listeners for auto-saving text inputs
    promptInput.addEventListener('input', () => {
        enhancePromptBtn.disabled = !promptInput.value.trim();
        debouncedSavePrefs();
    });
    companyNameInput.addEventListener('input', debouncedSavePrefs);
    contactDetailsInput.addEventListener('input', debouncedSavePrefs);

    generateBtn.addEventListener('click', handleGenerateClick);
    downloadBtn.addEventListener('click', handleDownloadClick);
    clearPrefsBtn.addEventListener('click', handleClearPrefs);
    
    loadTheme();
    handleLoadPrefs();
}

// Run initialization
initialize();

export {};