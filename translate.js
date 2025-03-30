/**
 * B.BharatKumar Website Translation System
 * Simple translation between English and Hindi
 */

// Available languages configuration - simplify to just English and Hindi
const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' }
];

// Translation data - will be loaded from JSON files
let translations = {};

// Current language - default to English
let currentLanguage = localStorage.getItem('preferred-language') || 'en';

// Initialize the translation system
async function initTranslation() {
  try {
    console.log('Initializing translation system...');
    
    // Create language selector dropdown
    createLanguageSelector();
    
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
      
      // Fallback to English
      if (currentLanguage !== 'en') {
        currentLanguage = 'en';
        await loadTranslation('en');
        translatePage();
      }
    }
  } catch (error) {
    console.error('Error initializing translation system:', error);
    
    // Fallback to English
    currentLanguage = 'en';
    await loadTranslation('en');
    translatePage();
  }
}

// Create language dropdown in the header
function createLanguageSelector() {
  const header = document.querySelector('header .container');
  
  if (!header) {
    console.error('Header container not found');
    return;
  }
  
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
  
  if (mobileNavToggle) {
    header.insertBefore(langSelector, mobileNavToggle);
  } else {
    // Fallback if mobile nav toggle not found
    header.appendChild(langSelector);
  }
  
  console.log('Language selector created');
}

// Load translation file for specified language
async function loadTranslation(langCode) {
  try {
    console.log(`Loading translations for ${langCode}...`);
    
    // Force fallback to English if not supported
    if (langCode !== 'en' && langCode !== 'hi') {
      console.warn(`Language ${langCode} not supported, falling back to English`);
      langCode = 'en';
      currentLanguage = 'en';
    }
    
    // Add cache-busting parameter
    const response = await fetch(`translations/${langCode}.json?v=${new Date().getTime()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${langCode} (Status: ${response.status})`);
    }
    
    try {
      translations = await response.json();
      console.log(`Successfully loaded translations for ${langCode}`);
      return true;
    } catch (parseError) {
      console.error('Error parsing translation JSON:', parseError);
      throw new Error('Invalid translation data format');
    }
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
    
    // Show loading indicator
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown) {
      dropdown.classList.add('loading');
      dropdown.disabled = true;
    }
    
    // Load new translations
    const success = await loadTranslation(langCode);
    
    if (success) {
      // Apply translations
      translatePage();
      
      // Update document language
      document.documentElement.lang = langCode;
      
      console.log(`Successfully switched to ${langCode}`);
      
      // Remove loading indicator
      if (dropdown) {
        dropdown.classList.remove('loading');
        dropdown.disabled = false;
      }
      
      // Simple page reload to ensure all translations are applied
      window.location.reload();
    } else {
      console.error(`Failed to switch to ${langCode}`);
      
      // Remove loading indicator
      if (dropdown) {
        dropdown.classList.remove('loading');
        dropdown.disabled = false;
      }
    }
  } catch (error) {
    console.error('Error switching language:', error);
    
    // Reset dropdown value
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown) {
      dropdown.value = currentLanguage;
      dropdown.classList.remove('loading');
      dropdown.disabled = false;
    }
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
      if (element.innerHTML.includes('<br>')) {
        // Special handling for HTML with <br> tags
        element.innerHTML = translations[key];
      } else if (element.innerHTML.includes('<')) {
        // Preserve other HTML tags
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

// Export the initTranslation function to the window object
window.initTranslation = initTranslation;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initTranslation);

// Export functions for use by other scripts
window.translateSystem = {
  switchLanguage,
  getCurrentLanguage: () => currentLanguage,
  translate: (key) => translations[key] || key
};