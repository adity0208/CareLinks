import { useState, useCallback } from 'react';
import { SpeechRecognitionService } from '../services/i18n/voice';
import { VoiceInputResult } from '../types/i18n';

export function useVoiceInput(language: string, onTranscript: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechService] = useState(() => new SpeechRecognitionService());

  const handleResult = useCallback((result: VoiceInputResult) => {
    setTranscript(result.transcript);
    if (result.isFinal) {
      onTranscript(result.transcript);
      setIsListening(false);
    }
  }, [onTranscript]);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      speechService.setLanguage(language);
      await speechService.startListening(handleResult);
      setIsListening(true);
    }
  }, [isListening, language, speechService, handleResult]);

  return {
    isListening,
    transcript,
    toggleListening
  };
}