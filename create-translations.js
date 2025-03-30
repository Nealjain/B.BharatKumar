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

// Load English translation file as base
let baseTranslations;
try {
  const baseFilePath = path.join(translationsDir, 'en.json');
  if (fs.existsSync(baseFilePath)) {
    baseTranslations = JSON.parse(fs.readFileSync(baseFilePath, 'utf8'));
    console.log('Loaded English translations as base');
  } else {
    console.error('Error: English translation file (en.json) not found. Please create it first.');
    process.exit(1);
  }
} catch (error) {
  console.error('Error loading base translation file:', error);
  process.exit(1);
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
    
    const result = await translate(text, { to: targetLang });
    return result.text;
  } catch (error) {
    console.error(`Error translating to ${targetLang}:`, error);
    return text; // Return original text if translation fails
  }
}

// Generate translations for all supported languages
async function generateTranslations() {
  // Skip English (base language)
  const languagesToTranslate = supportedLanguages.filter(lang => lang.code !== 'en');
  
  for (const language of languagesToTranslate) {
    console.log(`Generating translations for ${language.name} (${language.code})...`);
    
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
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Write translated file
    const outputPath = path.join(translationsDir, `${language.code}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(translations, null, 2), 'utf8');
    console.log(`\nCompleted translations for ${language.name} (${language.code}) - saved to ${outputPath}`);
  }
  
  console.log('\nAll translations completed successfully!');
}

// Create a sample English translation file if it doesn't exist
function createSampleEnglishFile() {
  const samplePath = path.join(translationsDir, 'en.json');
  
  if (!fs.existsSync(samplePath)) {
    const sampleData = {
      "page_title": "B.BharatKumar - Fine Jewelry",
      "showcase_notice": "Our jewelry is for display purposes only. We primarily focus on 92.5 silver with a small gold collection.",
      "nav_home": "Home",
      "nav_about": "About",
      "nav_collection": "Collection",
      "nav_contact": "Contact",
      "hero_title": "Elegant Jewelry<br>For Every Occasion",
      "hero_subtitle": "Discover our exclusive collection of fine jewelry",
      // Add more sample translations as needed
    };
    
    fs.writeFileSync(samplePath, JSON.stringify(sampleData, null, 2), 'utf8');
    console.log(`Created sample English translation file at ${samplePath}`);
  }
}

// Main function
async function main() {
  try {
    // Check if translations directory exists, create if not
    if (!fs.existsSync(translationsDir)) {
      fs.mkdirSync(translationsDir);
      console.log('Created translations directory');
      
      // Create sample English file
      createSampleEnglishFile();
    }
    
    // Generate translations
    await generateTranslations();
  } catch (error) {
    console.error('Error generating translations:', error);
    process.exit(1);
  }
}

// Run the script
main(); 