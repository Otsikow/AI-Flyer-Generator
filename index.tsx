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
let tabSocialManager: HTMLButtonElement;
let designGeneratorPage: HTMLDivElement;
let imageStudioPage: HTMLDivElement;
let socialMediaManagerPage: HTMLDivElement;

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
let downloadBtn: HTMLButtonElement;
let shareBtn: HTMLButtonElement;
let formatSelect: HTMLSelectElement;
let errorMessage: HTMLDivElement;

// -- Cropping modal elements --
let cropModal: HTMLDivElement;
let imageToCrop: HTMLImageElement;
let applyCropBtn: HTMLButtonElement;
let cancelCropBtn: HTMLButtonElement;

// -- Share Modal elements --
let shareModal: HTMLDivElement;
let shareImagePreview: HTMLImageElement;
let shareCaptionInput: HTMLTextAreaElement;
let generateCaptionBtn: HTMLButtonElement;
let shareNowBtn: HTMLButtonElement;
let cancelShareBtn: HTMLButtonElement;

// -- Image Studio --
let studioTabEdit: HTMLButtonElement;
let studioTabGenerate: HTMLButtonElement;
let studioEditPanel: HTMLDivElement;
let studioGeneratePanel: HTMLDivElement;
let studioImageUploadArea: HTMLDivElement;
let studioLogoUpload: HTMLInputElement;
let studioUploadPlaceholder: HTMLDivElement;
let uploadedImagesContainer: HTMLDivElement;
let uploadedImagesList: HTMLDivElement;
let mergeControls: HTMLDivElement;
let mergePromptInput: HTMLTextAreaElement;
let mergeImagesBtn: HTMLButtonElement;
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
let studioDownloadBtn: HTMLButtonElement;
let studioShareBtn: HTMLButtonElement;
let studioErrorMessage: HTMLDivElement;

// -- Social Media Manager --
let businessSelect: HTMLSelectElement;
let manageBusinessesBtn: HTMLButtonElement;
let socialTopicInput: HTMLTextAreaElement;
let brainstormIdeasBtn: HTMLButtonElement;
let socialToneSelect: HTMLSelectElement;
let socialPlatformsContainer: HTMLDivElement;
let selectAllPlatformsBtn: HTMLButtonElement;
let generateSocialBtn: HTMLButtonElement;
let generateRepliesBtn: HTMLButtonElement;
let socialTabCreate: HTMLButtonElement;
let socialTabScheduled: HTMLButtonElement;
let socialCreatePanel: HTMLDivElement;
let socialScheduledPanel: HTMLDivElement;
let socialOutputPlaceholder: HTMLDivElement;
let socialLoader: HTMLDivElement;
let socialResultsContainer: HTMLDivElement;
let socialScheduleControls: HTMLDivElement;
let scheduleDateInput: HTMLInputElement;
let suggestTimeBtn: HTMLButtonElement;
let schedulePostsBtn: HTMLButtonElement;
let socialErrorMessage: HTMLDivElement;
let scheduledPostsContainer: HTMLDivElement;
let businessManagerModal: HTMLDivElement;
let businessListContainer: HTMLDivElement;
let businessForm: HTMLFormElement;
let businessIdInput: HTMLInputElement;
let businessNameInput: HTMLInputElement;
let businessSocialGeneralInput: HTMLInputElement;
let businessSocialLinkedinInput: HTMLInputElement;
let businessSocialTwitterInput: HTMLInputElement;
let businessSocialInstagramInput: HTMLInputElement;
let businessSocialFacebookInput: HTMLInputElement;
let businessSocialRedditInput: HTMLInputElement;
let cancelBusinessEditBtn: HTMLButtonElement;
let brainstormModal: HTMLDivElement;
let brainstormResultsContainer: HTMLDivElement;
let closeBrainstormBtn: HTMLButtonElement;
let generateBrainstormIdeasBtn: HTMLButtonElement;
let replyGeneratorModal: HTMLDivElement;
let replyOriginalText: HTMLTextAreaElement;
let replyToneSelect: HTMLSelectElement;
let replyResultsContainer: HTMLDivElement;
let closeReplyModalBtn: HTMLButtonElement;
let generateReplyBtn: HTMLButtonElement;
let refinePostModal: HTMLDivElement;
let refineOriginalText: HTMLParagraphElement;
let refineActionsContainer: HTMLDivElement;
let refineCustomInstruction: HTMLTextAreaElement;
let cancelRefineBtn: HTMLButtonElement;
let refineNowBtn: HTMLButtonElement;

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
let uploadedStudioImages: { id: number; src: string }[] = [];
let selectedStudioImageId: number | null = null;
let nextImageId = 0;
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
let isMerging = false;

// Share Modal State
let isGeneratingCaption = false;
let currentImageToShare: string | null = null;
let shareContextPrompt: string | null = null;

// Social Media Manager State
type Business = { 
    id: number;
    name: string;
    socials: { [key: string]: string };
};
let businesses: Business[] = [];
let selectedBusinessId: number | null = null;
let selectedPlatforms = new Set<string>();
let generatedSocialContent: any[] = [];
let scheduledPosts: any[] = [];
let isGeneratingSocial = false;
let isBrainstorming = false;
let isGeneratingReplies = false;
let isRefiningPost = false;
let postToRefine: { platform: string; text: string; } | null = null;


// Shared State
const PREFERENCES_KEY = 'flyerGeneratorPrefs';
const STUDIO_PREFERENCES_KEY = 'imageStudioPrefs';
const SOCIAL_PREFERENCES_KEY = 'socialManagerPrefs';
const THEME_KEY = 'flyergen-theme';
const LAST_TAB_KEY = 'flyergen-last-tab';


// --- GEMINI SETUP ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- CONSTANTS ---
const platforms = [
    { name: 'LinkedIn', key: 'linkedin', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>` },
    { name: 'X / Twitter', key: 'twitter', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>` },
    { name: 'Instagram', key: 'instagram', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>` },
    { name: 'Facebook', key: 'facebook', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>` },
    { name: 'Reddit', key: 'reddit', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm2-8.8H9c0-1.1.9-2 2-2s2 .9 2 2z"/><path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4.8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm2-8.8H9c0-1.1.9-2 2-2s2 .9 2 2zM16 12c0 .8-.4 1.5-.9 1.9.1.5.1 1.1 0 1.6-.2.6-.5 1.2-1 1.7-.5.5-1.1.8-1.7 1-.6.2-1.2.2-1.8.1-.5 0-1-.1-1.5-.3-.5-.2-1-.4-1.4-.8-.4-.4-.8-.8-1.1-1.3s-.5-1-.6-1.5c-.1-.5-.1-1.1 0-1.6.5-.4.9-1.1.9-1.9 0-1.1-.9-2-2-2H8v-2h2c1.1 0 2-.9 2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2h-1c-.6 0-1 .4-1 1s.4 1 1 1h2c1.1 0 2 .9 2 2z"/></svg>` },
];


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

function showError(message: string, targetErrorEl?: HTMLDivElement) {
    hideLoading(); // For design generator
    if (studioLoader) studioLoader.classList.add('hidden'); // For studio
    if (socialLoader) socialLoader.classList.add('hidden'); // For social

    const errorEl = targetErrorEl || errorMessage; // Default to design generator error
    
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

function switchAppTab(targetTab: 'design' | 'studio' | 'social') {
    const tabs = [tabDesignGenerator, tabImageStudio, tabSocialManager];
    const pages = [designGeneratorPage, imageStudioPage, socialMediaManagerPage];
    
    tabs.forEach(tab => tab.classList.remove('active'));
    pages.forEach(page => page.classList.add('hidden'));

    if (targetTab === 'design') {
        tabDesignGenerator.classList.add('active');
        designGeneratorPage.classList.remove('hidden');
    } else if (targetTab === 'studio') {
        tabImageStudio.classList.add('active');
        imageStudioPage.classList.remove('hidden');
    } else if (targetTab === 'social') {
        tabSocialManager.classList.add('active');
        socialMediaManagerPage.classList.remove('hidden');
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
function parseAndShowError(error: unknown, targetErrorEl?: HTMLDivElement) {
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
    
    showError(userMessage, targetErrorEl);
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


// --- SHARE MODAL FUNCTIONS ---

/**
 * Converts a data URL string into a File object.
 */
async function dataURLtoFile(dataUrl: string, filename: string): Promise<File | null> {
    try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], filename, { type: blob.type });
    } catch (error) {
        console.error("Error converting data URL to file:", error);
        return null;
    }
}

function openShareModal(context: 'design' | 'studio') {
    let imageDataUrl: string | null = null;
    let prompt: string | null = null;

    if (context === 'design') {
        imageDataUrl = flyerOutput.src;
        prompt = promptInput.value;
    } else { // context === 'studio'
        imageDataUrl = studioCurrentImageSrc;
        // In studio, prefer the generation prompt, fallback to AI edit prompt
        prompt = imagePromptInput.value || aiEditPromptInput.value;
    }

    if (!imageDataUrl || !imageDataUrl.startsWith('data:image')) {
        showError("No image available to share.", context === 'studio' ? studioErrorMessage : errorMessage);
        return;
    }

    currentImageToShare = imageDataUrl;
    shareContextPrompt = prompt;

    shareImagePreview.src = imageDataUrl;
    shareCaptionInput.value = '';
    
    // Disable caption generation if there's no prompt context
    const genCaptionBtnSpan = generateCaptionBtn.querySelector('span');
    if (genCaptionBtnSpan) genCaptionBtnSpan.textContent = 'Generate Caption';
    generateCaptionBtn.disabled = !shareContextPrompt?.trim();

    shareModal.classList.remove('hidden');
}

function closeShareModal() {
    shareModal.classList.add('hidden');
    currentImageToShare = null;
    shareContextPrompt = null;
}

async function handleGenerateCaptionClick() {
    if (isGeneratingCaption || !shareContextPrompt) return;

    isGeneratingCaption = true;
    generateCaptionBtn.disabled = true;
    generateCaptionBtn.classList.add('loading');
    const genCaptionBtnSpan = generateCaptionBtn.querySelector('span');
    if(genCaptionBtnSpan) genCaptionBtnSpan.textContent = 'Generating...';

    const captionPrompt = `Generate a short, engaging social media caption for a design that was created with this description: "${shareContextPrompt}". Include relevant hashtags. The caption should be exciting and encourage engagement.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: captionPrompt,
        });
        const newCaption = response.text.trim();
        if (newCaption) {
            shareCaptionInput.value = newCaption;
        } else {
            showError("The AI couldn't generate a caption. Please try again.", socialMediaManagerPage.classList.contains('active') ? socialErrorMessage : studioErrorMessage);
        }
    } catch (error) {
        parseAndShowError(error, socialMediaManagerPage.classList.contains('active') ? socialErrorMessage : studioErrorMessage);
    } finally {
        isGeneratingCaption = false;
        generateCaptionBtn.classList.remove('loading');
        if (genCaptionBtnSpan) genCaptionBtnSpan.textContent = 'Generate Caption';
        // Re-enable if there is still context
        generateCaptionBtn.disabled = !shareContextPrompt;
    }
}

async function handleShareNowClick() {
    if (!currentImageToShare) {
        alert("No image to share.");
        return;
    }

    // Check for Web Share API support
    if (!navigator.share) {
        alert("Your browser doesn't support the Web Share API. Please download the image to share it manually.");
        return;
    }
    
    const caption = shareCaptionInput.value;
    const format = currentImageToShare.includes('jpeg') ? 'jpg' : 'png';
    const imageFile = await dataURLtoFile(currentImageToShare, `design-export.${format}`);

    if (!imageFile) {
        alert("Could not prepare image for sharing.");
        return;
    }
    
    const shareData = {
        text: caption,
        files: [imageFile],
        title: 'My AI-Generated Design'
    };

    // Check if the browser can share this data
    if (!navigator.canShare(shareData)) {
        alert("Your browser cannot share this type of file.");
        return;
    }

    try {
        await navigator.share(shareData);
        console.log("Shared successfully");
        closeShareModal();
    } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
            console.error("Sharing failed:", error);
            alert(`Sharing failed: ${error.message}`);
        }
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

    // Update the image source in the main state array as well
    if (selectedStudioImageId !== null) {
        const imageIndex = uploadedStudioImages.findIndex(img => img.id === selectedStudioImageId);
        if (imageIndex > -1) {
            uploadedStudioImages[imageIndex].src = imageDataUrl;
            renderUploadedImageThumbnails(); // Re-render to show updated thumb if needed
        }
    }
    
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

function renderUploadedImageThumbnails() {
    uploadedImagesList.innerHTML = ''; // Clear existing thumbnails
    if (uploadedStudioImages.length > 0) {
        uploadedImagesContainer.classList.remove('hidden');
    } else {
        uploadedImagesContainer.classList.add('hidden');
    }

    // Show merge controls if there are 2 or more images
    mergeControls.classList.toggle('hidden', uploadedStudioImages.length < 2);

    uploadedStudioImages.forEach(image => {
        const thumbItem = document.createElement('div');
        thumbItem.className = 'thumbnail-item';

        const img = document.createElement('img');
        img.src = image.src;
        img.dataset.id = String(image.id);
        img.alt = `Uploaded image ${image.id}`;
        img.classList.toggle('selected', image.id === selectedStudioImageId);
        img.addEventListener('click', () => handleThumbnailClick(image.id));

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-thumb-btn';
        removeBtn.innerHTML = '&times;';
        removeBtn.ariaLabel = `Remove image ${image.id}`;
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleRemoveThumbnail(image.id);
        });

        thumbItem.appendChild(img);
        thumbItem.appendChild(removeBtn);
        uploadedImagesList.appendChild(thumbItem);
    });
}

function setActiveStudioImage(src: string | null) {
    if (src) {
        studioCurrentImageSrc = src;
        // Reset history for the newly selected image
        studioImageHistory = [src];
        studioHistoryIndex = 0;
        
        studioResultContainer.classList.remove('hidden');
        studioOutputPlaceholder.classList.add('hidden');
        studioDownloadControls.classList.remove('hidden');
        adjustmentControls.classList.remove('hidden');
        aiEditSection.classList.remove('hidden');

        renderCurrentImageFromHistory();
    } else {
        // No image is selected, hide everything
        studioCurrentImageSrc = null;
        studioResultContainer.classList.add('hidden');
        studioOutputPlaceholder.classList.remove('hidden');
        studioDownloadControls.classList.add('hidden');
        adjustmentControls.classList.add('hidden');
        aiEditSection.classList.add('hidden');
    }
}

function handleThumbnailClick(id: number) {
    if (id === selectedStudioImageId) return; // Already selected

    selectedStudioImageId = id;
    const selectedImage = uploadedStudioImages.find(img => img.id === id);
    if (selectedImage) {
        setActiveStudioImage(selectedImage.src);
    }
    renderUploadedImageThumbnails(); // Re-render to update selection style
}

function handleRemoveThumbnail(idToRemove: number) {
    uploadedStudioImages = uploadedStudioImages.filter(img => img.id !== idToRemove);

    if (selectedStudioImageId === idToRemove) {
        // If the removed image was the selected one, select the first one remaining
        if (uploadedStudioImages.length > 0) {
            selectedStudioImageId = uploadedStudioImages[0].id;
            setActiveStudioImage(uploadedStudioImages[0].src);
        } else {
            selectedStudioImageId = null;
            setActiveStudioImage(null);
        }
    }
    
    renderUploadedImageThumbnails();
}

function handleStudioImageUpload(files: FileList | null) {
    if (files && files.length > 0) {
        const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (validFiles.length === 0) {
             showError('Please select valid image files (JPG, PNG, WEBP).', studioErrorMessage);
             return;
        }

        let firstImageAdded = false;

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataUrl = e.target?.result as string;
                const newImage = { id: nextImageId++, src: imageDataUrl };
                uploadedStudioImages.push(newImage);

                // If no image is currently selected, select the first one we upload
                if (!firstImageAdded) {
                    selectedStudioImageId = newImage.id;
                    setActiveStudioImage(newImage.src);
                    firstImageAdded = true;
                }
                renderUploadedImageThumbnails();
            };
            reader.readAsDataURL(file);
        });
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
            showError("The AI couldn't enhance the description. Please try a different one.", studioErrorMessage);
        }
    } catch (error) {
        parseAndShowError(error, studioErrorMessage);
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
            showError("The AI couldn't apply the edit. Please try a different description.", studioErrorMessage);
        }
    } catch (error) {
        parseAndShowError(error, studioErrorMessage);
    } finally {
        isApplyingAiEdit = false;
        applyAiEditBtn.disabled = false;
        applyAiEditBtn.classList.remove('loading');
        studioLoader.classList.add('hidden');
        studioResultContainer.classList.remove('hidden'); // Show result container again
    }
}

async function handleMergeImagesClick() {
    if (isMerging || uploadedStudioImages.length < 2) return;

    const prompt = mergePromptInput.value.trim();
    if (!prompt) {
        showError("Please describe how you want to merge the images.", studioErrorMessage);
        return;
    }

    isMerging = true;
    mergeImagesBtn.disabled = true;
    mergeImagesBtn.classList.add('loading');
    studioLoader.classList.remove('hidden');
    studioLoaderText.textContent = 'Merging images with AI...';
    studioResultContainer.classList.add('hidden');
    studioErrorMessage.classList.add('hidden');

    try {
        const parts: ({ text: string } | { inlineData: { data: string, mimeType: string } })[] = [];
        parts.push({ text: prompt });

        for (const image of uploadedStudioImages) {
            const base64ImageData = image.src.split(',')[1];
            const mimeType = image.src.substring(image.src.indexOf(':') + 1, image.src.indexOf(';'));
            parts.push({ inlineData: { data: base64ImageData, mimeType: mimeType } });
        }
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
        });

        let foundImage = false;
        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const newBase64 = part.inlineData.data;
                    const newMimeType = part.inlineData.mimeType;
                    const newImageUrl = `data:${newMimeType};base64,${newBase64}`;
                    
                    // Replace all uploaded images with the new merged one
                    const mergedImage = { id: nextImageId++, src: newImageUrl };
                    uploadedStudioImages = [mergedImage];
                    selectedStudioImageId = mergedImage.id;

                    setActiveStudioImage(mergedImage.src);
                    renderUploadedImageThumbnails();

                    foundImage = true;
                    break;
                }
            }
        }
        
        if (!foundImage) {
            showError("The AI couldn't merge the images. Please try a different prompt.", studioErrorMessage);
        }

    } catch (error) {
        parseAndShowError(error, studioErrorMessage);
    } finally {
        isMerging = false;
        mergeImagesBtn.disabled = false;
        mergeImagesBtn.classList.remove('loading');
        studioLoader.classList.add('hidden');
        if (studioCurrentImageSrc) {
            studioResultContainer.classList.remove('hidden');
        }
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
            showError("The AI couldn't enhance the description. Please try a different one.", studioErrorMessage);
        }
    } catch (error) {
        parseAndShowError(error, studioErrorMessage);
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
        showError("Please enter a description for the image you want to create.", studioErrorMessage);
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
            
            // Add the new image to the uploaded list and select it
            const newImage = { id: nextImageId++, src: newImageDataUrl };
            uploadedStudioImages.push(newImage);
            selectedStudioImageId = newImage.id;
            setActiveStudioImage(newImage.src);
            renderUploadedImageThumbnails();
            
            // Switch to the edit tab to show the new image and controls
            handleStudioTabSwitch('edit');

        } else {
            showError("The AI couldn't generate an image from that prompt. Please try refining it.", studioErrorMessage);
        }

    } catch (error) {
        parseAndShowError(error, studioErrorMessage);
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
        showError("There is no image to export.", studioErrorMessage);
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
        showError("Sorry, the image could not be exported.", studioErrorMessage);
    } finally {
        studioDownloadBtn.textContent = originalButtonText;
        studioDownloadBtn.classList.remove('disabled');
    }
}

// --- SOCIAL MEDIA MANAGER FUNCTIONS ---

// --- Business Management ---
function saveSocialPrefs() {
    const prefs = { businesses, scheduledPosts, selectedBusinessId };
    localStorage.setItem(SOCIAL_PREFERENCES_KEY, JSON.stringify(prefs));
}

function loadSocialPrefs() {
    const prefsString = localStorage.getItem(SOCIAL_PREFERENCES_KEY);
    if (prefsString) {
        const prefs = JSON.parse(prefsString);
        businesses = prefs.businesses || [];
        scheduledPosts = (prefs.scheduledPosts || []).map((p: any) => ({...p, scheduleTime: new Date(p.scheduleTime)}));
        selectedBusinessId = prefs.selectedBusinessId || (businesses.length > 0 ? businesses[0].id : null);
    } else {
        // Add default if none exist
        businesses = [{ id: 1, name: 'Default Business', socials: {} }];
        selectedBusinessId = 1;
    }
    renderBusinessSelect();
    renderScheduledPosts();
}

function renderBusinessSelect() {
    businessSelect.innerHTML = '';
    if (businesses.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'No businesses configured';
        businessSelect.appendChild(option);
        businessSelect.disabled = true;
    } else {
        businessSelect.disabled = false;
        businesses.forEach(b => {
            const option = document.createElement('option');
            option.value = String(b.id);
            option.textContent = b.name;
            if (b.id === selectedBusinessId) {
                option.selected = true;
            }
            businessSelect.appendChild(option);
        });
    }
}

function openBusinessManagerModal() {
    renderBusinessManagerList();
    resetBusinessForm();
    businessManagerModal.classList.remove('hidden');
}

function closeBusinessManagerModal() {
    businessManagerModal.classList.add('hidden');
}

function renderBusinessManagerList() {
    businessListContainer.innerHTML = '';
    businesses.forEach(business => {
        const item = document.createElement('div');
        item.className = 'business-item';
        item.innerHTML = `
            <span>${business.name}</span>
            <div class="pref-buttons">
                <button class="btn btn-secondary edit-btn" data-id="${business.id}">Edit</button>
                <button class="btn btn-secondary delete-btn" data-id="${business.id}">Delete</button>
            </div>
        `;
        businessListContainer.appendChild(item);
    });
}

function resetBusinessForm() {
    businessForm.reset();
    businessIdInput.value = '';
}

function handleEditBusinessClick(id: number) {
    const business = businesses.find(b => b.id === id);
    if (business) {
        businessIdInput.value = String(business.id);
        businessNameInput.value = business.name;
        businessSocialGeneralInput.value = business.socials.general || '';
        businessSocialLinkedinInput.value = business.socials.linkedin || '';
        businessSocialTwitterInput.value = business.socials.twitter || '';
        businessSocialInstagramInput.value = business.socials.instagram || '';
        businessSocialFacebookInput.value = business.socials.facebook || '';
        businessSocialRedditInput.value = business.socials.reddit || '';
    }
}

function handleDeleteBusinessClick(id: number) {
    if (confirm('Are you sure you want to delete this business?')) {
        businesses = businesses.filter(b => b.id !== id);
        if (selectedBusinessId === id) {
            selectedBusinessId = businesses.length > 0 ? businesses[0].id : null;
        }
        saveSocialPrefs();
        renderBusinessSelect();
        renderBusinessManagerList();
    }
}

function handleBusinessFormSubmit(event: Event) {
    event.preventDefault();
    const id = parseInt(businessIdInput.value);
    const businessData = {
        name: businessNameInput.value,
        socials: {
            general: businessSocialGeneralInput.value,
            linkedin: businessSocialLinkedinInput.value,
            twitter: businessSocialTwitterInput.value,
            instagram: businessSocialInstagramInput.value,
            facebook: businessSocialFacebookInput.value,
            reddit: businessSocialRedditInput.value,
        }
    };

    if (id) {
        businesses = businesses.map(b => b.id === id ? { ...b, ...businessData } : b);
    } else {
        const newBusiness = { ...businessData, id: Date.now() };
        businesses.push(newBusiness);
        selectedBusinessId = newBusiness.id;
    }
    saveSocialPrefs();
    renderBusinessSelect();
    renderBusinessManagerList();
    resetBusinessForm();
}

// --- Social Content Generation ---

function openBrainstormModal() {
    brainstormResultsContainer.innerHTML = ''; // Clear previous results
    brainstormModal.classList.remove('hidden');
}
function closeBrainstormModal() {
    brainstormModal.classList.add('hidden');
}

async function handleBrainstormClick() {
    if (isBrainstorming) return;
    isBrainstorming = true;
    
    const generateBtnOriginalText = generateBrainstormIdeasBtn.innerHTML;
    generateBrainstormIdeasBtn.innerHTML = `<div class="loading-spinner" style="width:20px;height:20px;border-width:2px;"></div>`;
    generateBrainstormIdeasBtn.disabled = true;
    
    try {
        const business = businesses.find(b => b.id === selectedBusinessId);
        const prompt = `Brainstorm 5 engaging social media post ideas for a business named "${business?.name}". The ideas should be creative and tailored to a general audience. Format the output as a numbered list.`;
        
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        const ideasText = response.text.trim();
        
        brainstormResultsContainer.innerHTML = ''; // Clear before adding new ideas
        ideasText.split(/\d+\.\s/g).filter(idea => idea.trim()).forEach(idea => {
            const ideaEl = document.createElement('div');
            ideaEl.className = 'brainstorm-idea';
            ideaEl.textContent = idea.trim();
            ideaEl.onclick = () => {
                socialTopicInput.value = idea.trim();
                closeBrainstormModal();
            };
            brainstormResultsContainer.appendChild(ideaEl);
        });

    } catch(error) {
        parseAndShowError(error, socialErrorMessage);
    } finally {
        isBrainstorming = false;
        generateBrainstormIdeasBtn.innerHTML = generateBtnOriginalText;
        generateBrainstormIdeasBtn.disabled = false;
    }
}

function openReplyModal() {
    replyGeneratorModal.classList.remove('hidden');
    replyResultsContainer.innerHTML = '';
    replyOriginalText.value = '';
}
function closeReplyModal() {
    replyGeneratorModal.classList.add('hidden');
}

async function handleGenerateReplies() {
    if(isGeneratingReplies || !replyOriginalText.value.trim()) return;
    
    isGeneratingReplies = true;
    const generateBtnOriginalText = generateReplyBtn.innerHTML;
    generateReplyBtn.innerHTML = `<div class="loading-spinner" style="width:20px;height:20px;border-width:2px;"></div>`;
    generateReplyBtn.disabled = true;
    
    try {
        const tone = replyToneSelect.value;
        const originalPost = replyOriginalText.value;
        const prompt = `Generate 3 potential replies to the following social media comment/post. The replies should be in a ${tone} tone. The original comment is:\n\n"${originalPost}"`;

        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        const repliesText = response.text.trim();
        
        replyResultsContainer.innerHTML = ''; // Clear before adding new replies
        repliesText.split(/\d+\.\s/g).filter(reply => reply.trim()).forEach(reply => {
            const replyEl = document.createElement('div');
            replyEl.className = 'generated-reply';
            replyEl.textContent = reply.trim();
            replyEl.onclick = () => {
                navigator.clipboard.writeText(reply.trim());
                alert('Reply copied to clipboard!');
            };
            replyResultsContainer.appendChild(replyEl);
        });

    } catch(error) {
        parseAndShowError(error, socialErrorMessage);
    } finally {
        isGeneratingReplies = false;
        generateReplyBtn.innerHTML = generateBtnOriginalText;
        generateReplyBtn.disabled = false;
    }
}

function openRefineModal(platform: string) {
    const content = generatedSocialContent.find(c => c.platform === platform);
    if (!content) return;

    postToRefine = { platform: content.platform, text: content.text };
    refineOriginalText.textContent = content.text;
    refineCustomInstruction.value = '';

    // Reset selection state of preset buttons
    refineActionsContainer.querySelectorAll('.style-chip').forEach(chip => {
        chip.classList.remove('selected');
    });

    refinePostModal.classList.remove('hidden');
}

function closeRefineModal() {
    refinePostModal.classList.add('hidden');
    postToRefine = null;
}

async function handleRefinePostClick() {
    if (isRefiningPost || !postToRefine) return;

    const selectedChip = refineActionsContainer.querySelector('.style-chip.selected');
    const instruction = refineCustomInstruction.value.trim() || selectedChip?.getAttribute('data-instruction');

    if (!instruction) {
        showError("Please select or enter a refinement instruction.", socialErrorMessage);
        return;
    }
    
    isRefiningPost = true;
    refineNowBtn.disabled = true;
    refineNowBtn.classList.add('loading');
    
    try {
        const { platform, text } = postToRefine;
        const prompt = `Refine the following social media post for ${platform}. The original post is:\n\n"${text}"\n\nPlease apply the following instruction: "${instruction}". Respond with ONLY the refined post text.`;
        
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        const refinedText = response.text.trim();
        
        // Find the index and update the content in the main array
        const postIndex = generatedSocialContent.findIndex(p => p.platform === platform);
        if (postIndex > -1) {
            generatedSocialContent[postIndex].text = refinedText;
        }

        renderGeneratedSocialPosts();
        closeRefineModal();

    } catch(error) {
        parseAndShowError(error, socialErrorMessage);
    } finally {
        isRefiningPost = false;
        refineNowBtn.disabled = false;
        refineNowBtn.classList.remove('loading');
    }
}

function handleSocialTabSwitch(target: 'create' | 'scheduled') {
    socialTabCreate.classList.toggle('active', target === 'create');
    socialTabScheduled.classList.toggle('active', target === 'scheduled');
    socialCreatePanel.classList.toggle('active', target === 'create');
    socialScheduledPanel.classList.toggle('active', target === 'scheduled');
}

function renderScheduledPosts() {
    scheduledPostsContainer.innerHTML = '';
    if (scheduledPosts.length === 0) {
        scheduledPostsContainer.innerHTML = '<p>No posts scheduled yet.</p>';
        return;
    }

    const sortedPosts = [...scheduledPosts].sort((a, b) => a.scheduleTime.getTime() - b.scheduleTime.getTime());
    
    sortedPosts.forEach(post => {
        const postEl = document.createElement('div');
        postEl.className = 'scheduled-post-item';
        const scheduleTime = post.scheduleTime.toLocaleString();
        postEl.innerHTML = `
            <div class="scheduled-post-info">
                <h5>${post.businessName} - ${post.platform}</h5>
                <p><strong>Scheduled for:</strong> ${scheduleTime}</p>
                <p>${post.text}</p>
            </div>
            <div class="scheduled-post-actions">
                <button class="btn btn-secondary delete-scheduled-btn" data-id="${post.id}">Delete</button>
            </div>
        `;
        scheduledPostsContainer.appendChild(postEl);
    });
}

function renderSocialPlatforms() {
    socialPlatformsContainer.innerHTML = '';
    platforms.forEach(platform => {
        const chip = document.createElement('button');
        chip.className = 'style-chip';
        chip.dataset.platform = platform.name;
        chip.setAttribute('role', 'checkbox');
        chip.setAttribute('aria-checked', 'false');
        chip.innerHTML = `${platform.icon} <span>${platform.name}</span>`;

        const svg = chip.querySelector('svg');
        if (svg) {
            svg.setAttribute('width', '20');
            svg.setAttribute('height', '20');
            svg.style.marginRight = '8px';
            svg.style.flexShrink = '0';
        }
        
        if (selectedPlatforms.has(platform.name)) {
            chip.classList.add('selected');
            chip.setAttribute('aria-checked', 'true');
        }

        chip.addEventListener('click', () => handlePlatformToggle(platform.name));
        socialPlatformsContainer.appendChild(chip);
    });
}

function handlePlatformToggle(platformName: string) {
    const chip = socialPlatformsContainer.querySelector(`[data-platform="${platformName}"]`) as HTMLButtonElement;
    if (selectedPlatforms.has(platformName)) {
        selectedPlatforms.delete(platformName);
        chip.classList.remove('selected');
        chip.setAttribute('aria-checked', 'false');
    } else {
        selectedPlatforms.add(platformName);
        chip.classList.add('selected');
        chip.setAttribute('aria-checked', 'true');
    }
}

function handleSelectAllPlatforms() {
    const allSelected = selectedPlatforms.size === platforms.length;
    
    platforms.forEach(platform => {
        const chip = socialPlatformsContainer.querySelector(`[data-platform="${platform.name}"]`) as HTMLButtonElement;
        if (allSelected) {
            selectedPlatforms.delete(platform.name);
            chip.classList.remove('selected');
            chip.setAttribute('aria-checked', 'false');
        } else {
            selectedPlatforms.add(platform.name);
            chip.classList.add('selected');
            chip.setAttribute('aria-checked', 'true');
        }
    });
}

async function handleGenerateSocialClick() {
    if (isGeneratingSocial || selectedPlatforms.size === 0 || !socialTopicInput.value.trim()) {
        showError("Please select a business, topic, and at least one platform.", socialErrorMessage);
        return;
    }

    isGeneratingSocial = true;
    generateSocialBtn.disabled = true;
    generateSocialBtn.classList.add('loading');
    socialLoader.classList.remove('hidden');
    socialOutputPlaceholder.classList.add('hidden');
    socialResultsContainer.innerHTML = '';
    socialScheduleControls.classList.add('hidden');
    socialErrorMessage.classList.add('hidden');

    try {
        const platformArr = Array.from(selectedPlatforms);
        const needsImage = platformArr.some(p => ['Instagram', 'Facebook', 'LinkedIn'].includes(p));
        let imageUrl: string | null = null;
        
        if (needsImage) {
            const imagePrompt = `A modern, professional image for a social media post about: "${socialTopicInput.value.trim()}". Avoid text.`;
            const imageResponse = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: imagePrompt,
                config: { numberOfImages: 1, outputMimeType: 'image/png' },
            });
            if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
                const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
                imageUrl = `data:image/png;base64,${base64ImageBytes}`;
            } else {
                throw new Error('Image generation failed.');
            }
        }

        const postPromises = platformArr.map(platform => generateSocialPostText(platform));
        const postTexts = await Promise.all(postPromises);

        generatedSocialContent = platformArr.map((platform, i) => ({
            platform: platform,
            text: postTexts[i],
            image: ['Instagram', 'Facebook', 'LinkedIn'].includes(platform) ? imageUrl : null,
        }));

        renderGeneratedSocialPosts();

    } catch (error) {
        parseAndShowError(error, socialErrorMessage);
    } finally {
        isGeneratingSocial = false;
        generateSocialBtn.disabled = false;
        generateSocialBtn.classList.remove('loading');
        socialLoader.classList.add('hidden');
    }
}

async function generateSocialPostText(platform: string): Promise<string> {
    const business = businesses.find(b => b.id === selectedBusinessId);
    const tone = socialToneSelect.value;
    const topic = socialTopicInput.value.trim();
    const platformInfo = platforms.find(p => p.name === platform);
    const platformKey = platformInfo?.key || 'general';
    const link = business?.socials[platformKey] || business?.socials.general || '';

    const context = `For a business named "${business?.name}". ${link ? `Their relevant link is "${link}".` : ''}`;
    const prompt = `Generate a ${tone} social media post for ${platform} about: "${topic}". ${context} Tailor the content and format specifically for the ${platform} platform. For X/Twitter, be concise and use hashtags. For LinkedIn, be professional. For Instagram, write a captivating caption. For Facebook, be conversational. For Reddit, use a "Title: [Your Title]\\n\\nBody: [Your Body Text]" format.`;
    
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text.trim();
}

function renderGeneratedSocialPosts() {
    socialResultsContainer.innerHTML = '';
    if (generatedSocialContent.length === 0) {
        socialOutputPlaceholder.classList.remove('hidden');
        socialScheduleControls.classList.add('hidden');
        return;
    }

    generatedSocialContent.forEach(content => {
        const platformInfo = platforms.find(p => p.name === content.platform);
        const card = document.createElement('div');
        card.className = 'social-post-card';
        
        let imageHtml = '';
        if (content.image) {
            imageHtml = `<img src="${content.image}" alt="Generated image for social post" class="social-post-image">`;
        }
        
        const cardHeaderIcon = platformInfo?.icon ? platformInfo.icon.replace('<svg', '<svg width="24" height="24"') : '';

        card.innerHTML = `
            <div class="social-post-header">
                ${cardHeaderIcon}
                <h4>${content.platform}</h4>
            </div>
            <div class="social-post-content">
                <p>${content.text.replace(/\n/g, '<br>')}</p>
                ${imageHtml}
            </div>
            <div class="social-post-actions">
                 <button class="btn btn-secondary refine-post-btn" data-platform="${content.platform}">Refine</button>
            </div>
        `;
        socialResultsContainer.appendChild(card);
    });

    socialScheduleControls.classList.remove('hidden');
}

async function handleSuggestTimeClick() {
    if (selectedPlatforms.size !== 1) {
        alert("Please select exactly one platform to get a time suggestion.");
        return;
    }
    const platform = Array.from(selectedPlatforms)[0];
    const topic = socialTopicInput.value.trim();
    const prompt = `As a social media expert, what is the absolute best day and time to post on ${platform} about "${topic}" to maximize engagement? Consider typical user behavior. Respond ONLY with a date-time string in the format YYYY-MM-DDTHH:mm for the next optimal slot this coming week. Current date: ${new Date().toISOString()}`;
    
    try {
        const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
        const timeStr = response.text.trim();
        const suggestedDate = new Date(timeStr);
        if (!isNaN(suggestedDate.getTime())) {
             scheduleDateInput.value = timeStr;
        } else {
            throw new Error("Invalid date format from API.");
        }
    } catch (err) {
        console.error("Failed to suggest time:", err);
        alert("Could not suggest a time. Please try again.");
    }
}

function handleSchedulePostsClick() {
    if (generatedSocialContent.length === 0) return;
    const business = businesses.find(b => b.id === selectedBusinessId);
    
    const newPosts = generatedSocialContent.map(post => ({
        id: Date.now() + Math.random(),
        ...post,
        topic: socialTopicInput.value.trim(),
        businessName: business?.name || 'Unassigned',
        scheduleTime: new Date(scheduleDateInput.value),
    }));

    scheduledPosts.push(...newPosts);
    saveSocialPrefs();
    renderScheduledPosts();
    
    generatedSocialContent = [];
    renderGeneratedSocialPosts();
    handleSocialTabSwitch('scheduled');
}

// --- INITIALIZATION ---
function initialize() {
    // --- Assign all DOM elements ---

    // -- App Shell --
    themeSwitcherBtn = document.getElementById('theme-switcher') as HTMLButtonElement;
    tabDesignGenerator = document.getElementById('tab-design-generator') as HTMLButtonElement;
    tabImageStudio = document.getElementById('tab-image-studio') as HTMLButtonElement;
    tabSocialManager = document.getElementById('tab-social-manager') as HTMLButtonElement;
    designGeneratorPage = document.getElementById('design-generator-page') as HTMLDivElement;
    imageStudioPage = document.getElementById('image-studio-page') as HTMLDivElement;
    socialMediaManagerPage = document.getElementById('social-media-manager-page') as HTMLDivElement;

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
    downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
    shareBtn = document.getElementById('share-btn') as HTMLButtonElement;
    formatSelect = document.getElementById('format-select') as HTMLSelectElement;
    errorMessage = document.getElementById('error-message') as HTMLDivElement;
    cropModal = document.getElementById('crop-modal') as HTMLDivElement;
    imageToCrop = document.getElementById('image-to-crop') as HTMLImageElement;
    applyCropBtn = document.getElementById('apply-crop-btn') as HTMLButtonElement;
    cancelCropBtn = document.getElementById('cancel-crop-btn') as HTMLButtonElement;

    // -- Share Modal --
    shareModal = document.getElementById('share-modal') as HTMLDivElement;
    shareImagePreview = document.getElementById('share-image-preview') as HTMLImageElement;
    shareCaptionInput = document.getElementById('share-caption-input') as HTMLTextAreaElement;
    generateCaptionBtn = document.getElementById('generate-caption-btn') as HTMLButtonElement;
    shareNowBtn = document.getElementById('share-now-btn') as HTMLButtonElement;
    cancelShareBtn = document.getElementById('cancel-share-btn') as HTMLButtonElement;

    // -- Image Studio --
    studioTabEdit = document.getElementById('studio-tab-edit') as HTMLButtonElement;
    studioTabGenerate = document.getElementById('studio-tab-generate') as HTMLButtonElement;
    studioEditPanel = document.getElementById('studio-edit-panel') as HTMLDivElement;
    studioGeneratePanel = document.getElementById('studio-generate-panel') as HTMLDivElement;
    studioImageUploadArea = document.getElementById('studio-image-upload-area') as HTMLDivElement;
    studioLogoUpload = document.getElementById('studio-logo-upload') as HTMLInputElement;
    studioUploadPlaceholder = document.getElementById('studio-upload-placeholder') as HTMLDivElement;
    uploadedImagesContainer = document.getElementById('uploaded-images-container') as HTMLDivElement;
    uploadedImagesList = document.getElementById('uploaded-images-list') as HTMLDivElement;
    mergeControls = document.getElementById('merge-controls') as HTMLDivElement;
    mergePromptInput = document.getElementById('merge-prompt-input') as HTMLTextAreaElement;
    mergeImagesBtn = document.getElementById('merge-images-btn') as HTMLButtonElement;
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
    studioDownloadBtn = document.getElementById('studio-download-btn') as HTMLButtonElement;
    studioShareBtn = document.getElementById('studio-share-btn') as HTMLButtonElement;
    studioErrorMessage = document.getElementById('studio-error-message') as HTMLDivElement;

    // -- Social Media Manager --
    businessSelect = document.getElementById('business-select') as HTMLSelectElement;
    manageBusinessesBtn = document.getElementById('manage-businesses-btn') as HTMLButtonElement;
    socialTopicInput = document.getElementById('social-topic-input') as HTMLTextAreaElement;
    brainstormIdeasBtn = document.getElementById('brainstorm-ideas-btn') as HTMLButtonElement;
    socialToneSelect = document.getElementById('social-tone-select') as HTMLSelectElement;
    socialPlatformsContainer = document.getElementById('social-platforms-container') as HTMLDivElement;
    selectAllPlatformsBtn = document.getElementById('select-all-platforms-btn') as HTMLButtonElement;
    generateSocialBtn = document.getElementById('generate-social-btn') as HTMLButtonElement;
    generateRepliesBtn = document.getElementById('generate-replies-btn') as HTMLButtonElement;
    socialTabCreate = document.getElementById('social-tab-create') as HTMLButtonElement;
    socialTabScheduled = document.getElementById('social-tab-scheduled') as HTMLButtonElement;
    socialCreatePanel = document.getElementById('social-create-panel') as HTMLDivElement;
    socialScheduledPanel = document.getElementById('social-scheduled-panel') as HTMLDivElement;
    socialOutputPlaceholder = document.getElementById('social-output-placeholder') as HTMLDivElement;
    socialLoader = document.getElementById('social-loader') as HTMLDivElement;
    socialResultsContainer = document.getElementById('social-results-container') as HTMLDivElement;
    socialScheduleControls = document.getElementById('social-schedule-controls') as HTMLDivElement;
    scheduleDateInput = document.getElementById('schedule-date-input') as HTMLInputElement;
    suggestTimeBtn = document.getElementById('suggest-time-btn') as HTMLButtonElement;
    schedulePostsBtn = document.getElementById('schedule-posts-btn') as HTMLButtonElement;
    socialErrorMessage = document.getElementById('social-error-message') as HTMLDivElement;
    scheduledPostsContainer = document.getElementById('scheduled-posts-container') as HTMLDivElement;
    businessManagerModal = document.getElementById('business-manager-modal') as HTMLDivElement;
    businessListContainer = document.getElementById('business-list-container') as HTMLDivElement;
    businessForm = document.getElementById('business-form') as HTMLFormElement;
    businessIdInput = document.getElementById('business-id-input') as HTMLInputElement;
    businessNameInput = document.getElementById('business-name-input') as HTMLInputElement;
    businessSocialGeneralInput = document.getElementById('business-social-general-input') as HTMLInputElement;
    businessSocialLinkedinInput = document.getElementById('business-social-linkedin-input') as HTMLInputElement;
    businessSocialTwitterInput = document.getElementById('business-social-twitter-input') as HTMLInputElement;
    businessSocialInstagramInput = document.getElementById('business-social-instagram-input') as HTMLInputElement;
    businessSocialFacebookInput = document.getElementById('business-social-facebook-input') as HTMLInputElement;
    businessSocialRedditInput = document.getElementById('business-social-reddit-input') as HTMLInputElement;
    cancelBusinessEditBtn = document.getElementById('cancel-business-edit-btn') as HTMLButtonElement;
    brainstormModal = document.getElementById('brainstorm-modal') as HTMLDivElement;
    brainstormResultsContainer = document.getElementById('brainstorm-results-container') as HTMLDivElement;
    closeBrainstormBtn = document.getElementById('close-brainstorm-btn') as HTMLButtonElement;
    generateBrainstormIdeasBtn = document.getElementById('generate-brainstorm-ideas-btn') as HTMLButtonElement;
    replyGeneratorModal = document.getElementById('reply-generator-modal') as HTMLDivElement;
    replyOriginalText = document.getElementById('reply-original-text') as HTMLTextAreaElement;
    replyToneSelect = document.getElementById('reply-tone-select') as HTMLSelectElement;
    replyResultsContainer = document.getElementById('reply-results-container') as HTMLDivElement;
    closeReplyModalBtn = document.getElementById('close-reply-modal-btn') as HTMLButtonElement;
    generateReplyBtn = document.getElementById('generate-reply-btn') as HTMLButtonElement;
    refinePostModal = document.getElementById('refine-post-modal') as HTMLDivElement;
    refineOriginalText = document.getElementById('refine-original-text') as HTMLParagraphElement;
    refineActionsContainer = document.getElementById('refine-actions-container') as HTMLDivElement;
    refineCustomInstruction = document.getElementById('refine-custom-instruction') as HTMLTextAreaElement;
    cancelRefineBtn = document.getElementById('cancel-refine-btn') as HTMLButtonElement;
    refineNowBtn = document.getElementById('refine-now-btn') as HTMLButtonElement;


    // --- Now that we know generateBtn exists, we can safely query its inner elements. ---
    generateBtnSpan = generateBtn.querySelector('span') as HTMLSpanElement;

    // --- Attach all event listeners ---
    
    // -- App Shell --
    themeSwitcherBtn.addEventListener('click', toggleTheme);
    tabDesignGenerator.addEventListener('click', () => switchAppTab('design'));
    tabImageStudio.addEventListener('click', () => switchAppTab('studio'));
    tabSocialManager.addEventListener('click', () => switchAppTab('social'));

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
    shareBtn.addEventListener('click', () => openShareModal('design'));
    clearPrefsBtn.addEventListener('click', handleClearPrefs);
    
    // -- Share Modal Listeners --
    generateCaptionBtn.addEventListener('click', handleGenerateCaptionClick);
    shareNowBtn.addEventListener('click', handleShareNowClick);
    cancelShareBtn.addEventListener('click', closeShareModal);
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) closeShareModal();
    });

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
    mergeImagesBtn.addEventListener('click', handleMergeImagesClick);

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
    studioShareBtn.addEventListener('click', () => openShareModal('studio'));

    // --- Social Media Manager Event Listeners ---
    manageBusinessesBtn.addEventListener('click', openBusinessManagerModal);
    businessManagerModal.addEventListener('click', (e) => { if (e.target === businessManagerModal) closeBusinessManagerModal(); });
    businessForm.addEventListener('submit', handleBusinessFormSubmit);
    cancelBusinessEditBtn.addEventListener('click', resetBusinessForm);
    businessListContainer.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const editBtn = target.closest('.edit-btn');
        const deleteBtn = target.closest('.delete-btn');
        if (editBtn) {
            handleEditBusinessClick(parseInt(editBtn.getAttribute('data-id')!));
        }
        if (deleteBtn) {
            handleDeleteBusinessClick(parseInt(deleteBtn.getAttribute('data-id')!));
        }
    });

    businessSelect.addEventListener('change', () => {
        selectedBusinessId = parseInt(businessSelect.value);
        saveSocialPrefs();
    });

    brainstormIdeasBtn.addEventListener('click', openBrainstormModal);
    closeBrainstormBtn.addEventListener('click', closeBrainstormModal);
    generateBrainstormIdeasBtn.addEventListener('click', handleBrainstormClick);
    brainstormModal.addEventListener('click', (e) => { if (e.target === brainstormModal) closeBrainstormModal(); });

    generateRepliesBtn.addEventListener('click', openReplyModal);
    closeReplyModalBtn.addEventListener('click', closeReplyModal);
    generateReplyBtn.addEventListener('click', handleGenerateReplies);
    replyGeneratorModal.addEventListener('click', (e) => { if (e.target === replyGeneratorModal) closeReplyModal(); });
    
    socialTabCreate.addEventListener('click', () => handleSocialTabSwitch('create'));
    socialTabScheduled.addEventListener('click', () => handleSocialTabSwitch('scheduled'));

    selectAllPlatformsBtn.addEventListener('click', handleSelectAllPlatforms);
    generateSocialBtn.addEventListener('click', handleGenerateSocialClick);
    schedulePostsBtn.addEventListener('click', handleSchedulePostsClick);
    suggestTimeBtn.addEventListener('click', handleSuggestTimeClick);


    scheduledPostsContainer.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const deleteBtn = target.closest('.delete-scheduled-btn');
        if (deleteBtn) {
            const id = parseFloat(deleteBtn.getAttribute('data-id')!);
            scheduledPosts = scheduledPosts.filter(p => p.id !== id);
            saveSocialPrefs();
            renderScheduledPosts();
        }
    });

    socialResultsContainer.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const refineBtn = target.closest('.refine-post-btn');
        if (refineBtn) {
            const platform = refineBtn.getAttribute('data-platform');
            if (platform) {
                openRefineModal(platform);
            }
        }
    });
    
    // Refine Modal Listeners
    cancelRefineBtn.addEventListener('click', closeRefineModal);
    refineNowBtn.addEventListener('click', handleRefinePostClick);
    refinePostModal.addEventListener('click', (e) => { if (e.target === refinePostModal) closeRefineModal(); });
    refineActionsContainer.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const chip = target.closest('.style-chip');
        if (chip) {
            // Deselect other chips
            refineActionsContainer.querySelectorAll('.style-chip').forEach(c => c.classList.remove('selected'));
            // Select the clicked one
            chip.classList.add('selected');
            // Clear custom input when a chip is selected
            refineCustomInstruction.value = '';
        }
    });
    refineCustomInstruction.addEventListener('input', () => {
        // If user types in custom instruction, deselect chips
        if(refineCustomInstruction.value.trim()) {
            refineActionsContainer.querySelectorAll('.style-chip').forEach(c => c.classList.remove('selected'));
        }
    });


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
            const errorEl = socialMediaManagerPage.classList.contains('active') ? socialErrorMessage : (imageStudioPage.classList.contains('active') ? studioErrorMessage : errorMessage);
            showError(userMessage, errorEl);
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
                        const errorEl = socialMediaManagerPage.classList.contains('active') ? socialErrorMessage : (imageStudioPage.classList.contains('active') ? studioErrorMessage : errorMessage);
                        showError("Could not start voice recognition.", errorEl);
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
    loadSocialPrefs();
    renderSocialPlatforms();
    
    // Set default schedule date
    const now = new Date();
    now.setDate(now.getDate() + 1);
    scheduleDateInput.value = now.toISOString().slice(0, 16);

    const lastTab = localStorage.getItem(LAST_TAB_KEY) as 'design' | 'studio' | 'social' | null;
    if (lastTab) {
        switchAppTab(lastTab);
    }
}

// Run initialization
initialize();

export {};