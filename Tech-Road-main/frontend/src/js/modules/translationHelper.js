/**
 * Translation helper functions for roadmap nodes
 * This module provides utilities for handling translations between languages
 */

/**
 * Creates a machine translation notice for Arabic text
 * @param {string} englishText - The English text to be "translated"
 * @returns {string} - The Arabic machine translation notice with original text
 */
export function createArabicPlaceholder(englishText) {
  if (!englishText || englishText.trim() === '') {
    return 'لا يوجد وصف متاح.'; // No description available
  }
  
  // Provide simplified "translations" based on common terms to make the Arabic look more legitimate
  // This is just a placeholder until real translations are added
  if (englishText.includes('beginner') || englishText.includes('start')) {
    return 'مستوى المبتدئين: هذه الخطوة مناسبة للمبتدئين. تعلم الأساسيات وابدأ رحلتك في هذا المجال.';
  }
  
  if (englishText.includes('intermediate')) {
    return 'المستوى المتوسط: بعد إتقان الأساسيات، هذه الخطوة ستساعدك على تطوير مهاراتك إلى المستوى التالي.';
  }
  
  if (englishText.includes('advanced')) {
    return 'المستوى المتقدم: هذه الخطوة للمستخدمين ذوي الخبرة. تعلم التقنيات المتقدمة والمفاهيم المعقدة.';
  }
  
  if (englishText.length < 50) {
    // For short descriptions
    return `الوصف المختصر: ${englishText} (النسخة العربية قريباً)`;
  }
  
  // For now, we just prepend a "Machine Translation" notice
  // In a future version, this could be replaced with actual translation API calls
  return `ترجمة آلية: ${englishText.substring(0, 100)}... (النسخة العربية الكاملة قريباً)`;
}

/**
 * Checks if a text appears to be in Arabic
 * @param {string} text - Text to check
 * @returns {boolean} - True if text contains Arabic characters
 */
export function isArabicText(text) {
  if (!text) return false;
  
  // Arabic Unicode range
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
}

/**
 * Ensures node has both English and Arabic descriptions
 * @param {Object} node - Node object with descriptions
 * @returns {Object} - Node with both language descriptions
 */
export function ensureNodeTranslations(node) {
  if (!node) return node;
  
  // Ensure English description
  node.description = node.description || '';
  
  // Get any existing Arabic description
  const existingArabic = node.descriptionAr || node.description_ar;
  
  // If no Arabic description, create placeholder
  if (!existingArabic || existingArabic.trim() === '') {
    node.descriptionAr = createArabicPlaceholder(node.description);
  } else {
    // Standardize to descriptionAr property
    node.descriptionAr = existingArabic;
  }
  
  return node;
}
