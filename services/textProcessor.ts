
/**
 * Mimics production-grade ML text preprocessing:
 * 1. Lowercasing
 * 2. HTML artifact removal
 * 3. Punctuation/Number removal
 * 4. Tokenization
 */
export const preprocessText = (text: string): string => {
  let cleaned = text.toLowerCase();
  
  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>?/gm, '');
  
  // Remove URLs
  cleaned = cleaned.replace(/https?:\/\/\S+|www\.\S+/gm, '');
  
  // Remove numbers and punctuation (keep spaces)
  cleaned = cleaned.replace(/[0-9]|[^a-zA-Z\s]/gm, '');
  
  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
};

export const getTokenCount = (text: string): number => {
  return text.split(/\s+/).length;
};
