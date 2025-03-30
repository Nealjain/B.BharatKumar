/**
 * B.BharatKumar Website Chatbot
 * This script implements a chatbot that can answer questions about the jewelry shop
 * in multiple languages, adhering to the showcase-only business requirements.
 */

// Chatbot configuration
const CHATBOT_CONFIG = {
  initialDelay: 5000, // Show chatbot after 5 seconds
  avatarUrl: 'images/logo.png', // Replace with actual logo image
  position: 'bottom-right',
  welcomeMessage: 'Hello! Welcome to B.BharatKumar. How can I assist you with our jewelry collection today?',
  placeholderText: 'Type your question here...',
  suggestedQuestions: [
    'What types of jewelry do you showcase?',
    'Tell me about your silver collection',
    'Is this jewelry for display only?',
    'Where is your store located?',
    'What are your opening hours?'
  ],
  businessRules: {
    showcaseOnly: true,
    noPrices: true,
    primaryFocus: "92.5 silver",
    secondaryFocus: "gold",
    noBuyOptions: true,
    noMisleadingInfo: true
  }
};

// Translations for chatbot UI
const botTranslations = {
  en: {
    welcomeMessage: 'Hello! Welcome to B.BharatKumar. How can I assist you with our jewelry collection today?',
    placeholderText: 'Type your question here...',
    suggestedQuestions: [
      'What types of jewelry do you showcase?',
      'Tell me about your silver collection',
      'Is this jewelry for display only?',
      'Where is your store located?',
      'What are your opening hours?'
    ],
    sendButton: 'Send',
    closeButton: 'Close',
    typingIndicator: 'Typing...',
    showcaseNotice: 'Please note that our jewelry is for display purposes only.'
  },
  // Hindi translations
  hi: {
    welcomeMessage: 'नमस्ते! B.BharatKumar में आपका स्वागत है। आज मैं आपकी आभूषण संग्रह के बारे में कैसे मदद कर सकता हूं?',
    placeholderText: 'अपना प्रश्न यहां लिखें...',
    suggestedQuestions: [
      'आप किस प्रकार के आभूषण प्रदर्शित करते हैं?',
      'मुझे अपने चांदी के संग्रह के बारे में बताएं',
      'क्या यह आभूषण केवल प्रदर्शन के लिए है?',
      'आपकी दुकान कहां स्थित है?',
      'आपके खुलने का समय क्या है?'
    ],
    sendButton: 'भेजें',
    closeButton: 'बंद करें',
    typingIndicator: 'टाइपिंग...',
    showcaseNotice: 'कृपया ध्यान दें कि हमारे आभूषण केवल प्रदर्शन उद्देश्यों के लिए हैं।'
  }
  // Additional languages can be added similarly
};

// Knowledge base for chatbot responses
const knowledgeBase = {
  en: {
    // Jewelry types
    jewelry_types: "At B.BharatKumar, we showcase exquisite 92.5 silver jewelry as our primary collection, along with a selection of gold pieces. Our collections include necklaces, bracelets, earrings, rings, and traditional Indian jewelry like payals and wedding ornaments.",
    
    // Silver collection
    silver_collection: "Our 92.5 silver collection is our specialty, featuring traditional and contemporary designs. Each piece is crafted by skilled artisans using age-old techniques. We offer a variety of silver jewelry including necklaces, earrings, bracelets, and traditional ornaments.",
    
    // Gold collection
    gold_collection: "We display a carefully curated selection of gold jewelry pieces, including traditional designs and modern interpretations. Our gold collection showcases the craftsmanship of our artisans.",
    
    // Showcase only
    showcase_only: "Yes, our website and physical store display our jewelry collections for showcase purposes only. We don't sell directly through this platform but welcome you to visit our store to view our collections in person.",
    
    // Store location
    store_location: "Our store is located at: Shop 12, Amir Building, Noor Baug, Navroji Hill Rd 9, Dongri, Umerkhadi, Mumbai, Maharashtra 400009, India.",
    
    // Opening hours
    opening_hours: "Our store is open Monday through Saturday from 10:00 AM to 8:00 PM, and Sundays from 11:00 AM to 6:00 PM.",
    
    // Contact information
    contact_info: "You can reach us at +91 9372820541 or +91 9819202656. You can also email us at nealmanawat@gmail.com.",
    
    // Legacy
    legacy: "B.BharatKumar has a rich legacy dating back to the 1950s. We've been showcasing traditional and contemporary jewelry designs for generations, preserving the cultural heritage of Indian jewelry craftsmanship.",
    
    // Craftsmanship
    craftsmanship: "Our jewelry pieces display exceptional craftsmanship from skilled artisans who use traditional techniques passed down through generations. Each piece in our collection highlights attention to detail and quality workmanship.",
    
    // Default response
    default: "Thank you for your interest in B.BharatKumar jewelry collections. We're dedicated to showcasing beautiful 92.5 silver and gold jewelry pieces. If you have specific questions about our collections or would like to visit our store in Mumbai, please let me know how I can assist you further."
  },
  // Hindi knowledge base
  hi: {
    // Similar structure as English, with translated content
    jewelry_types: "B.BharatKumar में, हम अपने मुख्य संग्रह के रूप में उत्कृष्ट 92.5 चांदी के आभूषण प्रदर्शित करते हैं, साथ ही सोने के टुकड़ों का चयन भी करते हैं। हमारे संग्रह में हार, चूड़ियाँ, कान के बाली, अंगूठियाँ और पायल और शादी के आभूषण जैसे पारंपरिक भारतीय आभूषण शामिल हैं।",
    
    // Add more translations as needed
    default: "B.BharatKumar आभूषण संग्रह में आपकी रुचि के लिए धन्यवाद। हम सुंदर 92.5 चांदी और सोने के आभूषण टुकड़ों को प्रदर्शित करने के लिए समर्पित हैं। यदि आपके पास हमारे संग्रह के बारे में कोई विशिष्ट प्रश्न हैं या आप मुंबई में हमारी दुकान पर जाना चाहते हैं, तो कृपया मुझे बताएं कि मैं आपकी और कैसे सहायता कर सकता हूं।"
  }
  // Additional languages can be added similarly
};

// Intent recognition patterns
const intents = [
  { pattern: /jewelry.*?(type|kind|collection|showcase)/i, response: "jewelry_types" },
  { pattern: /(silver|925|92\.5).*?(collection|jewelry|showcase)/i, response: "silver_collection" },
  { pattern: /gold.*?(collection|jewelry|showcase)/i, response: "gold_collection" },
  { pattern: /(display|showcase only|not for sale|selling)/i, response: "showcase_only" },
  { pattern: /(store|shop|showroom).*?(location|address|where)/i, response: "store_location" },
  { pattern: /(hour|time|open|close)/i, response: "opening_hours" },
  { pattern: /(contact|phone|email|reach)/i, response: "contact_info" },
  { pattern: /(legacy|history|since|tradition|traditional)/i, response: "legacy" },
  { pattern: /(craft|craftsmanship|artisan|handmade|skill)/i, response: "craftsmanship" }
];

// Current chatbot language
let chatbotLanguage = 'en';

// Create and initialize the chatbot
function initChatbot() {
  // Create chatbot container
  const chatbot = document.createElement('div');
  chatbot.className = 'chatbot-container';
  chatbot.id = 'jewelry-chatbot';
  
  // Create components
  const chatbotHeader = createChatbotHeader();
  const chatbotBody = createChatbotBody();
  const chatbotFooter = createChatbotFooter();
  
  // Assemble chatbot
  chatbot.appendChild(chatbotHeader);
  chatbot.appendChild(chatbotBody);
  chatbot.appendChild(chatbotFooter);
  
  // Initially hide the chatbot content and just show the bubble
  const chatbotBubble = createChatbotBubble();
  
  // Add to page
  document.body.appendChild(chatbotBubble);
  document.body.appendChild(chatbot);
  
  // Initialize event listeners
  initChatbotEvents(chatbot, chatbotBubble);
  
  // Show welcome message
  setTimeout(() => {
    addBotMessage(getCurrentTranslation('welcomeMessage'));
    showSuggestedQuestions();
  }, 500);
  
  // Set chatbot visibility based on user preference
  const chatbotVisibility = localStorage.getItem('chatbot-visibility');
  if (chatbotVisibility === 'open') {
    setTimeout(() => {
      toggleChatbot(true);
    }, 1000);
  } else {
    setTimeout(() => {
      chatbotBubble.classList.add('show');
    }, CHATBOT_CONFIG.initialDelay);
  }
}

// Create chatbot bubble
function createChatbotBubble() {
  const bubble = document.createElement('div');
  bubble.className = 'chatbot-bubble';
  bubble.innerHTML = '<i class="fas fa-comments"></i>';
  return bubble;
}

// Create chatbot header
function createChatbotHeader() {
  const header = document.createElement('div');
  header.className = 'chatbot-header';
  
  const avatar = document.createElement('div');
  avatar.className = 'chatbot-avatar';
  
  const img = document.createElement('img');
  img.src = CHATBOT_CONFIG.avatarUrl;
  img.alt = 'B.BharatKumar Chatbot';
  
  avatar.appendChild(img);
  
  const title = document.createElement('div');
  title.className = 'chatbot-title';
  title.textContent = 'B.BharatKumar Assistant';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'chatbot-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close chatbot');
  
  header.appendChild(avatar);
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  return header;
}

// Create chatbot body
function createChatbotBody() {
  const body = document.createElement('div');
  body.className = 'chatbot-body';
  
  // Chatbot messages container
  const messages = document.createElement('div');
  messages.className = 'chatbot-messages';
  messages.id = 'chatbot-messages';
  
  body.appendChild(messages);
  
  return body;
}

// Create chatbot footer with input
function createChatbotFooter() {
  const footer = document.createElement('div');
  footer.className = 'chatbot-footer';
  
  // Create showcase notice
  const showcaseNotice = document.createElement('div');
  showcaseNotice.className = 'showcase-notice';
  showcaseNotice.textContent = getCurrentTranslation('showcaseNotice');
  
  // Create input group
  const inputGroup = document.createElement('div');
  inputGroup.className = 'chatbot-input-group';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'chatbot-input';
  input.id = 'chatbot-input';
  input.placeholder = getCurrentTranslation('placeholderText');
  
  const sendBtn = document.createElement('button');
  sendBtn.className = 'chatbot-send';
  sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
  sendBtn.setAttribute('aria-label', getCurrentTranslation('sendButton'));
  
  inputGroup.appendChild(input);
  inputGroup.appendChild(sendBtn);
  
  // Add suggested questions container
  const suggestedQuestions = document.createElement('div');
  suggestedQuestions.className = 'suggested-questions';
  suggestedQuestions.id = 'suggested-questions';
  
  footer.appendChild(showcaseNotice);
  footer.appendChild(inputGroup);
  footer.appendChild(suggestedQuestions);
  
  return footer;
}

// Initialize chatbot events
function initChatbotEvents(chatbot, chatbotBubble) {
  // Bubble click event to open chatbot
  chatbotBubble.addEventListener('click', () => {
    toggleChatbot(true);
  });
  
  // Close button click event
  const closeBtn = chatbot.querySelector('.chatbot-close');
  closeBtn.addEventListener('click', () => {
    toggleChatbot(false);
  });
  
  // Send message on button click
  const sendBtn = chatbot.querySelector('.chatbot-send');
  sendBtn.addEventListener('click', handleSendMessage);
  
  // Send message on Enter key press
  const input = chatbot.querySelector('.chatbot-input');
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });
  
  // Handle clicks on suggested questions
  const suggestedContainer = chatbot.querySelector('#suggested-questions');
  suggestedContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggested-question')) {
      const question = e.target.textContent;
      addUserMessage(question);
      processUserMessage(question);
    }
  });
}

// Toggle chatbot visibility
function toggleChatbot(show) {
  const chatbot = document.getElementById('jewelry-chatbot');
  const bubble = document.querySelector('.chatbot-bubble');
  
  if (show) {
    chatbot.classList.add('show');
    bubble.classList.remove('show');
    localStorage.setItem('chatbot-visibility', 'open');
    document.getElementById('chatbot-input').focus();
  } else {
    chatbot.classList.remove('show');
    bubble.classList.add('show');
    localStorage.setItem('chatbot-visibility', 'closed');
  }
}

// Handle send message button click
function handleSendMessage() {
  const input = document.getElementById('chatbot-input');
  const message = input.value.trim();
  
  if (message) {
    addUserMessage(message);
    processUserMessage(message);
    input.value = '';
  }
}

// Add user message to chat
function addUserMessage(message) {
  const messagesContainer = document.getElementById('chatbot-messages');
  const messageElement = document.createElement('div');
  messageElement.className = 'user-message';
  messageElement.textContent = message;
  
  messagesContainer.appendChild(messageElement);
  scrollToBottom();
}

// Add bot message to chat
function addBotMessage(message, isTyping = true) {
  const messagesContainer = document.getElementById('chatbot-messages');
  
  // Add typing indicator
  if (isTyping) {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'bot-message typing-indicator';
    typingIndicator.innerHTML = `<span>${getCurrentTranslation('typingIndicator')}</span>`;
    typingIndicator.id = 'typing-indicator';
    messagesContainer.appendChild(typingIndicator);
    scrollToBottom();
    
    // Remove typing indicator after delay and add actual message
    setTimeout(() => {
      typingIndicator.remove();
      const messageElement = document.createElement('div');
      messageElement.className = 'bot-message';
      messageElement.textContent = message;
      messagesContainer.appendChild(messageElement);
      scrollToBottom();
      showSuggestedQuestions();
    }, 1000 + Math.random() * 1000); // Random typing time between 1-2 seconds
  } else {
    // Add message immediately without typing effect
    const messageElement = document.createElement('div');
    messageElement.className = 'bot-message';
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
  }
}

// Process user message and generate response
function processUserMessage(message) {
  // Check if message mentions price, buying, or ordering
  if (/price|cost|buy|order|purchase|sale|discount/i.test(message)) {
    addBotMessage(getResponseFromKnowledgeBase('showcase_only'));
    return;
  }
  
  // Try to match intent
  let matched = false;
  for (const intent of intents) {
    if (intent.pattern.test(message)) {
      const response = getResponseFromKnowledgeBase(intent.response);
      addBotMessage(response);
      matched = true;
      break;
    }
  }
  
  // Default response if no intent matched
  if (!matched) {
    addBotMessage(getResponseFromKnowledgeBase('default'));
  }
}

// Get response from knowledge base based on current language
function getResponseFromKnowledgeBase(key) {
  // Try to get response in current language
  const langKnowledgeBase = knowledgeBase[chatbotLanguage] || knowledgeBase.en;
  return langKnowledgeBase[key] || langKnowledgeBase.default;
}

// Show suggested questions
function showSuggestedQuestions() {
  const suggestedContainer = document.getElementById('suggested-questions');
  suggestedContainer.innerHTML = '';
  
  const questions = getCurrentTranslation('suggestedQuestions');
  
  questions.forEach(question => {
    const questionElement = document.createElement('div');
    questionElement.className = 'suggested-question';
    questionElement.textContent = question;
    suggestedContainer.appendChild(questionElement);
  });
}

// Scroll chat to bottom
function scrollToBottom() {
  const messagesContainer = document.getElementById('chatbot-messages');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Get current translation based on chatbot language
function getCurrentTranslation(key) {
  const translations = botTranslations[chatbotLanguage] || botTranslations.en;
  return translations[key] || botTranslations.en[key];
}

// Update chatbot language
function updateChatbotLanguage(langCode) {
  chatbotLanguage = langCode;
  
  // Update placeholders and static text
  document.getElementById('chatbot-input').placeholder = getCurrentTranslation('placeholderText');
  document.querySelector('.showcase-notice').textContent = getCurrentTranslation('showcaseNotice');
  
  // Update suggested questions
  showSuggestedQuestions();
}

// Export function for use by translation system
window.updateChatbotLanguage = updateChatbotLanguage;

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', initChatbot);

// CSS for chatbot - will be injected into the head
const chatbotStyles = `
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 500px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
  transition: all 0.3s ease;
}

.chatbot-container.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: all;
}

.chatbot-bubble {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: var(--gold-color, #D4AF37);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 999;
  transform: scale(0);
  opacity: 0;
  transition: all 0.3s ease;
}

.chatbot-bubble.show {
  transform: scale(1);
  opacity: 1;
}

.chatbot-bubble i {
  color: white;
  font-size: 24px;
}

.chatbot-header {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--gold-color, #D4AF37);
  color: white;
}

.chatbot-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  background-color: white;
}

.chatbot-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chatbot-title {
  flex: 1;
  font-weight: 500;
}

.chatbot-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.chatbot-body {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background-color: #f5f5f5;
}

.chatbot-messages {
  display: flex;
  flex-direction: column;
}

.bot-message, .user-message {
  max-width: 80%;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 18px;
  line-height: 1.4;
  word-wrap: break-word;
}

.bot-message {
  align-self: flex-start;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.user-message {
  align-self: flex-end;
  background-color: var(--gold-color, #D4AF37);
  color: white;
}

.typing-indicator {
  padding: 8px 15px;
}

.typing-indicator span {
  display: inline-block;
  animation: dotTyping 1.5s infinite;
}

@keyframes dotTyping {
  0% { content: "Typing"; }
  25% { content: "Typing."; }
  50% { content: "Typing.."; }
  75% { content: "Typing..."; }
}

.chatbot-footer {
  padding: 15px;
  border-top: 1px solid #eee;
  background-color: white;
}

.showcase-notice {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
  font-style: italic;
}

.chatbot-input-group {
  display: flex;
  align-items: center;
}

.chatbot-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  margin-right: 10px;
}

.chatbot-input:focus {
  border-color: var(--gold-color, #D4AF37);
}

.chatbot-send {
  background-color: var(--gold-color, #D4AF37);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.chatbot-send i {
  font-size: 14px;
}

.suggested-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.suggested-question {
  font-size: 12px;
  padding: 5px 10px;
  background-color: #f0f0f0;
  border-radius: 15px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggested-question:hover {
  background-color: #e0e0e0;
}

.language-selector {
  margin-right: 15px;
  display: flex;
  align-items: center;
}

.lang-icon {
  margin-right: 5px;
  color: white;
}

#language-dropdown {
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .chatbot-container {
    width: calc(100% - 40px);
    height: 60vh;
  }
}
`;

// Inject chatbot styles
function injectChatbotStyles() {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = chatbotStyles;
  document.head.appendChild(styleElement);
}

// Call style injection function
injectChatbotStyles(); 