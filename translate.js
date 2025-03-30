/**
 * B.BharatKumar Website Translation System
 * This script handles automatic translation based on user's browser language
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

// Get browser language and determine best match from available languages
function detectUserLanguage() {
  // Get user's browser language preference (e.g., 'en-US', 'hi', etc.)
  const browserLang = navigator.language || navigator.userLanguage || 'en';
  
  // Extract the primary language code (e.g., 'en' from 'en-US')
  const primaryLang = browserLang.split('-')[0];
  
  console.log(`Browser language detected: ${browserLang}, primary: ${primaryLang}`);
  
  // Check if we support this language
  const languageMatch = languages.find(lang => lang.code === primaryLang);
  
  // Return the matched language code or 'en' as fallback
  return languageMatch ? primaryLang : 'en';
}

// Get user's preferred language
const userLanguage = localStorage.getItem('preferred-language');
// Current language - auto-detect if not set
let currentLanguage = userLanguage || detectUserLanguage();

// Initialize the translation system
async function initTranslation() {
  try {
    console.log('Initializing automatic translation system...');
    
    // Add English toggle button (hidden in footer)
    addEnglishToggle();
    
    // Load translations for current language
    const success = await loadTranslation(currentLanguage);
    
    if (success) {
      // Apply translations
      translatePage();
      
      // Set document language
      document.documentElement.lang = currentLanguage;
      
      console.log(`Translation system initialized with language: ${currentLanguage}`);
    } else {
      console.error('Failed to initialize translation system');
    }
  } catch (error) {
    console.error('Error initializing translation system:', error);
    
    // Fallback to English
    if (currentLanguage !== 'en') {
      console.log('Falling back to English...');
      currentLanguage = 'en';
      await loadTranslation('en');
      translatePage();
    }
  }
}

// Add a small English toggle link in the footer
function addEnglishToggle() {
  const footerBottom = document.querySelector('.footer-bottom');
  
  if (!footerBottom) {
    console.warn('Footer bottom not found, cannot add English toggle');
    return;
  }
  
  // Only show toggle if not already in English
  if (currentLanguage !== 'en') {
    const toggleLink = document.createElement('a');
    toggleLink.href = '#';
    toggleLink.textContent = 'English';
    toggleLink.style.marginLeft = '15px';
    toggleLink.style.fontSize = '12px';
    toggleLink.style.color = 'rgba(255,255,255,0.5)';
    
    toggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchLanguage('en');
      toggleLink.style.display = 'none';
    });
    
    const copyright = footerBottom.querySelector('p');
    if (copyright) {
      copyright.appendChild(document.createTextNode(' '));
      copyright.appendChild(toggleLink);
    } else {
      footerBottom.appendChild(toggleLink);
    }
    
    console.log('Added English toggle to footer');
  }
}

// Load translation file for specified language
async function loadTranslation(langCode) {
  try {
    console.log(`Loading translations for ${langCode}...`);
    
    // Default fallback to English if language not supported
    if (!languages.some(lang => lang.code === langCode)) {
      console.warn(`Language ${langCode} not supported, falling back to English`);
      langCode = 'en';
      currentLanguage = 'en';
    }
    
    const response = await fetch(`translations/${langCode}.json?v=${new Date().getTime()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${langCode} (Status: ${response.status})`);
    }
    
    translations = await response.json();
    console.log(`Successfully loaded translations for ${langCode}`);
    return true;
  } catch (error) {
    console.error('Error loading translations:', error);
    
    // Fallback to English if translation file not found
    if (langCode !== 'en') {
      console.log('Falling back to English translations');
      currentLanguage = 'en';
      return loadTranslation('en');
    }
    
    return false;
  }
}

// Switch to a new language
async function switchLanguage(langCode) {
  try {
    console.log(`Switching language to ${langCode}...`);
    
    if (langCode === currentLanguage) {
      console.log('Already using this language');
      return;
    }
    
    // Save preference
    localStorage.setItem('preferred-language', langCode);
    currentLanguage = langCode;
    
    // Load new translations
    const success = await loadTranslation(langCode);
    
    if (success) {
      // Apply translations
      translatePage();
      
      // Update document language
      document.documentElement.lang = langCode;
      
      // Update chatbot language if chatbot is active
      if (window.updateChatbotLanguage) {
        window.updateChatbotLanguage(langCode);
      }
      
      console.log(`Successfully switched to ${langCode}`);
      
      // Reload page to ensure proper application of translations
      window.location.reload();
    } else {
      console.error(`Failed to switch to ${langCode}`);
    }
  } catch (error) {
    console.error('Error switching language:', error);
  }
}

// Apply translations to the page
function translatePage() {
  try {
    console.log('Applying translations to page...');
    
    // Get all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    if (elements.length === 0) {
      console.warn('No translatable elements found on page');
    }
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      
      if (!translations[key]) {
        console.warn(`Missing translation for key: ${key}`);
        return;
      }
      
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
    });
    
    // Handle placeholders
    const inputs = document.querySelectorAll('[data-i18n-placeholder]');
    inputs.forEach(input => {
      const key = input.getAttribute('data-i18n-placeholder');
      if (translations[key]) {
        input.placeholder = translations[key];
      } else {
        console.warn(`Missing translation for placeholder key: ${key}`);
      }
    });
    
    // Update document title
    if (translations['page_title']) {
      document.title = translations['page_title'];
    }
    
    console.log('Translations applied successfully');
  } catch (error) {
    console.error('Error applying translations:', error);
  }
}

// Utility function to get a translation by key
function getTranslation(key, fallback = '') {
  if (translations[key]) {
    return translations[key];
  }
  
  console.warn(`Missing translation for key: ${key}`);
  return fallback || key;
}

// Export the initTranslation function to the window object
window.initTranslation = initTranslation;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initTranslation);

// Export functions for use by other scripts
window.translateSystem = {
  switchLanguage,
  getCurrentLanguage: () => currentLanguage,
  translate: getTranslation,
  refreshTranslations: translatePage
};