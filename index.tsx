import { GoogleGenAI, Modality } from "@google/genai";

// Since cropperjs is loaded from a CDN, we declare its type here to satisfy TypeScript
declare var Cropper: any;

// Add SpeechRecognition types to the global window object for cross-browser compatibility
interface IWindow extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}
declare const window: IWindow;


// --- DOM ELEMENT VARIABLES (to be assigned in initialize) ---

// -- App Shell --
let themeSwitcherBtn: HTMLButtonElement;
let tabDesignGenerator: HTMLButtonElement;
let tabImageStudio: HTMLButtonElement;
let designGeneratorPage: HTMLDivElement;
let imageStudioPage: HTMLDivElement;

// -- Design Generator --
let descriptionHeader: HTMLHeadingElement;
let promptInput: HTMLTextAreaElement;
let micDesignBtn: HTMLButtonElement;
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

// -- Cropping modal elements --
let cropModal: HTMLDivElement;
let imageToCrop: HTMLImageElement;
let applyCropBtn: HTMLButtonElement;
let cancelCropBtn: HTMLButtonElement;

// -- Image Studio --
let studioTabEdit: HTMLButtonElement;
let studioTabGenerate: HTMLButtonElement;
let studioEditPanel: HTMLDivElement;
let studioGeneratePanel: HTMLDivElement;
let studioImageUploadArea: HTMLDivElement;
let studioLogoUpload: HTMLInputElement;
let studioUploadPlaceholder: HTMLDivElement;
let adjustmentControls: HTMLDivElement;
// -- AI Edit elements --
let aiEditSection: HTMLDivElement;
let aiEditPromptInput: HTMLTextAreaElement;
let micAiEditBtn: HTMLButtonElement;
let enhanceAiEditBtn: HTMLButtonElement;
let applyAiEditBtn: HTMLButtonElement;
// --
let brightnessSlider: HTMLInputElement;
let contrastSlider: HTMLInputElement;
let saturateSlider: HTMLInputElement;
let blurSlider: HTMLInputElement;
let textOverlayInput: HTMLTextAreaElement;
let textStylePanel: HTMLDivElement;
let fontFamilySelect: HTMLSelectElement;
let fontSizeSlider: HTMLInputElement;
let fontColorPicker: HTMLInputElement;
let fontBoldBtn: HTMLButtonElement;
let fontItalicBtn: HTMLButtonElement;
let textPositionGrid: NodeListOf<HTMLDivElement>;
let imagePromptInput: HTMLTextAreaElement;
let micGenerateImageBtn: HTMLButtonElement;
let enhanceImagePromptBtn: HTMLButtonElement;
let styleChips: NodeListOf<HTMLDivElement>;
let sizePresetChips: NodeListOf<HTMLButtonElement>;
let customWidthInput: HTMLInputElement;
let customHeightInput: HTMLInputElement;
let aspectRatioLockToggle: HTMLInputElement;
let sizePreviewBox: HTMLDivElement;
let generateImageBtn: HTMLButtonElement;
let studioOutputPlaceholder: HTMLDivElement;
let studioLoader: HTMLDivElement;
let studioLoaderText: HTMLParagraphElement;
let studioResultContainer: HTMLDivElement;
let studioImageOutput: HTMLImageElement;
let studioTextCanvas: HTMLCanvasElement;
// -- History controls --
let undoBtn: HTMLButtonElement;
let redoBtn: HTMLButtonElement;
// --
let studioDownloadControls: HTMLDivElement;
let studioFormatSelect: HTMLSelectElement;
let studioDownloadBtn: HTMLAnchorElement;
let studioErrorMessage: HTMLDivElement;


// --- STATE ---
// Design Generator State
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

// Image Studio State
let studioImageHistory: string[] = [];
let studioHistoryIndex = -1;
let studioCurrentImageSrc: string | null = null;
let studioImageFilters = {
    brightness: 100,
    contrast: 100,
    saturate: 100,
    blur: 0,
};
let textOverlayState = {
    text: '',
    fontFamily: 'Arial, sans-serif',
    fontSize: 48,
    color: '#FFFFFF',
    isBold: false,
    isItalic: false,
    position: 'middle-center', // top-left, top-center, ..., bottom-right
};
let selectedImageStyles = new Set<string>();
let imageGenerationSize = {
    width: 1024,
    height: 1024,
    lockAspectRatio: true,
};
let recognition: any | null = null;
let isListening = false;
let activeMic: {
    input: HTMLTextAreaElement;
    button: HTMLButtonElement;
} | null = null;
let isGeneratingImage = false;
let isEnhancingImagePrompt = false;
let isApplyingAiEdit = false;

// Shared State
const PREFERENCES_KEY = 'flyerGeneratorPrefs';
const STUDIO_PREFERENCES_KEY = 'imageStudioPrefs';
const THEME_KEY = 'flyergen-theme';
const LAST_TAB_KEY = 'flyergen-last-tab';


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
    let designType = 'Design';
    let placeholder = 'e.g., A modern design for a tech conference with a blue and white color scheme...';
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

function showError(message: string, isStudioError = false) {
    hideLoading();
    const errorEl = isStudioError ? studioErrorMessage : errorMessage;
    if (isStudioError) {
        studioLoader.classList.add('hidden');
    }

    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }
}

// --- THEME & TAB FUNCTIONS ---
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

function switchAppTab(targetTab: 'design' | 'studio') {
    if (targetTab === 'design') {
        tabDesignGenerator.classList.add('active');
        tabImageStudio.classList.remove('active');
        designGeneratorPage.classList.add('active');
        imageStudioPage.classList.remove('hidden'); // Use hidden for studio
        imageStudioPage.classList.remove('active');
        designGeneratorPage.classList.remove('hidden');

    } else {
        tabDesignGenerator.classList.remove('active');
        tabImageStudio.classList.add('active');
        designGeneratorPage.classList.remove('active');
        designGeneratorPage.classList.add('hidden');
        imageStudioPage.classList.add('active');
        imageStudioPage.classList.remove('hidden');

    }
    localStorage.setItem(LAST_TAB_KEY, targetTab);
}

// --- PREFERENCES FUNCTIONS ---

function saveStudioPrefs() {
    const prefs = {
        imageGenerationSize
    };
    localStorage.setItem(STUDIO_PREFERENCES_KEY, JSON.stringify(prefs));
}

const debouncedSaveStudioPrefs = debounce(saveStudioPrefs, 500);

function loadStudioPrefs() {
    const prefsString = localStorage.getItem(STUDIO_PREFERENCES_KEY);
    if (prefsString) {
        const prefs = JSON.parse(prefsString);
        if (prefs.imageGenerationSize) {
            imageGenerationSize = prefs.imageGenerationSize;
        }
    }
    // Update UI with loaded or default values
    updateImageSizeUI();
}

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

// --- EVENT HANDLERS (Design Generator) ---
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
function parseAndShowError(error: unknown, isStudioError = false) {
    console.error("AI Generation Error:", error);

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
    
    showError(userMessage, isStudioError);
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
    const designType = selectedSize === 'logo' ? 'logo' : selectedSize.includes('banner') ? 'banner' : 'design';
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


// --- EVENT HANDLERS (Image Studio) ---

// -- History Management --
function updateUndoRedoButtons() {
    undoBtn.disabled = studioHistoryIndex <= 0;
    redoBtn.disabled = studioHistoryIndex >= studioImageHistory.length - 1;
}

function renderCurrentImageFromHistory() {
    if (studioHistoryIndex < 0 || studioHistoryIndex >= studioImageHistory.length) {
        return;
    }
    const imageDataUrl = studioImageHistory[studioHistoryIndex];
    studioCurrentImageSrc = imageDataUrl;
    studioImageOutput.src = imageDataUrl;
    
    // Reset manual adjustments when history changes
    brightnessSlider.value = '100';
    contrastSlider.value = '100';
    saturateSlider.value = '100';
    blurSlider.value = '0';
    studioImageFilters = { brightness: 100, contrast: 100, saturate: 100, blur: 0 };
    applyStudioImageFilters();
    
    // Wait for the new image to load to set canvas size
    studioImageOutput.onload = () => {
        studioTextCanvas.width = studioImageOutput.naturalWidth;
        studioTextCanvas.height = studioImageOutput.naturalHeight;
        renderTextOnCanvas(); // Re-render text on new image
    };
    
    updateUndoRedoButtons();
}

function addHistoryState(imageDataUrl: string) {
    // If we are not at the end of the history, slice it
    if (studioHistoryIndex < studioImageHistory.length - 1) {
        studioImageHistory = studioImageHistory.slice(0, studioHistoryIndex + 1);
    }
    studioImageHistory.push(imageDataUrl);
    studioHistoryIndex = studioImageHistory.length - 1;
    
    renderCurrentImageFromHistory();
}

function handleUndoClick() {
    if (studioHistoryIndex > 0) {
        studioHistoryIndex--;
        renderCurrentImageFromHistory();
    }
}

function handleRedoClick() {
    if (studioHistoryIndex < studioImageHistory.length - 1) {
        studioHistoryIndex++;
        renderCurrentImageFromHistory();
    }
}

// -- Other Handlers --

function handleStudioTabSwitch(targetTab: 'edit' | 'generate') {
    if (targetTab === 'edit') {
        studioTabEdit.classList.add('active');
        studioTabGenerate.classList.remove('active');
        studioEditPanel.classList.add('active');
        studioGeneratePanel.classList.remove('active');
    } else {
        studioTabEdit.classList.remove('active');
        studioTabGenerate.classList.add('active');
        studioEditPanel.classList.remove('active');
        studioGeneratePanel.classList.add('active');
    }
}

function handleStudioImageUpload(files: FileList | null) {
    if (files && files.length > 0) {
        const file = files[0];
        if (!file.type.startsWith('image/')) {
            showError('Please select a valid image file (JPG, PNG, WEBP).', true);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageDataUrl = e.target?.result as string;
            // Reset history and add the new upload as the first state
            studioImageHistory = [];
            studioHistoryIndex = -1;
            addHistoryState(imageDataUrl);
            
            studioResultContainer.classList.remove('hidden');
            studioOutputPlaceholder.classList.add('hidden');
            studioDownloadControls.classList.remove('hidden');
            adjustmentControls.classList.remove('hidden');
            aiEditSection.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function applyStudioImageFilters() {
    const filters = studioImageFilters;
    const filterString = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) blur(${filters.blur}px)`;
    studioImageOutput.style.filter = filterString;
}

function renderTextOnCanvas() {
    if (!studioTextCanvas) return;
    const ctx = studioTextCanvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas before drawing
    ctx.clearRect(0, 0, studioTextCanvas.width, studioTextCanvas.height);

    if (!textOverlayState.text) {
        textStylePanel.classList.add('hidden');
        return;
    }
    
    textStylePanel.classList.remove('hidden');

    // Apply styles
    const fontStyle = textOverlayState.isItalic ? 'italic' : 'normal';
    const fontWeight = textOverlayState.isBold ? 'bold' : 'normal';
    ctx.font = `${fontStyle} ${fontWeight} ${textOverlayState.fontSize}px ${textOverlayState.fontFamily}`;
    ctx.fillStyle = textOverlayState.color;

    // Apply position
    const { position } = textOverlayState;
    if (position.includes('left')) {
        ctx.textAlign = 'left';
    } else if (position.includes('center')) {
        ctx.textAlign = 'center';
    } else if (position.includes('right')) {
        ctx.textAlign = 'right';
    }

    if (position.includes('top')) {
        ctx.textBaseline = 'top';
    } else if (position.includes('middle')) {
        ctx.textBaseline = 'middle';
    } else if (position.includes('bottom')) {
        ctx.textBaseline = 'bottom';
    }
    
    // Calculate coordinates
    const padding = 20; // Padding from the edges
    let x = 0;
    let y = 0;
    
    // Horizontal
    if (ctx.textAlign === 'left') x = padding;
    if (ctx.textAlign === 'center') x = studioTextCanvas.width / 2;
    if (ctx.textAlign === 'right') x = studioTextCanvas.width - padding;

    // Vertical
    if (ctx.textBaseline === 'top') y = padding;
    if (ctx.textBaseline === 'middle') y = studioTextCanvas.height / 2;
    if (ctx.textBaseline === 'bottom') y = studioTextCanvas.height - padding;
    
    // Add a simple shadow for better visibility
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Draw text line by line
    const lines = textOverlayState.text.split('\n');
    const lineHeight = textOverlayState.fontSize * 1.2;
    let startY = y;
    
    // Adjust starting Y position for multiline text based on baseline
    if(ctx.textBaseline === 'middle') {
        startY -= (lines.length - 1) * lineHeight / 2;
    } else if (ctx.textBaseline === 'bottom') {
        startY -= (lines.length - 1) * lineHeight;
    }

    lines.forEach((line, index) => {
        ctx.fillText(line, x, startY + (index * lineHeight));
    });
}

function handleTextOverlayUpdate() {
    textOverlayState.text = textOverlayInput.value;
    renderTextOnCanvas();
}

function handleTextStyleUpdate() {
    textOverlayState.fontFamily = fontFamilySelect.value;
    textOverlayState.fontSize = parseInt(fontSizeSlider.value);
    textOverlayState.color = fontColorPicker.value;
    textOverlayState.isBold = fontBoldBtn.getAttribute('aria-pressed') === 'true';
    textOverlayState.isItalic = fontItalicBtn.getAttribute('aria-pressed') === 'true';
    renderTextOnCanvas();
}

function handleTextPositionUpdate(event: Event) {
    const target = event.currentTarget as HTMLDivElement;
    textOverlayState.position = target.dataset.position || 'middle-center';

    textPositionGrid.forEach(option => {
        const isSelected = option === target;
        option.classList.toggle('selected', isSelected);
        option.setAttribute('aria-checked', String(isSelected));
    });
    
    renderTextOnCanvas();
}

async function handleEnhanceAiEditPromptClick() {
    if (isEnhancing || !aiEditPromptInput.value.trim()) return;

    isEnhancing = true;
    enhanceAiEditBtn.disabled = true;
    enhanceAiEditBtn.classList.add('loading');
    
    const currentText = aiEditPromptInput.value.trim();
    const enhancePrompt = `You are a prompt enhancer for an AI image editor. Rewrite the following user description into a clear, specific, and effective editing instruction. Return only the enhanced instruction, with no introductory text.\n\nUser's Edit Request: "${currentText}"`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: enhancePrompt,
        });
        
        const newText = response.text.trim();
        if (newText) {
            aiEditPromptInput.value = newText;
        } else {
            showError("The AI couldn't enhance the description. Please try a different one.", true);
        }
    } catch (error) {
        parseAndShowError(error, true);
    } finally {
        isEnhancing = false;
        enhanceAiEditBtn.classList.remove('loading');
        enhanceAiEditBtn.disabled = !aiEditPromptInput.value.trim();
    }
}

async function handleApplyAiEditClick() {
    if (isApplyingAiEdit || !studioCurrentImageSrc || !aiEditPromptInput.value.trim()) return;

    isApplyingAiEdit = true;
    applyAiEditBtn.disabled = true;
    applyAiEditBtn.classList.add('loading');
    studioLoader.classList.remove('hidden');
    studioLoaderText.textContent = 'Applying AI edit...';
    studioResultContainer.classList.add('hidden'); // Hide current result while loading
    studioErrorMessage.classList.add('hidden');

    try {
        const base64ImageData = studioCurrentImageSrc.split(',')[1];
        const mimeType = studioCurrentImageSrc.substring(studioCurrentImageSrc.indexOf(':') + 1, studioCurrentImageSrc.indexOf(';'));
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    { inlineData: { data: base64ImageData, mimeType: mimeType } },
                    { text: aiEditPromptInput.value.trim() },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        let foundImage = false;
        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const newBase64 = part.inlineData.data;
                    const newMimeType = part.inlineData.mimeType;
                    const newImageUrl = `data:${newMimeType};base64,${newBase64}`;
                    addHistoryState(newImageUrl);
                    foundImage = true;
                    break;
                }
            }
        }
        
        if (!foundImage) {
            showError("The AI couldn't apply the edit. Please try a different description.", true);
        }
    } catch (error) {
        parseAndShowError(error, true);
    } finally {
        isApplyingAiEdit = false;
        applyAiEditBtn.disabled = false;
        applyAiEditBtn.classList.remove('loading');
        studioLoader.classList.add('hidden');
        studioResultContainer.classList.remove('hidden'); // Show result container again
    }
}

async function handleEnhanceImagePromptClick() {
    if (isEnhancingImagePrompt || !imagePromptInput.value.trim()) return;

    isEnhancingImagePrompt = true;
    enhanceImagePromptBtn.disabled = true;
    enhanceImagePromptBtn.classList.add('loading');
    
    const currentText = imagePromptInput.value.trim();
    const enhancePrompt = `You are a prompt enhancer for an AI image generator. Rewrite the following user description into a clear, specific, and evocative prompt. Include details about the subject, scene, composition, lighting, color palette, mood, and style. Keep it under 120 words. Return only the enhanced prompt, with no introductory text.\n\nUser Description: "${currentText}"`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: enhancePrompt,
        });
        
        const newText = response.text.trim();
        if (newText) {
            imagePromptInput.value = newText;
        } else {
            showError("The AI couldn't enhance the description. Please try a different one.", true);
        }
    } catch (error) {
        parseAndShowError(error, true);
    } finally {
        isEnhancingImagePrompt = false;
        enhanceImagePromptBtn.classList.remove('loading');
        enhanceImagePromptBtn.disabled = !imagePromptInput.value.trim();
    }
}

// --- Image Size Selector Logic ---
function updateImageSizeUI() {
    const { width, height } = imageGenerationSize;
    customWidthInput.value = String(width);
    customHeightInput.value = String(height);

    // Update preview box aspect ratio
    if (height > 0) {
        sizePreviewBox.style.aspectRatio = `${width} / ${height}`;
    }

    // Check if current custom dimensions match a preset and select it
    let matchedPreset = false;
    sizePresetChips.forEach(chip => {
        const presetW = parseInt(chip.dataset.width || '0');
        const presetH = parseInt(chip.dataset.height || '0');
        const isMatch = presetW === width && presetH === height;
        chip.classList.toggle('selected', isMatch);
        if (isMatch) matchedPreset = true;
    });

    // If no preset matches, deselect all
    if (!matchedPreset) {
        sizePresetChips.forEach(chip => chip.classList.remove('selected'));
    }
    
    aspectRatioLockToggle.checked = imageGenerationSize.lockAspectRatio;
}


function handleSizePresetClick(event: MouseEvent) {
    const target = event.currentTarget as HTMLButtonElement;
    const newWidth = parseInt(target.dataset.width || '1024');
    const newHeight = parseInt(target.dataset.height || '1024');

    imageGenerationSize.width = newWidth;
    imageGenerationSize.height = newHeight;
    
    updateImageSizeUI();
    debouncedSaveStudioPrefs();
}

function handleCustomDimensionInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const isWidth = target.id === 'custom-width-input';
    let value = parseInt(target.value);

    // Clamp values
    if (value < 256) value = 256;
    if (value > 2048) value = 2048;
    target.value = String(value);

    const oldWidth = imageGenerationSize.width;
    const oldHeight = imageGenerationSize.height;

    if (imageGenerationSize.lockAspectRatio) {
        if (isWidth && oldWidth > 0) {
            const ratio = oldHeight / oldWidth;
            imageGenerationSize.height = Math.round(value * ratio);
        } else if (!isWidth && oldHeight > 0) {
            const ratio = oldWidth / oldHeight;
            imageGenerationSize.width = Math.round(value * ratio);
        }
    }
    
    if (isWidth) {
        imageGenerationSize.width = value;
    } else {
        imageGenerationSize.height = value;
    }

    updateImageSizeUI();
    debouncedSaveStudioPrefs();
}

function handleAspectRatioLockToggle() {
    imageGenerationSize.lockAspectRatio = aspectRatioLockToggle.checked;
    debouncedSaveStudioPrefs();
}

function getClosestAspectRatio(width: number, height: number): '1:1' | '16:9' | '9:16' | '4:3' | '3:4' {
    const ratio = width / height;
    const supportedRatios = {
        '16:9': 16/9, // ~1.77
        '4:3': 4/3,   // ~1.33
        '1:1': 1,
        '3:4': 3/4,   // 0.75
        '9:16': 9/16, // ~0.56
    };

    let closest = '1:1' as keyof typeof supportedRatios;
    let minDiff = Math.abs(ratio - supportedRatios[closest]);

    for (const key in supportedRatios) {
        const r = key as keyof typeof supportedRatios;
        const diff = Math.abs(ratio - supportedRatios[r]);
        if (diff < minDiff) {
            minDiff = diff;
            closest = r;
        }
    }
    return closest;
}
// --- End Image Size Selector Logic ---


async function handleGenerateImageClick() {
    if (isGeneratingImage) return;

    const prompt = imagePromptInput.value.trim();
    if (!prompt) {
        showError("Please enter a description for the image you want to create.", true);
        return;
    }

    isGeneratingImage = true;
    generateImageBtn.disabled = true;
    generateImageBtn.classList.add('loading');
    studioResultContainer.classList.add('hidden');
    studioOutputPlaceholder.classList.add('hidden');
    studioErrorMessage.classList.add('hidden');
    studioLoader.classList.remove('hidden');
    studioLoaderText.textContent = 'Generating your image...';

    try {
        let fullPrompt = prompt;
        if (selectedImageStyles.size > 0) {
            fullPrompt += `, in the style of: ${Array.from(selectedImageStyles).join(', ')}.`;
        }
        
        const aspectRatio = getClosestAspectRatio(imageGenerationSize.width, imageGenerationSize.height);

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            const newImageDataUrl = `data:image/png;base64,${base64ImageBytes}`;
            
            studioImageHistory = [];
            studioHistoryIndex = -1;
            addHistoryState(newImageDataUrl);

            studioResultContainer.classList.remove('hidden');
            studioDownloadControls.classList.remove('hidden');
            adjustmentControls.classList.remove('hidden');
            aiEditSection.classList.remove('hidden');
        } else {
            showError("The AI couldn't generate an image from that prompt. Please try refining it.", true);
        }

    } catch (error) {
        parseAndShowError(error, true);
    } finally {
        isGeneratingImage = false;
        generateImageBtn.disabled = false;
        generateImageBtn.classList.remove('loading');
        studioLoader.classList.add('hidden');
    }
}

async function handleExportImageClick(event: MouseEvent) {
    event.preventDefault();
    if (!studioCurrentImageSrc) {
        showError("There is no image to export.", true);
        return;
    }

    const format = studioFormatSelect.value;
    const fileName = `studio-export.${format}`;

    const originalButtonText = studioDownloadBtn.textContent;
    studioDownloadBtn.textContent = 'Exporting...';
    studioDownloadBtn.classList.add('disabled');

    try {
        const image = new Image();
        image.crossOrigin = 'anonymous'; // Important for cross-origin data
        
        await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
            image.src = studioCurrentImageSrc!;
        });

        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not create canvas context.");

        // Apply filters from the image element
        ctx.filter = studioImageOutput.style.filter;
        ctx.drawImage(image, 0, 0);

        // Apply text overlay by drawing the text canvas on top
        // This ensures text is not affected by filters
        ctx.filter = 'none'; 
        ctx.drawImage(studioTextCanvas, 0, 0);
        
        let finalDataUrl = canvas.toDataURL(`image/${format}`, 0.9);

        // If JPG, we need to handle transparency by drawing on a white background first
        if (format === 'jpg') {
             const jpgCanvas = document.createElement('canvas');
             jpgCanvas.width = image.naturalWidth;
             jpgCanvas.height = image.naturalHeight;
             const jpgCtx = jpgCanvas.getContext('2d')!;
             jpgCtx.fillStyle = '#FFFFFF';
             jpgCtx.fillRect(0, 0, jpgCanvas.width, jpgCanvas.height);
             jpgCtx.drawImage(canvas, 0, 0);
             finalDataUrl = jpgCanvas.toDataURL('image/jpeg', 0.9);
        }
        
        // Trigger download
        const link = document.createElement('a');
        link.href = finalDataUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error("Export failed:", error);
        showError("Sorry, the image could not be exported.", true);
    } finally {
        studioDownloadBtn.textContent = originalButtonText;
        studioDownloadBtn.classList.remove('disabled');
    }
}


// --- INITIALIZATION ---
function initialize() {
    // --- Assign all DOM elements ---

    // -- App Shell --
    themeSwitcherBtn = document.getElementById('theme-switcher') as HTMLButtonElement;
    tabDesignGenerator = document.getElementById('tab-design-generator') as HTMLButtonElement;
    tabImageStudio = document.getElementById('tab-image-studio') as HTMLButtonElement;
    designGeneratorPage = document.getElementById('design-generator-page') as HTMLDivElement;
    imageStudioPage = document.getElementById('image-studio-page') as HTMLDivElement;

    // -- Design Generator --
    descriptionHeader = document.getElementById('description-header') as HTMLHeadingElement;
    promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
    micDesignBtn = document.getElementById('mic-design-btn') as HTMLButtonElement;
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
    cropModal = document.getElementById('crop-modal') as HTMLDivElement;
    imageToCrop = document.getElementById('image-to-crop') as HTMLImageElement;
    applyCropBtn = document.getElementById('apply-crop-btn') as HTMLButtonElement;
    cancelCropBtn = document.getElementById('cancel-crop-btn') as HTMLButtonElement;

    // -- Image Studio --
    studioTabEdit = document.getElementById('studio-tab-edit') as HTMLButtonElement;
    studioTabGenerate = document.getElementById('studio-tab-generate') as HTMLButtonElement;
    studioEditPanel = document.getElementById('studio-edit-panel') as HTMLDivElement;
    studioGeneratePanel = document.getElementById('studio-generate-panel') as HTMLDivElement;
    studioImageUploadArea = document.getElementById('studio-image-upload-area') as HTMLDivElement;
    studioLogoUpload = document.getElementById('studio-logo-upload') as HTMLInputElement;
    studioUploadPlaceholder = document.getElementById('studio-upload-placeholder') as HTMLDivElement;
    adjustmentControls = document.querySelector('.adjustment-controls') as HTMLDivElement;
    aiEditSection = document.getElementById('ai-edit-section') as HTMLDivElement;
    aiEditPromptInput = document.getElementById('ai-edit-prompt-input') as HTMLTextAreaElement;
    micAiEditBtn = document.getElementById('mic-ai-edit-btn') as HTMLButtonElement;
    enhanceAiEditBtn = document.getElementById('enhance-ai-edit-btn') as HTMLButtonElement;
    applyAiEditBtn = document.getElementById('apply-ai-edit-btn') as HTMLButtonElement;
    brightnessSlider = document.getElementById('brightness-slider') as HTMLInputElement;
    contrastSlider = document.getElementById('contrast-slider') as HTMLInputElement;
    saturateSlider = document.getElementById('saturate-slider') as HTMLInputElement;
    blurSlider = document.getElementById('blur-slider') as HTMLInputElement;
    textOverlayInput = document.getElementById('text-overlay-input') as HTMLTextAreaElement;
    textStylePanel = document.getElementById('text-style-panel') as HTMLDivElement;
    fontFamilySelect = document.getElementById('font-family-select') as HTMLSelectElement;
    fontSizeSlider = document.getElementById('font-size-slider') as HTMLInputElement;
    fontColorPicker = document.getElementById('font-color-picker') as HTMLInputElement;
    fontBoldBtn = document.getElementById('font-bold-btn') as HTMLButtonElement;
    fontItalicBtn = document.getElementById('font-italic-btn') as HTMLButtonElement;
    textPositionGrid = document.querySelectorAll('#text-position-grid .logo-position-option');
    imagePromptInput = document.getElementById('image-prompt-input') as HTMLTextAreaElement;
    micGenerateImageBtn = document.getElementById('mic-generate-image-btn') as HTMLButtonElement;
    enhanceImagePromptBtn = document.getElementById('enhance-image-prompt-btn') as HTMLButtonElement;
    styleChips = document.querySelectorAll('.style-chip');
    sizePresetChips = document.querySelectorAll('.size-preset-chip');
    customWidthInput = document.getElementById('custom-width-input') as HTMLInputElement;
    customHeightInput = document.getElementById('custom-height-input') as HTMLInputElement;
    aspectRatioLockToggle = document.getElementById('aspect-ratio-lock-toggle') as HTMLInputElement;
    sizePreviewBox = document.getElementById('size-preview-box') as HTMLDivElement;
    generateImageBtn = document.getElementById('generate-image-btn') as HTMLButtonElement;
    studioOutputPlaceholder = document.getElementById('studio-output-placeholder') as HTMLDivElement;
    studioLoader = document.getElementById('studio-loader') as HTMLDivElement;
    studioLoaderText = document.getElementById('studio-loader-text') as HTMLParagraphElement;
    studioResultContainer = document.getElementById('studio-result-container') as HTMLDivElement;
    studioImageOutput = document.getElementById('studio-image-output') as HTMLImageElement;
    studioTextCanvas = document.getElementById('studio-text-canvas') as HTMLCanvasElement;
    undoBtn = document.getElementById('undo-btn') as HTMLButtonElement;
    redoBtn = document.getElementById('redo-btn') as HTMLButtonElement;
    studioDownloadControls = document.querySelector('.studio-download-controls') as HTMLDivElement;
    studioFormatSelect = document.getElementById('studio-format-select') as HTMLSelectElement;
    studioDownloadBtn = document.getElementById('studio-download-btn') as HTMLAnchorElement;
    studioErrorMessage = document.getElementById('studio-error-message') as HTMLDivElement;


    // --- Now that we know generateBtn exists, we can safely query its inner elements. ---
    generateBtnSpan = generateBtn.querySelector('span') as HTMLSpanElement;

    // --- Attach all event listeners ---
    
    // -- App Shell --
    themeSwitcherBtn.addEventListener('click', toggleTheme);
    tabDesignGenerator.addEventListener('click', () => switchAppTab('design'));
    tabImageStudio.addEventListener('click', () => switchAppTab('studio'));

    // -- Design Generator --
    enhancePromptBtn.addEventListener('click', handleEnhancePromptClick);
    imageUploadArea.addEventListener('click', (e) => {
        if (e.target !== removeLogoBtn) {
            logoUpload.click();
        }
    });
    logoUpload.addEventListener('change', () => handleLogoSelection(logoUpload.files));
    removeLogoBtn.addEventListener('click', handleRemoveLogo);
    imageUploadArea.addEventListener('dragover', (e) => { e.preventDefault(); imageUploadArea.classList.add('drag-over'); });
    imageUploadArea.addEventListener('dragleave', () => imageUploadArea.classList.remove('drag-over'));
    imageUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadArea.classList.remove('drag-over');
        handleLogoSelection(e.dataTransfer?.files ?? null);
    });
    applyCropBtn.addEventListener('click', handleApplyCrop);
    cancelCropBtn.addEventListener('click', handleCancelCrop);
    logoSizeOptions.forEach(option => option.addEventListener('click', handleLogoSizeSelection));
    logoPositionOptions.forEach(option => option.addEventListener('click', handleLogoPositionSelection));
    paletteOptions.forEach(option => option.addEventListener('click', handlePaletteSelection));
    layoutOptions.forEach(option => option.addEventListener('click', handleLayoutSelection));
    backgroundOptions.forEach(option => option.addEventListener('click', handleBackgroundSelection));
    fontOptions.forEach(option => option.addEventListener('click', handleFontSelection));
    sizeOptions.forEach(option => option.addEventListener('click', handleSizeSelection));
    textEffectOptions.forEach(option => option.addEventListener('click', handleTextEffectSelection));
    promptInput.addEventListener('input', () => {
        enhancePromptBtn.disabled = !promptInput.value.trim();
        debouncedSavePrefs();
    });
    companyNameInput.addEventListener('input', debouncedSavePrefs);
    contactDetailsInput.addEventListener('input', debouncedSavePrefs);
    generateBtn.addEventListener('click', handleGenerateClick);
    downloadBtn.addEventListener('click', handleDownloadClick);
    clearPrefsBtn.addEventListener('click', handleClearPrefs);
    
    // -- Image Studio --
    studioTabEdit.addEventListener('click', () => handleStudioTabSwitch('edit'));
    studioTabGenerate.addEventListener('click', () => handleStudioTabSwitch('generate'));
    studioImageUploadArea.addEventListener('click', () => studioLogoUpload.click());
    studioLogoUpload.addEventListener('change', () => handleStudioImageUpload(studioLogoUpload.files));
    studioImageUploadArea.addEventListener('dragover', (e) => { e.preventDefault(); studioImageUploadArea.classList.add('drag-over'); });
    studioImageUploadArea.addEventListener('dragleave', () => studioImageUploadArea.classList.remove('drag-over'));
    studioImageUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        studioImageUploadArea.classList.remove('drag-over');
        handleStudioImageUpload(e.dataTransfer?.files ?? null);
    });
    brightnessSlider.addEventListener('input', () => { studioImageFilters.brightness = parseInt(brightnessSlider.value); applyStudioImageFilters(); });
    contrastSlider.addEventListener('input', () => { studioImageFilters.contrast = parseInt(contrastSlider.value); applyStudioImageFilters(); });
    saturateSlider.addEventListener('input', () => { studioImageFilters.saturate = parseInt(saturateSlider.value); applyStudioImageFilters(); });
    blurSlider.addEventListener('input', () => { studioImageFilters.blur = parseFloat(blurSlider.value); applyStudioImageFilters(); });
    
    // AI Edit Listeners
    aiEditPromptInput.addEventListener('input', () => {
        enhanceAiEditBtn.disabled = !aiEditPromptInput.value.trim();
    });
    enhanceAiEditBtn.addEventListener('click', handleEnhanceAiEditPromptClick);
    applyAiEditBtn.addEventListener('click', handleApplyAiEditClick);

    // Text Overlay Listeners
    textOverlayInput.addEventListener('input', handleTextOverlayUpdate);
    fontFamilySelect.addEventListener('input', handleTextStyleUpdate);
    fontSizeSlider.addEventListener('input', handleTextStyleUpdate);
    fontColorPicker.addEventListener('input', handleTextStyleUpdate);
    fontBoldBtn.addEventListener('click', () => {
        const isPressed = fontBoldBtn.getAttribute('aria-pressed') === 'true';
        fontBoldBtn.setAttribute('aria-pressed', String(!isPressed));
        handleTextStyleUpdate();
    });
    fontItalicBtn.addEventListener('click', () => {
        const isPressed = fontItalicBtn.getAttribute('aria-pressed') === 'true';
        fontItalicBtn.setAttribute('aria-pressed', String(!isPressed));
        handleTextStyleUpdate();
    });
    textPositionGrid.forEach(option => option.addEventListener('click', handleTextPositionUpdate));
    
    imagePromptInput.addEventListener('input', () => {
        enhanceImagePromptBtn.disabled = !imagePromptInput.value.trim();
    });
    enhanceImagePromptBtn.addEventListener('click', handleEnhanceImagePromptClick);
    styleChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const style = chip.dataset.style;
            if (!style) return;
            chip.classList.toggle('selected');
            const isSelected = chip.classList.contains('selected');
            chip.setAttribute('aria-checked', String(isSelected));
            if (isSelected) {
                selectedImageStyles.add(style);
            } else {
                selectedImageStyles.delete(style);
            }
        });
    });
    sizePresetChips.forEach(chip => chip.addEventListener('click', handleSizePresetClick));
    customWidthInput.addEventListener('input', handleCustomDimensionInput);
    customHeightInput.addEventListener('input', handleCustomDimensionInput);
    aspectRatioLockToggle.addEventListener('change', handleAspectRatioLockToggle);
    generateImageBtn.addEventListener('click', handleGenerateImageClick);
    
    // History Listeners
    undoBtn.addEventListener('click', handleUndoClick);
    redoBtn.addEventListener('click', handleRedoClick);

    studioDownloadBtn.addEventListener('click', handleExportImageClick);

    // --- Voice Recognition Setup ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true; // Keep listening until explicitly stopped.
        recognition.lang = 'en-US';
        recognition.interimResults = true; // Show results as they are being spoken.

        let initialText = ''; // To store text that was in the input before starting.

        recognition.onstart = () => {
            isListening = true;
            if (activeMic) {
                initialText = activeMic.input.value; // Save current text.
                activeMic.button.classList.add('listening');
                activeMic.button.title = 'Stop Listening';
                // Disable other mic buttons to prevent conflicting states.
                [micDesignBtn, micAiEditBtn, micGenerateImageBtn].forEach(btn => {
                    if (btn && btn !== activeMic?.button) {
                        btn.disabled = true;
                    }
                });
            }
        };

        recognition.onend = () => {
            isListening = false;
            if (activeMic) {
                activeMic.button.classList.remove('listening');
                activeMic.button.title = 'Use Voice';
                // Manually trigger input event for features like auto-save.
                activeMic.input.dispatchEvent(new Event('input', { bubbles: true }));
            }
             // Re-enable all mic buttons.
            [micDesignBtn, micAiEditBtn, micGenerateImageBtn].forEach(btn => {
                if (btn) btn.disabled = false;
            });
            activeMic = null;
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            let userMessage = 'An error occurred during voice recognition.';
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                userMessage = 'Microphone access was denied. Please allow it in your browser settings.';
            } else if (event.error === 'no-speech') {
                userMessage = 'No speech was detected. Please try again.';
            }
            const isStudio = imageStudioPage.classList.contains('active');
            showError(userMessage, isStudio);
            // Ensure cleanup happens even on error.
            if (isListening) {
                recognition.stop();
            }
        };

        recognition.onresult = (event: any) => {
            if (!activeMic) return;

            let interim_transcript = '';
            let final_transcript = '';

            // Iterate through all results received in this session.
            for (let i = 0; i < event.results.length; ++i) {
                const transcript_part = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final_transcript += transcript_part;
                } else {
                    interim_transcript += transcript_part;
                }
            }
            
            // Combine initial text with the full transcript so far.
            const separator = initialText.trim().length > 0 && (final_transcript.length > 0 || interim_transcript.length > 0) ? ' ' : '';
            activeMic.input.value = initialText + separator + final_transcript + interim_transcript;
        };
        
        const setupMicListener = (button: HTMLButtonElement, input: HTMLTextAreaElement) => {
            if (!button) return;
            button.addEventListener('click', () => {
                // Toggle listening state.
                if (isListening) {
                    recognition.stop();
                } else {
                    activeMic = { input, button };
                    try {
                        recognition.start();
                    } catch (err) {
                        console.error("Speech recognition error on start:", err);
                        const isStudio = imageStudioPage.classList.contains('active');
                        showError("Could not start voice recognition.", isStudio);
                        activeMic = null; // Clean up on failure.
                    }
                }
            });
        };

        setupMicListener(micDesignBtn, promptInput);
        setupMicListener(micAiEditBtn, aiEditPromptInput);
        setupMicListener(micGenerateImageBtn, imagePromptInput);

    } else {
        console.warn('Speech Recognition not supported in this browser.');
        // Hide all microphone buttons if the API is not available.
        [micDesignBtn, micAiEditBtn, micGenerateImageBtn].forEach(btn => {
            if(btn) btn.style.display = 'none';
        });
    }

    // --- Final Setup ---
    loadTheme();
    handleLoadPrefs();
    loadStudioPrefs();
    const lastTab = localStorage.getItem(LAST_TAB_KEY) as 'design' | 'studio' | null;
    if (lastTab) {
        switchAppTab(lastTab);
    }
}

// Run initialization
initialize();

export {};
