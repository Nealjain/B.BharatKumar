/**
 * B.BharatKumar Website Translation System
 * This script handles translation of the website content to multiple languages
 */

// Available languages configuration
const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'mr', name: 'मराठी' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'ar', name: 'العربية' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' }
];

// Translation data - will be loaded from JSON files
let translations = {};

// Current language
let currentLanguage = localStorage.getItem('preferred-language') || 'en';

// Initialize the translation system
async function initTranslation() {
  // Create language selector
  createLanguageSelector();
  
  // Load translations for current language
  await loadTranslation(currentLanguage);
  
  // Apply translations
  translatePage();
  
  // Showcase notice in current language
  updateShowcaseNotice();
}

// Create language dropdown in the header
function createLanguageSelector() {
  const header = document.querySelector('header .container');
  
  // Create language selector container
  const langSelector = document.createElement('div');
  langSelector.className = 'language-selector';
  
  // Create dropdown
  const dropdown = document.createElement('select');
  dropdown.id = 'language-dropdown';
  dropdown.setAttribute('aria-label', 'Select language');
  
  // Add language options
  languages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang.code;
    option.textContent = lang.name;
    option.selected = lang.code === currentLanguage;
    dropdown.appendChild(option);
  });
  
  // Add event listener for language change
  dropdown.addEventListener('change', (e) => {
    switchLanguage(e.target.value);
  });
  
  // Add label and dropdown to container
  const label = document.createElement('span');
  label.className = 'lang-icon';
  label.innerHTML = '<i class="fas fa-globe"></i>';
  
  langSelector.appendChild(label);
  langSelector.appendChild(dropdown);
  
  // Insert before mobile nav toggle
  const mobileNavToggle = header.querySelector('.mobile-nav-toggle');
  header.insertBefore(langSelector, mobileNavToggle);
}

// Load translation file for specified language
async function loadTranslation(langCode) {
  try {
    const response = await fetch(`translations/${langCode}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${langCode}`);
    }
    translations = await response.json();
    return true;
  } catch (error) {
    console.error('Error loading translations:', error);
    // Fallback to English if translation file not found
    if (langCode !== 'en') {
      currentLanguage = 'en';
      return loadTranslation('en');
    }
    return false;
  }
}

// Switch to a new language
async function switchLanguage(langCode) {
  // Save preference
  localStorage.setItem('preferred-language', langCode);
  currentLanguage = langCode;
  
  // Load new translations
  const success = await loadTranslation(langCode);
  if (success) {
    // Apply translations
    translatePage();
    // Update showcase notice
    updateShowcaseNotice();
    // Update document language
    document.documentElement.lang = langCode;
    
    // Update chatbot language if chatbot is active
    if (window.updateChatbotLanguage) {
      window.updateChatbotLanguage(langCode);
    }
  }
}

// Apply translations to the page
function translatePage() {
  // Get all elements with data-i18n attribute
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[key]) {
      // If element contains HTML
      if (element.innerHTML.includes('<')) {
        // Preserve HTML tags
        const html = element.innerHTML;
        const text = element.textContent;
        const translatedText = translations[key];
        element.innerHTML = html.replace(text, translatedText);
      } else {
        element.textContent = translations[key];
      }
    }
  });
  
  // Handle placeholders
  const inputs = document.querySelectorAll('[data-i18n-placeholder]');
  inputs.forEach(input => {
    const key = input.getAttribute('data-i18n-placeholder');
    if (translations[key]) {
      input.placeholder = translations[key];
    }
  });
  
  // Update document title
  if (translations['page_title']) {
    document.title = translations['page_title'];
  }
}

// Update showcase notice with current language
function updateShowcaseNotice() {
  const showcaseNotice = document.querySelector('.showcase-notice');
  if (showcaseNotice && translations['showcase_notice']) {
    showcaseNotice.textContent = translations['showcase_notice'];
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initTranslation);

// Export functions for use by other scripts
window.translateSystem = {
  switchLanguage,
  getCurrentLanguage: () => currentLanguage,
  translate: (key) => translations[key] || key
}; 