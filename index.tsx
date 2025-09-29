
import { GoogleGenAI, Modality, Type } from "@google/genai";

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
// -- Auth Elements --
let authControls: HTMLDivElement;
let loginBtn: HTMLButtonElement;
let userDisplay: HTMLDivElement;
let userNameSpan: HTMLSpanElement;
let userVerificationNotice: HTMLSpanElement;
let manageUsersBtn: HTMLButtonElement;
let logoutBtn: HTMLButtonElement;
let loginModal: HTMLDivElement;
let loginTabBtn: HTMLButtonElement;
let signupTabBtn: HTMLButtonElement;
let loginTabContent: HTMLDivElement;
let signupTabContent: HTMLDivElement;
let loginForm: HTMLFormElement;
let signupForm: HTMLFormElement;
let loginEmailInput: HTMLInputElement;
let loginPasswordInput: HTMLInputElement;
let loginErrorMessage: HTMLDivElement;
let signupNameInput: HTMLInputElement;
let signupEmailInput: HTMLInputElement;
let signupPasswordInput: HTMLInputElement;
let signupErrorMessage: HTMLDivElement;
let forgotPasswordLink: HTMLButtonElement;
let googleLoginBtn: HTMLButtonElement;
let googleSignupBtn: HTMLButtonElement;
let userManagementModal: HTMLDivElement;
let userManagementList: HTMLDivElement;
let closeUserManagementBtn: HTMLButtonElement;
// -- Auto-Save Indicators --
let designSaveIndicator: HTMLDivElement;
let studioSaveIndicator: HTMLDivElement;
let socialSaveIndicator: HTMLDivElement;


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
let logoRotationSlider: HTMLInputElement;
let logoRotationValue: HTMLSpanElement;
let resetRotationBtn: HTMLButtonElement;
let logoOpacitySlider: HTMLInputElement;
let logoOpacityValue: HTMLSpanElement;
let resetOpacityBtn: HTMLButtonElement;
let paletteOptions: NodeListOf<HTMLDivElement>;
let layoutOptions: NodeListOf<HTMLDivElement>;
let backgroundOptions: NodeListOf<HTMLElement>;
let fontOptions: NodeListOf<HTMLDivElement>;
let sizeOptions: NodeListOf<HTMLDivElement>;
let textEffectOptions: NodeListOf<HTMLDivElement>;
let generateBtn: HTMLButtonElement;
let generateBtnSpan: HTMLSpanElement | null;
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
let studioImageUploadContainer: HTMLDivElement;
let studioImageUploadArea: HTMLDivElement;
let studioLogoUpload: HTMLInputElement;
let studioUploadPlaceholder: HTMLDivElement;
let studioEditControls: HTMLDivElement;
let adjustmentControls: HTMLDivElement;
let resetFiltersBtn: HTMLButtonElement;
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
let selectedLogoRotation = 0;
let selectedLogoOpacity = 100;

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
let imagePrompt: string = '';
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
let socialTopic: string = '';
let socialTone: string = 'Professional';
let selectedPlatforms = new Set<string>();
let generatedSocialContent: any[] = [];
let scheduledPosts: any[] = [];
let isGeneratingSocial = false;
let isBrainstorming = false;
let isGeneratingReplies = false;
let isRefiningPost = false;
let postToRefine: { platform: string; text: string; } | null = null;
let isSuggestingTime = false;

// Auth State
type User = {
    email: string;
    passwordHash: string;
    role: 'user' | 'admin';
    name?: string;
    isVerified: boolean;
};
let allUsers: User[] = [];
let currentUser: User | null = null;

// Auto-Save State
let autoSaveStatus: 'idle' | 'saving' | 'saved' = 'idle';
let autoSaveTimeout: number | null = null;

// Shared State
const PREFERENCES_KEY = 'flyerGeneratorPrefs';
const STUDIO_PREFERENCES_KEY = 'imageStudioPrefs';
const SOCIAL_PREFERENCES_KEY = 'socialManagerPrefs';
const THEME_KEY = 'flyergen-theme';
const LAST_TAB_KEY = 'flyergen-last-tab';
const USERS_KEY = 'flyergen-users';
const CURRENT_USER_KEY = 'flyergen-currentUser';


// --- GEMINI SETUP ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- CONSTANTS ---
const platforms = [
    { name: 'LinkedIn', key: 'linkedin', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>` },
    { name: 'X / Twitter', key: 'twitter', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>` },
    { name: 'Instagram', key: 'instagram', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>` },
    { name: 'Facebook', key: 'facebook', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>` },
    { name: 'Reddit', key: 'reddit', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm2-8.8H9c0-1.1.9-2 2-2s2 .9 2 2z"/><path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4.8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm2-8.8H9c0-1.1.9-2 2-2s2 .9 2 2zM16 12c0 .8-.4 1.5-.9 1.9.1.5.1 1.1 0 1.6-.2.6-.5 1.2-1 1.7-.5.5-1.1.8-1.7 1-.6.2-1.2.2-1.8.1-.5 0-1-.1-1.5-.3-.5-.2-1-.4-1.4-.8-.4-.4-.8-.8-1.1-1.3s-.5-1-.6-1.5c-.1-.5-.1-1.1 0-1.6.5-.4.9-1.1.9-1.9 0-1.1-.9-2-2-2H8v-2h2c1.1 0 2-.9 2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2h-1c-.6 0-1 .4-1 1s.4 1 1 1h2c1.1 0 2 .9 2 2z"/></svg>` },
];


// --- AUTO-SAVING SETUP ---
// These are initialized properly inside the initialize() function.
let debouncedSavePrefs = () => {};
let debouncedSaveStudioPrefs = () => {};
let debouncedSaveSocialPrefs = () => {};

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
    pages.forEach(page => page.classList.remove('active'));

    if (targetTab === 'design') {
        tabDesignGenerator.classList.add('active');
        designGeneratorPage.classList.add('active');
    } else if (targetTab === 'studio') {
        tabImageStudio.classList.add('active');
        imageStudioPage.classList.add('active');
    } else if (targetTab === 'social') {
        // FIX: The variable 'tabManager' was not defined. It should be 'tabSocialManager'.
        tabSocialManager.classList.add('active');
        socialMediaManagerPage.classList.add('active');
    }

    localStorage.setItem(LAST_TAB_KEY, targetTab);
}

// --- PREFERENCES & AUTO-SAVING ---

function setAutoSaveStatus(status: 'idle' | 'saving' | 'saved') {
    const activeIndicators: HTMLDivElement[] = [];
    if (designGeneratorPage.classList.contains('active')) activeIndicators.push(designSaveIndicator);
    if (imageStudioPage.classList.contains('active')) activeIndicators.push(studioSaveIndicator);
    if (socialMediaManagerPage.classList.contains('active')) activeIndicators.push(socialSaveIndicator);

    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    autoSaveStatus = status;

    activeIndicators.forEach(indicator => {
        if (!indicator) return;
        if (status === 'idle') {
            indicator.classList.remove('visible', 'saved');
            indicator.textContent = '';
        } else {
            indicator.classList.add('visible');
            if (status === 'saving') {
                indicator.classList.remove('saved');
                indicator.textContent = 'Saving...';
            } else { // saved
                indicator.classList.add('saved');
                indicator.textContent = 'Saved!';
                autoSaveTimeout = window.setTimeout(() => setAutoSaveStatus('idle'), 2000);
            }
        }
    });
}

function createDebouncedSaver(saveFn: () => void, delay = 500) {
    const debouncedFn = debounce(() => {
        saveFn();
        setAutoSaveStatus('saved');
    }, delay);

    return () => {
        setAutoSaveStatus('saving');
        debouncedFn();
    };
}

function saveStudioPrefs() {
    imagePrompt = imagePromptInput.value;
    const prefs = {
        imageGenerationSize,
        imagePrompt,
        selectedImageStyles: Array.from(selectedImageStyles)
    };
    localStorage.setItem(STUDIO_PREFERENCES_KEY, JSON.stringify(prefs));
}

function loadStudioPrefs() {
    const prefsString = localStorage.getItem(STUDIO_PREFERENCES_KEY);
    if (prefsString) {
        const prefs = JSON.parse(prefsString);
        if (prefs.imageGenerationSize) {
            imageGenerationSize = prefs.imageGenerationSize;
        }
        imagePrompt = prefs.imagePrompt || '';
        selectedImageStyles = new Set(prefs.selectedImageStyles || []);
    }
    // Update UI with loaded or default values
    imagePromptInput.value = imagePrompt;
    enhanceImagePromptBtn.disabled = !imagePrompt.trim();
    styleChips.forEach(chip => {
        const style = chip.dataset.style;
        const isSelected = !!style && selectedImageStyles.has(style);
        chip.classList.toggle('selected', isSelected);
        chip.setAttribute('aria-checked', String(isSelected));
    });
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
        logoRotation: selectedLogoRotation,
        logoOpacity: selectedLogoOpacity,
        logoDataUrl: logoDataUrl,
    };
    
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
}

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

    // Load Logo Rotation & Opacity
    selectedLogoRotation = prefs.logoRotation || 0;
    logoRotationSlider.value = String(selectedLogoRotation);
    logoRotationValue.textContent = `${selectedLogoRotation}°`;
    
    selectedLogoOpacity = prefs.logoOpacity ?? 100;
    logoOpacitySlider.value = String(selectedLogoOpacity);
    logoOpacityValue.textContent = `${selectedLogoOpacity}%`;


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
    (debouncedSavePrefs as any).cancel();
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
    selectedLogoRotation = 0;
    selectedLogoOpacity = 100;

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
    logoRotationSlider.value = '0';
    logoRotationValue.textContent = '0°';
    logoOpacitySlider.value = '100';
    logoOpacityValue.textContent = '100%';


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

function handleLogoRotationChange() {
    selectedLogoRotation = parseInt(logoRotationSlider.value);
    logoRotationValue.textContent = `${selectedLogoRotation}°`;
    debouncedSavePrefs();
}

function handleLogoOpacityChange() {
    selectedLogoOpacity = parseInt(logoOpacitySlider.value);
    logoOpacityValue.textContent = `${selectedLogoOpacity}%`;
    debouncedSavePrefs();
}

function handleResetRotation() {
    selectedLogoRotation = 0;
    logoRotationSlider.value = '0';
    logoRotationValue.textContent = '0°';
    debouncedSavePrefs();
}

function handleResetOpacity() {
    selectedLogoOpacity = 100;
    logoOpacitySlider.value = '100';
    logoOpacityValue.textContent = '100%';
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
            if (selectedLogoRotation !== 0) {
                logoInstruction += ` Rotate the logo by ${selectedLogoRotation} degrees.`;
            }
            if (selectedLogoOpacity !== 100) {
                logoInstruction += ` The logo should have an opacity of ${selectedLogoOpacity}%.`;
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

/**
 * Resets all manual filter adjustments to their default state.
 */
function resetAllImageFilters() {
    // Reset state object
    studioImageFilters = { brightness: 100, contrast: 100, saturate: 100, blur: 0 };
    
    // Reset slider UI
    brightnessSlider.value = '100';
    contrastSlider.value = '100';
    saturateSlider.value = '100';
    blurSlider.value = '0';

    // Apply the reset filters to the image
    applyStudioImageFilters();
}

function renderCurrentImageFromHistory() {
    if (studioHistoryIndex < 0 || studioHistoryIndex >= studioImageHistory.length) {
        return;
    }
    const imageDataUrl = studioImageHistory[studioHistoryIndex];
    studioCurrentImageSrc = imageDataUrl;
    studioImageOutput.src = imageDataUrl;
    
    // Reset manual adjustments when history changes
    resetAllImageFilters();
    
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

        // Check if an image is active to decide what to show in edit panel
        if (studioCurrentImageSrc) {
            studioEditControls.classList.remove('hidden');
            studioImageUploadContainer.classList.add('hidden');
        } else {
            studioEditControls.classList.add('hidden');
            studioImageUploadContainer.classList.remove('hidden');
        }
    } else {
        studioTabEdit.classList.remove('active');
        studioTabGenerate.classList.add('active');
        studioEditPanel.classList.remove('active');
        studioGeneratePanel.classList.add('active');
    }
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
        
        // Show edit controls, hide upload prompt
        studioEditControls.classList.remove('hidden');
        studioImageUploadContainer.classList.add('hidden');

        renderCurrentImageFromHistory();
    } else {
        // No image is selected, hide everything
        studioCurrentImageSrc = null;
        studioResultContainer.classList.add('hidden');
        studioOutputPlaceholder.classList.remove('hidden');
        studioDownloadControls.classList.add('hidden');

        // Hide edit controls, show upload prompt
        studioEditControls.classList.add('hidden');
        studioImageUploadContainer.classList.remove('hidden');
    }
}

function handleStudioImageUpload(files: FileList | null) {
    if (files && files.length > 0) {
        const file = files[0];
        if (!file.type.startsWith('image/')) {
             showError('Please select a valid image file (JPG, PNG, WEBP).', studioErrorMessage);
             return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageDataUrl = e.target?.result as string;
            setActiveStudioImage(imageDataUrl);
            // Switch to edit tab automatically after upload
            handleStudioTabSwitch('edit');
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
            debouncedSaveStudioPrefs();
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
            
            setActiveStudioImage(newImageDataUrl);
            
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
    socialTopic = socialTopicInput.value;
    socialTone = socialToneSelect.value;
    const prefs = {
        businesses,
        scheduledPosts,
        selectedBusinessId,
        socialTopic,
        socialTone,
        selectedPlatforms: Array.from(selectedPlatforms)
    };
    localStorage.setItem(SOCIAL_PREFERENCES_KEY, JSON.stringify(prefs));
}

function loadSocialPrefs() {
    const prefsString = localStorage.getItem(SOCIAL_PREFERENCES_KEY);
    if (prefsString) {
        const prefs = JSON.parse(prefsString);
        businesses = prefs.businesses || [];
        scheduledPosts = (prefs.scheduledPosts || []).map((p: any) => ({...p, scheduleTime: new Date(p.scheduleTime)}));
        selectedBusinessId = prefs.selectedBusinessId || null;
        socialTopic = prefs.socialTopic || '';
        socialTone = prefs.socialTone || 'Professional';
        selectedPlatforms = new Set(prefs.selectedPlatforms || []);

        if (!selectedBusinessId && businesses.length > 0) {
            selectedBusinessId = businesses[0].id;
        }

        socialTopicInput.value = socialTopic;
        socialToneSelect.value = socialTone;
    } else {
        // Add default if none exist
        businesses = [{ id: 1, name: 'Default Business', socials: {} }];
        selectedBusinessId = 1;
    }
    renderBusinessSelect();
    renderScheduledPosts();
    renderSocialPlatforms();
}

function handleSocialTabSwitch(targetTab: 'create' | 'scheduled') {
    if (targetTab === 'create') {
        socialTabCreate.classList.add('active');
        socialTabScheduled.classList.remove('active');
        socialCreatePanel.classList.add('active');
        socialScheduledPanel.classList.remove('active');
    } else { // scheduled
        socialTabScheduled.classList.add('active');
        socialTabCreate.classList.remove('active');
        socialScheduledPanel.classList.add('active');
        socialCreatePanel.classList.remove('active');
    }
}

function renderSocialPlatforms() {
    if (!socialPlatformsContainer) return;
    socialPlatformsContainer.innerHTML = '';
    platforms.forEach(platform => {
        const platformEl = document.createElement('div');
        const isSelected = selectedPlatforms.has(platform.key);
        
        platformEl.className = `platform-chip ${isSelected ? 'selected' : ''}`;
        platformEl.dataset.platform = platform.key;
        platformEl.setAttribute('role', 'checkbox');
        platformEl.setAttribute('aria-checked', String(isSelected));
        
        platformEl.innerHTML = `
            ${platform.icon}
            <span class="text-sm font-medium">${platform.name}</span>
        `;
        
        platformEl.addEventListener('click', () => {
            if (selectedPlatforms.has(platform.key)) {
                selectedPlatforms.delete(platform.key);
            } else {
                selectedPlatforms.add(platform.key);
            }
            renderSocialPlatforms(); // Re-render to update styles for all chips
            debouncedSaveSocialPrefs();
        });
        socialPlatformsContainer.appendChild(platformEl);
    });
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

    // Add event listeners after rendering
    businessListContainer.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleEditBusinessClick(parseInt((e.currentTarget as HTMLElement).dataset.id!)));
    });
    businessListContainer.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleDeleteBusinessClick(parseInt((e.currentTarget as HTMLElement).dataset.id!)));
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
        debouncedSaveSocialPrefs();
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

    if (id) { // Editing existing
        const index = businesses.findIndex(b => b.id === id);
        if (index > -1) {
            businesses[index] = { ...businesses[index], ...businessData };
        }
    } else { // Adding new
        const newId = businesses.length > 0 ? Math.max(...businesses.map(b => b.id)) + 1 : 1;
        businesses.push({ id: newId, ...businessData });
        selectedBusinessId = newId;
    }

    debouncedSaveSocialPrefs();
    renderBusinessSelect();
    renderBusinessManagerList();
    resetBusinessForm();
}

function handleSelectAllPlatforms() {
    const allPlatformKeys = platforms.map(p => p.key);
    // If all are already selected, deselect all. Otherwise, select all.
    const allSelected = allPlatformKeys.every(key => selectedPlatforms.has(key));

    if (allSelected) {
        selectedPlatforms.clear();
    } else {
        allPlatformKeys.forEach(key => selectedPlatforms.add(key));
    }
    renderSocialPlatforms();
    debouncedSaveSocialPrefs();
}

async function handleGenerateSocialBtn() {
    if (isGeneratingSocial) return;

    const topic = socialTopicInput.value.trim();
    if (!topic) {
        showError('Please enter a topic for your social media posts.', socialErrorMessage);
        return;
    }
    if (selectedPlatforms.size === 0) {
        showError('Please select at least one social media platform.', socialErrorMessage);
        return;
    }

    isGeneratingSocial = true;
    generateSocialBtn.disabled = true;
    generateSocialBtn.classList.add('loading');
    socialErrorMessage.classList.add('hidden');
    socialOutputPlaceholder.classList.add('hidden');
    socialResultsContainer.innerHTML = '';
    socialLoader.classList.remove('hidden');

    try {
        const selectedBusiness = businesses.find(b => b.id === selectedBusinessId);
        let businessContext = `The business is named "${selectedBusiness?.name || 'My Business'}".`;
        if (selectedBusiness && Object.values(selectedBusiness.socials).some(s => s)) {
            businessContext += ` Business URLs: ${Object.entries(selectedBusiness.socials).filter(([,v]) => v).map(([k,v]) => `${k}: ${v}`).join(', ')}.`;
        }

        const platformList = Array.from(selectedPlatforms).join(', ');

        const prompt = `
            You are a social media content creation expert. Your task is to generate engaging posts for multiple platforms based on a user's topic and desired tone.

            **Business Context:** ${businessContext}
            **Topic:** "${topic}"
            **Tone:** ${socialTone}
            **Platforms to Generate For:** ${platformList}

            For each platform, create a tailored post that adheres to its best practices (e.g., character limits, hashtag usage, style).
            Return a JSON array where each object has "platform" (matching one of the keys: ${platforms.map(p => p.key).join(', ')}) and "text" (the generated content).
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            platform: { type: Type.STRING },
                            text: { type: Type.STRING },
                        }
                    }
                }
            },
        });

        const jsonStr = response.text.trim();
        generatedSocialContent = JSON.parse(jsonStr);
        renderGeneratedPosts();
        
    } catch (error) {
        parseAndShowError(error, socialErrorMessage);
        socialOutputPlaceholder.classList.remove('hidden');
    } finally {
        isGeneratingSocial = false;
        generateSocialBtn.disabled = false;
        generateSocialBtn.classList.remove('loading');
        socialLoader.classList.add('hidden');
    }
}

function renderGeneratedPosts() {
    socialResultsContainer.innerHTML = '';
    if (generatedSocialContent.length === 0) {
        socialScheduleControls.classList.add('hidden');
        return;
    }

    generatedSocialContent.forEach(post => {
        const platformInfo = platforms.find(p => p.key === post.platform);
        if (!platformInfo) return;

        const card = document.createElement('div');
        card.className = 'social-post-card';
        card.innerHTML = `
            <div class="social-post-header">
                ${platformInfo.icon}
                <h4>${platformInfo.name}</h4>
            </div>
            <div class="social-post-content">
                <p>${post.text}</p>
            </div>
            <div class="social-post-actions">
                <button class="btn btn-secondary btn-sm refine-post-btn">Refine</button>
                <button class="btn btn-secondary btn-sm copy-post-btn">Copy</button>
            </div>
        `;
        
        card.querySelector('.refine-post-btn')?.addEventListener('click', () => {
            postToRefine = post;
            openRefineModal();
        });

        card.querySelector('.copy-post-btn')?.addEventListener('click', (e) => {
            navigator.clipboard.writeText(post.text);
            const btn = e.currentTarget as HTMLButtonElement;
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = originalText; }, 1500);
        });

        socialResultsContainer.appendChild(card);
    });

    socialScheduleControls.classList.remove('hidden');
}

function handleSchedulePosts() {
    const scheduleTime = scheduleDateInput.value;
    if (!scheduleTime) {
        showError('Please select a date and time to schedule.', socialErrorMessage);
        return;
    }
    if (generatedSocialContent.length === 0) {
        showError('No posts to schedule. Please generate posts first.', socialErrorMessage);
        return;
    }

    const newScheduledPosts = generatedSocialContent.map(post => ({
        ...post,
        scheduleTime: new Date(scheduleTime),
        id: Date.now() + Math.random() // simple unique id
    }));

    scheduledPosts.push(...newScheduledPosts);
    debouncedSaveSocialPrefs();
    renderScheduledPosts();
    
    // Switch to scheduled tab to show the result
    handleSocialTabSwitch('scheduled');
    
    // Clear generated content
    generatedSocialContent = [];
    socialResultsContainer.innerHTML = '';
    socialScheduleControls.classList.add('hidden');
    socialOutputPlaceholder.classList.remove('hidden');
}

async function handleSuggestTime() {
    if (isSuggestingTime) return;

    const platformList = Array.from(selectedPlatforms).join(', ');
    if (!platformList) {
        showError("Please select at least one platform to get a time suggestion.", socialErrorMessage);
        return;
    }

    isSuggestingTime = true;
    suggestTimeBtn.disabled = true;
    suggestTimeBtn.classList.add('loading');

    const prompt = `Based on general best practices for social media engagement, suggest an optimal day and time to post for the following platforms: ${platformList}. Provide the single best upcoming time in ISO 8601 format (YYYY-MM-DDTHH:MM) based on the current date. For example, if it's Monday morning, you might suggest Tuesday afternoon.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const suggestedTime = response.text.trim();
        
        // Basic validation for format YYYY-MM-DDTHH:MM
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(suggestedTime)) {
            scheduleDateInput.value = suggestedTime;
        } else {
            showError("AI couldn't suggest a specific time, please set one manually.", socialErrorMessage);
        }

    } catch (error) {
        parseAndShowError(error, socialErrorMessage);
    } finally {
        isSuggestingTime = false;
        suggestTimeBtn.disabled = false;
        suggestTimeBtn.classList.remove('loading');
    }
}

function renderScheduledPosts() {
    if (!scheduledPostsContainer) return;
    scheduledPostsContainer.innerHTML = '';
    if (scheduledPosts.length === 0) {
        scheduledPostsContainer.innerHTML = `<p style="color: var(--text-secondary-color); text-align: center; padding: 2rem 0;">You have no posts scheduled.</p>`;
        return;
    }

    // Sort posts by date (upcoming first)
    const sortedPosts = [...scheduledPosts].sort((a, b) => a.scheduleTime.getTime() - b.scheduleTime.getTime());

    sortedPosts.forEach((post) => {
        const postEl = document.createElement('div');
        postEl.className = 'scheduled-post-item';
        
        const platformInfo = platforms.find(p => p.key === post.platform);
        const formattedDate = post.scheduleTime.toLocaleString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true
        });

        postEl.innerHTML = `
            <div class="platform-icon">${platformInfo?.icon || ''}</div>
            <div class="post-details">
                <div class="post-meta">
                    <strong>${platformInfo?.name || post.platform}</strong>
                    <span class="scheduled-time">${formattedDate}</span>
                </div>
                <p class="post-content">${post.text}</p>
            </div>
            <button class="btn btn-icon delete-schedule-btn" aria-label="Delete scheduled post" title="Delete Post">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        `;

        const deleteBtn = postEl.querySelector('.delete-schedule-btn');
        deleteBtn?.addEventListener('click', () => {
            scheduledPosts = scheduledPosts.filter(p => p !== post);
            debouncedSaveSocialPrefs();
            renderScheduledPosts();
        });
        
        scheduledPostsContainer.appendChild(postEl);
    });
}

function openBrainstormModal() {
    brainstormResultsContainer.innerHTML = '';
    generateBrainstormIdeasBtn.classList.remove('hidden');
    brainstormModal.classList.remove('hidden');
}

async function handleGenerateBrainstormIdeas() {
    if (isBrainstorming) return;

    isBrainstorming = true;
    generateBrainstormIdeasBtn.disabled = true;
    generateBrainstormIdeasBtn.classList.add('loading');
    brainstormResultsContainer.innerHTML = '<div class="loading-spinner" style="margin: 2rem auto;"></div>';

    const topic = socialTopicInput.value.trim() || "general marketing";
    const selectedBusiness = businesses.find(b => b.id === selectedBusinessId);
    
    const prompt = `Brainstorm 5 creative social media post ideas related to "${topic}" for a business called "${selectedBusiness?.name || 'our company'}". The tone should be ${socialTone}. Each idea should be a short, actionable concept.`;

    try {
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        brainstormResultsContainer.innerHTML = '';
        let fullResponseText = '';
        for await (const chunk of response) {
            fullResponseText += chunk.text;
            // A simple way to render ideas as they come in
            const ideas = fullResponseText.split(/\n\d\.\s/).filter(idea => idea.trim());
            brainstormResultsContainer.innerHTML = ideas.map(idea => `<div class="brainstorm-idea">${idea.trim()}</div>`).join('');
        }
        
        // Add click listeners to the generated ideas
        brainstormResultsContainer.querySelectorAll('.brainstorm-idea').forEach(ideaEl => {
            ideaEl.addEventListener('click', () => {
                socialTopicInput.value = ideaEl.textContent || '';
                brainstormModal.classList.add('hidden');
            });
        });

    } catch (error) {
        parseAndShowError(error, socialErrorMessage);
        brainstormResultsContainer.innerHTML = `<p class="error-message">Could not generate ideas.</p>`;
    } finally {
        isBrainstorming = false;
        generateBrainstormIdeasBtn.disabled = false;
        generateBrainstormIdeasBtn.classList.remove('loading');
    }
}

function openReplyModal() {
    replyGeneratorModal.classList.remove('hidden');
    replyOriginalText.value = '';
    replyResultsContainer.innerHTML = '';
}

async function handleGenerateReplies() {
     if (isGeneratingReplies) return;

    const originalText = replyOriginalText.value.trim();
    if (!originalText) {
        alert("Please paste the text you want to reply to.");
        return;
    }

    isGeneratingReplies = true;
    generateReplyBtn.disabled = true;
    generateReplyBtn.classList.add('loading');
    replyResultsContainer.innerHTML = '<div class="loading-spinner" style="margin: 1rem auto;"></div>';
    
    const tone = replyToneSelect.value;
    const prompt = `Generate 3 distinct replies to the following social media comment/post. The desired tone for the replies is "${tone}". The original text is: "${originalText}"`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // Simple parsing: split by newlines and filter out empty ones
        const replies = response.text.split('\n').map(r => r.replace(/^\d\.\s*/, '').trim()).filter(r => r);
        
        replyResultsContainer.innerHTML = replies.map(reply => `<div class="generated-reply">${reply}</div>`).join('');

        replyResultsContainer.querySelectorAll('.generated-reply').forEach(replyEl => {
            replyEl.addEventListener('click', () => {
                navigator.clipboard.writeText(replyEl.textContent || '');
                replyEl.textContent = 'Copied!';
                setTimeout(() => { replyGeneratorModal.classList.add('hidden'); }, 1000);
            });
        });

    } catch (error) {
        parseAndShowError(error, socialErrorMessage);
        replyResultsContainer.innerHTML = `<p class="error-message">Could not generate replies.</p>`;
    } finally {
        isGeneratingReplies = false;
        generateReplyBtn.disabled = false;
        generateReplyBtn.classList.remove('loading');
    }
}

function openRefineModal() {
    if (!postToRefine) return;
    refineOriginalText.textContent = postToRefine.text;
    refineCustomInstruction.value = '';
    // Reset selections
    refineActionsContainer.querySelectorAll('.style-chip').forEach(chip => chip.classList.remove('selected'));
    refinePostModal.classList.remove('hidden');
}

async function handleRefinePost() {
    if (isRefiningPost || !postToRefine) return;

    // FIX: `querySelector` returns `Element | null`, which lacks a `dataset` property. Cast to `HTMLElement | null` to access `dataset`.
    const selectedAction = refineActionsContainer.querySelector('.style-chip.selected') as HTMLElement | null;
    const instruction = selectedAction?.dataset.instruction || refineCustomInstruction.value.trim();

    if (!instruction) {
        alert("Please select an action or type a custom instruction.");
        return;
    }

    isRefiningPost = true;
    refineNowBtn.disabled = true;
    refineNowBtn.classList.add('loading');

    const prompt = `Refine the following social media post based on the instruction provided. Return only the refined post text.\n\n**Original Post:**\n"${postToRefine.text}"\n\n**Instruction:** ${instruction}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const newText = response.text.trim();
        if (newText) {
            // Find the post in the generated content and update it
            const postIndex = generatedSocialContent.findIndex(p => p === postToRefine);
            if (postIndex > -1) {
                generatedSocialContent[postIndex].text = newText;
                renderGeneratedPosts(); // Re-render all posts to show the change
            }
            refinePostModal.classList.add('hidden');
        } else {
            showError("The AI couldn't refine the post.", socialErrorMessage);
        }

    } catch (error) {
        parseAndShowError(error, socialErrorMessage);
    } finally {
        isRefiningPost = false;
        refineNowBtn.disabled = false;
        refineNowBtn.classList.remove('loading');
        postToRefine = null;
    }
}


// --- AUTH FUNCTIONS (Simplified stubs for now) ---
function openLoginModal() { loginModal.classList.remove('hidden'); }
function closeLoginModal() { loginModal.classList.add('hidden'); }
function switchAuthTab(tab: 'login' | 'signup') {
    if (tab === 'login') {
        loginTabBtn.classList.add('active');
        signupTabBtn.classList.remove('active');
        loginTabContent.classList.remove('hidden');
        signupTabContent.classList.add('hidden');
    } else {
        loginTabBtn.classList.remove('active');
        signupTabBtn.classList.add('active');
        loginTabContent.classList.add('hidden');
        signupTabContent.classList.remove('hidden');
    }
}

// --- INITIALIZATION ---

function initialize() {
    // -- App Shell --
    themeSwitcherBtn = document.getElementById('theme-switcher') as HTMLButtonElement;
    tabDesignGenerator = document.getElementById('tab-design-generator') as HTMLButtonElement;
    tabImageStudio = document.getElementById('tab-image-studio') as HTMLButtonElement;
    tabSocialManager = document.getElementById('tab-social-manager') as HTMLButtonElement;
    designGeneratorPage = document.getElementById('design-generator-page') as HTMLDivElement;
    imageStudioPage = document.getElementById('image-studio-page') as HTMLDivElement;
    socialMediaManagerPage = document.getElementById('social-media-manager-page') as HTMLDivElement;
    loginModal = document.getElementById('login-modal') as HTMLDivElement;

    // -- Auto-Save Indicators --
    designSaveIndicator = document.getElementById('design-save-indicator') as HTMLDivElement;
    studioSaveIndicator = document.getElementById('studio-save-indicator') as HTMLDivElement;
    socialSaveIndicator = document.getElementById('social-save-indicator') as HTMLDivElement;

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
    logoRotationSlider = document.getElementById('logo-rotation-slider') as HTMLInputElement;
    logoRotationValue = document.getElementById('logo-rotation-value') as HTMLSpanElement;
    resetRotationBtn = document.getElementById('reset-rotation-btn') as HTMLButtonElement;
    logoOpacitySlider = document.getElementById('logo-opacity-slider') as HTMLInputElement;
    logoOpacityValue = document.getElementById('logo-opacity-value') as HTMLSpanElement;
    resetOpacityBtn = document.getElementById('reset-opacity-btn') as HTMLButtonElement;
    paletteOptions = document.querySelectorAll('.palette-option');
    layoutOptions = document.querySelectorAll('.layout-option');
    backgroundOptions = document.querySelectorAll('.background-option');
    fontOptions = document.querySelectorAll('.font-option');
    sizeOptions = document.querySelectorAll('.size-option');
    textEffectOptions = document.querySelectorAll('.text-effect-option');
    generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
    generateBtnSpan = generateBtn.querySelector('span');
    clearPrefsBtn = document.getElementById('clear-prefs-btn') as HTMLButtonElement;
    outputPlaceholder = document.getElementById('output-placeholder') as HTMLDivElement;
    loader = document.getElementById('loader') as HTMLDivElement;
    loaderText = document.getElementById('loader-text') as HTMLParagraphElement;
    resultContainer = document.getElementById('result-container') as HTMLDivElement;
    flyerOutput = document.getElementById('flyer-output') as HTMLImageElement;
    downloadControls = document.getElementById('download-controls') as HTMLDivElement;
    downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
    shareBtn = document.getElementById('share-btn') as HTMLButtonElement;
    formatSelect = document.getElementById('format-select') as HTMLSelectElement;
    errorMessage = document.getElementById('error-message') as HTMLDivElement;
    
    // -- Cropping Modal --
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
    studioImageUploadContainer = document.getElementById('studio-image-upload-container') as HTMLDivElement;
    studioImageUploadArea = document.getElementById('studio-image-upload-area') as HTMLDivElement;
    studioLogoUpload = document.getElementById('studio-logo-upload') as HTMLInputElement;
    studioUploadPlaceholder = document.getElementById('studio-upload-placeholder') as HTMLDivElement;
    studioEditControls = document.getElementById('studio-edit-controls') as HTMLDivElement;
    adjustmentControls = document.querySelector('.adjustment-controls') as HTMLDivElement;
    resetFiltersBtn = document.getElementById('reset-filters-btn') as HTMLButtonElement;
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
    styleChips = document.querySelectorAll('#studio-generate-panel .style-chip:not(.size-preset-chip)');
    sizePresetChips = document.querySelectorAll('.size-preset-chip');
    customWidthInput = document.getElementById('custom-width-input') as HTMLInputElement;
    customHeightInput = document.getElementById('custom-height-input') as HTMLInputElement;
    aspectRatioLockToggle = document.getElementById('aspect-ratio-lock-toggle') as HTMLInputElement;
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


    // --- SETUP DEBOUNCED SAVERS ---
    debouncedSavePrefs = createDebouncedSaver(savePrefs);
    debouncedSaveStudioPrefs = createDebouncedSaver(saveStudioPrefs);
    debouncedSaveSocialPrefs = createDebouncedSaver(saveSocialPrefs);

    // --- ADD EVENT LISTENERS ---
    // -- App Shell --
    themeSwitcherBtn.addEventListener('click', toggleTheme);
    tabDesignGenerator.addEventListener('click', () => switchAppTab('design'));
    tabImageStudio.addEventListener('click', () => switchAppTab('studio'));
    // FIX: The variable 'tabManager' was not defined. It should be 'tabSocialManager'.
    tabSocialManager.addEventListener('click', () => switchAppTab('social'));
    
    // -- Design Generator --
    promptInput.addEventListener('input', () => {
        enhancePromptBtn.disabled = !promptInput.value.trim();
        debouncedSavePrefs();
    });
    enhancePromptBtn.addEventListener('click', handleEnhancePromptClick);
    companyNameInput.addEventListener('input', debouncedSavePrefs);
    contactDetailsInput.addEventListener('input', debouncedSavePrefs);
    imageUploadArea.addEventListener('click', () => logoUpload.click());
    logoUpload.addEventListener('change', () => handleLogoSelection(logoUpload.files));
    removeLogoBtn.addEventListener('click', handleRemoveLogo);
    generateBtn.addEventListener('click', handleGenerateClick);
    downloadBtn.addEventListener('click', handleDownloadClick);
    shareBtn.addEventListener('click', () => openShareModal('design'));
    clearPrefsBtn.addEventListener('click', handleClearPrefs);
    
    // -- Logo Customization --
    logoSizeOptions.forEach(option => option.addEventListener('click', handleLogoSizeSelection));
    logoPositionOptions.forEach(option => option.addEventListener('click', handleLogoPositionSelection));
    logoRotationSlider.addEventListener('input', handleLogoRotationChange);
    resetRotationBtn.addEventListener('click', handleResetRotation);
    logoOpacitySlider.addEventListener('input', handleLogoOpacityChange);
    resetOpacityBtn.addEventListener('click', handleResetOpacity);

    // -- Design Style Options --
    paletteOptions.forEach(option => option.addEventListener('click', handlePaletteSelection));
    layoutOptions.forEach(option => option.addEventListener('click', handleLayoutSelection));
    backgroundOptions.forEach(option => option.addEventListener('click', handleBackgroundSelection));
    fontOptions.forEach(option => option.addEventListener('click', handleFontSelection));
    sizeOptions.forEach(option => option.addEventListener('click', handleSizeSelection));
    textEffectOptions.forEach(option => option.addEventListener('click', handleTextEffectSelection));

    // -- Modals --
    applyCropBtn.addEventListener('click', handleApplyCrop);
    cancelCropBtn.addEventListener('click', handleCancelCrop);
    generateCaptionBtn.addEventListener('click', handleGenerateCaptionClick);
    shareNowBtn.addEventListener('click', handleShareNowClick);
    cancelShareBtn.addEventListener('click', closeShareModal);
    
    // -- Image Studio --
    studioTabGenerate.addEventListener('click', () => handleStudioTabSwitch('generate'));
    studioTabEdit.addEventListener('click', () => handleStudioTabSwitch('edit'));
    studioImageUploadArea.addEventListener('click', () => studioLogoUpload.click());
    studioLogoUpload.addEventListener('change', () => handleStudioImageUpload(studioLogoUpload.files));
    resetFiltersBtn.addEventListener('click', resetAllImageFilters);
    [brightnessSlider, contrastSlider, saturateSlider, blurSlider].forEach(slider => {
        slider.addEventListener('input', () => {
            (studioImageFilters as any)[slider.id.replace('-slider', '') as keyof typeof studioImageFilters] = parseFloat(slider.value);
            applyStudioImageFilters();
        });
    });
    textOverlayInput.addEventListener('input', handleTextOverlayUpdate);
    [fontFamilySelect, fontSizeSlider, fontColorPicker].forEach(el => el.addEventListener('input', handleTextStyleUpdate));
    [fontBoldBtn, fontItalicBtn].forEach(btn => btn.addEventListener('click', () => {
        const isPressed = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', String(!isPressed));
        handleTextStyleUpdate();
    }));
    textPositionGrid.forEach(option => option.addEventListener('click', handleTextPositionUpdate));
    aiEditPromptInput.addEventListener('input', () => enhanceAiEditBtn.disabled = !aiEditPromptInput.value.trim());
    enhanceAiEditBtn.addEventListener('click', handleEnhanceAiEditPromptClick);
    applyAiEditBtn.addEventListener('click', handleApplyAiEditClick);
    imagePromptInput.addEventListener('input', () => {
        enhanceImagePromptBtn.disabled = !imagePromptInput.value.trim();
        debouncedSaveStudioPrefs();
    });
    enhanceImagePromptBtn.addEventListener('click', handleEnhanceImagePromptClick);
    styleChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const style = chip.dataset.style;
            if (!style) return;
            chip.classList.toggle('selected');
            const isSelected = chip.classList.contains('selected');
            chip.setAttribute('aria-checked', String(isSelected));
            if (isSelected) selectedImageStyles.add(style);
            else selectedImageStyles.delete(style);
            debouncedSaveStudioPrefs();
        });
    });
    sizePresetChips.forEach(chip => chip.addEventListener('click', handleSizePresetClick));
    customWidthInput.addEventListener('change', handleCustomDimensionInput);
    customHeightInput.addEventListener('change', handleCustomDimensionInput);
    aspectRatioLockToggle.addEventListener('change', handleAspectRatioLockToggle);
    generateImageBtn.addEventListener('click', handleGenerateImageClick);
    undoBtn.addEventListener('click', handleUndoClick);
    redoBtn.addEventListener('click', handleRedoClick);
    studioDownloadBtn.addEventListener('click', handleExportImageClick);
    studioShareBtn.addEventListener('click', () => openShareModal('studio'));
    
    // -- Social Media Manager --
    socialTabCreate.addEventListener('click', () => handleSocialTabSwitch('create'));
    socialTabScheduled.addEventListener('click', () => handleSocialTabSwitch('scheduled'));
    manageBusinessesBtn.addEventListener('click', openBusinessManagerModal);
    businessManagerModal.addEventListener('click', (e) => { if (e.target === businessManagerModal) closeBusinessManagerModal(); });
    businessForm.addEventListener('submit', handleBusinessFormSubmit);
    cancelBusinessEditBtn.addEventListener('click', resetBusinessForm);
    businessSelect.addEventListener('change', () => {
        selectedBusinessId = parseInt(businessSelect.value);
        debouncedSaveSocialPrefs();
    });
    socialTopicInput.addEventListener('input', debouncedSaveSocialPrefs);
    socialToneSelect.addEventListener('change', debouncedSaveSocialPrefs);
    selectAllPlatformsBtn.addEventListener('click', handleSelectAllPlatforms);
    generateSocialBtn.addEventListener('click', handleGenerateSocialBtn);
    schedulePostsBtn.addEventListener('click', handleSchedulePosts);
    suggestTimeBtn.addEventListener('click', handleSuggestTime);
    brainstormIdeasBtn.addEventListener('click', openBrainstormModal);
    generateBrainstormIdeasBtn.addEventListener('click', handleGenerateBrainstormIdeas);
    closeBrainstormBtn.addEventListener('click', () => brainstormModal.classList.add('hidden'));
    generateRepliesBtn.addEventListener('click', openReplyModal);
    closeReplyModalBtn.addEventListener('click', () => replyGeneratorModal.classList.add('hidden'));
    generateReplyBtn.addEventListener('click', handleGenerateReplies);
    refineActionsContainer.querySelectorAll('.style-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            refineActionsContainer.querySelectorAll('.style-chip').forEach(c => c.classList.remove('selected'));
            (e.currentTarget as HTMLElement).classList.add('selected');
        });
    });
    refineNowBtn.addEventListener('click', handleRefinePost);
    cancelRefineBtn.addEventListener('click', () => refinePostModal.classList.add('hidden'));


    // --- FINAL UI SETUP ---
    loadTheme();
    handleLoadPrefs();
    loadStudioPrefs();
    loadSocialPrefs();
    const lastTab = localStorage.getItem(LAST_TAB_KEY) as 'design' | 'studio' | 'social' | null;
    if (lastTab) {
        switchAppTab(lastTab);
    } else {
        switchAppTab('design');
    }
}


// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', initialize);