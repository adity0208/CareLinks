// Map language codes to speech recognition language codes
export const getSpeechLanguageCode = (languageCode: string): string => {
  const mappings: Record<string, string> = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'bn': 'bn-IN',
    'ta': 'ta-IN',
    'te': 'te-IN',
    'mr': 'mr-IN'
  };

  return mappings[languageCode] || 'en-US';
};