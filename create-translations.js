/**
 * B.BharatKumar Website Translation Generator
 * 
 * This script automatically generates translation files for multiple languages
 * using Google Translate API. It takes the English translation file as a base
 * and generates translations for all other supported languages.
 */

const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

// Create translations directory if it doesn't exist
const translationsDir = path.join(__dirname, 'translations');
if (!fs.existsSync(translationsDir)) {
  fs.mkdirSync(translationsDir);
  console.log('Created translations directory');
}

// Define supported languages (code and name)
const supportedLanguages = [
  { code: 'en', name: 'English' },  // Base language
  { code: 'hi', name: 'Hindi' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ar', name: 'Arabic' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' }
];

// Create a sample English translation file if it doesn't exist
function createSampleEnglishFile() {
  const samplePath = path.join(translationsDir, 'en.json');
  
  if (!fs.existsSync(samplePath)) {
    console.log('Creating sample English translation file...');
    
    const sampleData = {
      "page_title": "B.BharatKumar - Fine Jewelry",
      "showcase_notice": "Our jewelry is for display purposes only. We primarily focus on 92.5 silver with a small gold collection.",
      
      "nav_home": "Home",
      "nav_about": "About",
      "nav_collection": "Collection",
      "nav_contact": "Contact",
      
      "hero_title": "Elegant Jewelry<br>For Every Occasion",
      "hero_subtitle": "Discover our exclusive collection of fine jewelry",
      
      "about_title": "About Us",
      "about_p1": "B.BharatKumar is a premier jewelry shop in Mumbai with a legacy dating back to the 1950s. We offer exquisite gold, diamond, and gemstone pieces that blend traditional craftsmanship with contemporary designs.",
      "about_p2": "Our master artisans create timeless jewelry using age-old techniques and the finest materials. Each piece reflects our commitment to quality, authenticity, and cultural heritage.",
      "about_p3": "At B.BharatKumar, we believe jewelry is a personal expression, not just an accessory. Our designs honor traditional Indian motifs while embracing modern sensibilities.",
      
      "collection_title": "Our Collection",
      "collection_gold_chains": "Gold Chains",
      "collection_wedding_ornaments": "Wedding Ornaments",
      "collection_traditional_payals": "Traditional Payals",
      "collection_classic_bracelets": "Classic Bracelets",
      "collection_modern_necklaces": "Modern Necklaces",
      "collection_modern_bracelets": "Modern Bracelets",
      "collection_jewelry_accessories": "Jewelry Accessories",
      
      "contact_title": "Visit Our Store",
      "contact_address_label": "Address",
      "contact_address": "XR6Q+V22, Shop 12, Amir Building, Noor Baug, Navroji Hill Rd 9, Dongri, Umerkhadi, Mumbai, Maharashtra 400009",
      "contact_phone_label": "Phone",
      "contact_email_label": "Email",
      "contact_hours_label": "Opening Hours",
      "contact_hours_weekdays": "Monday - Saturday: 10:00 AM - 8:00 PM",
      "contact_hours_weekend": "Sunday: 11:00 AM - 6:00 PM",
      
      "footer_tagline": "Fine Jewelry Since 1950s",
      "footer_quick_links": "Quick Links",
      "footer_connect": "Connect With Us",
      "footer_copyright": "© 2023 B.BharatKumar. All Rights Reserved."
    };
    
    try {
      fs.writeFileSync(samplePath, JSON.stringify(sampleData, null, 2), 'utf8');
      console.log(`Created sample English translation file at ${samplePath}`);
      return true;
    } catch (error) {
      console.error(`Error creating sample file: ${error}`);
      return false;
    }
  }
  
  return true; // File already exists
}

// Function to translate text to target language
async function translateText(text, targetLang) {
  try {
    // Skip HTML tags from translation
    if (text.includes('<br>')) {
      const parts = text.split(/<br\s*\/?>/i);
      const translatedParts = await Promise.all(
        parts.map(part => translateText(part, targetLang))
      );
      return translatedParts.join('<br>');
    }
    
    // Add retry logic
    let retries = 3;
    let lastError = null;
    
    while (retries > 0) {
      try {
        const result = await translate(text, { to: targetLang });
        return result.text;
      } catch (error) {
        lastError = error;
        retries--;
        console.warn(`Translation retry (${3-retries}/3) failed: ${error.message}`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    throw lastError || new Error('Maximum retries exceeded');
  } catch (error) {
    console.error(`Error translating to ${targetLang}: ${error.message}`);
    return text; // Return original text if translation fails
  }
}

// Load English translation file as base
async function loadBaseTranslations() {
  try {
    const baseFilePath = path.join(translationsDir, 'en.json');
    
    // Create sample file if it doesn't exist
    if (!fs.existsSync(baseFilePath)) {
      const created = createSampleEnglishFile();
      if (!created) {
        throw new Error('Failed to create English translation file');
      }
    }
    
    // Now load the file
    const fileData = fs.readFileSync(baseFilePath, 'utf8');
    const baseTranslations = JSON.parse(fileData);
    console.log('Loaded English translations as base');
    return baseTranslations;
  } catch (error) {
    console.error('Error loading base translation file:', error);
    return null;
  }
}

// Generate translations for all supported languages
async function generateTranslations() {
  // Load base translations
  const baseTranslations = await loadBaseTranslations();
  
  if (!baseTranslations) {
    console.error('Error: Could not load base translations. Exiting.');
    process.exit(1);
  }
  
  // Skip English (base language)
  const languagesToTranslate = supportedLanguages.filter(lang => lang.code !== 'en');
  
  console.log(`Will generate translations for ${languagesToTranslate.length} languages`);
  
  for (const language of languagesToTranslate) {
    console.log(`\nGenerating translations for ${language.name} (${language.code})...`);
    
    const translations = {};
    let count = 0;
    const total = Object.keys(baseTranslations).length;
    
    // Translate each key
    for (const [key, value] of Object.entries(baseTranslations)) {
      count++;
      process.stdout.write(`Translating ${count}/${total}: ${key}...\r`);
      
      // Skip translation if the value is empty or just whitespace
      if (!value || value.trim() === '') {
        translations[key] = value;
        continue;
      }
      
      // Translate the value
      translations[key] = await translateText(value, language.code);
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    
    // Write translated file
    const outputPath = path.join(translationsDir, `${language.code}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(translations, null, 2), 'utf8');
    console.log(`\nCompleted translations for ${language.name} (${language.code}) - saved to ${outputPath}`);
  }
  
  console.log('\nAll translations completed successfully!');
}

// Main function
async function main() {
  try {
    console.log('Starting translation generation process...');
    
    // Check if translations directory exists, create if not
    if (!fs.existsSync(translationsDir)) {
      fs.mkdirSync(translationsDir);
      console.log('Created translations directory');
    }
    
    // Generate translations
    await generateTranslations();
    
    console.log('Translation generation completed successfully!');
  } catch (error) {
    console.error('Error generating translations:', error);
    process.exit(1);
  }
}

// Run the script
main(); 