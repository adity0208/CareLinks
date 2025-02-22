import React, { useState, useCallback } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';
import { SpeechRecognitionService } from '../../services/voice/speechRecognition';
import { VoiceInputResult } from '../../types/i18n';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language: string;
  placeholder?: string;
}

export default function VoiceInput({ 
  onTranscript, 
  language,
  placeholder = 'Click the microphone to start speaking...'
}: VoiceInputProps) {
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

  const toggleListening = async () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      speechService.setLanguage(language);
      await speechService.startListening(handleResult);
      setIsListening(true);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
        <button
          onClick={toggleListening}
          className={`p-2 rounded-full ${
            isListening ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
          } hover:opacity-80 transition-opacity`}
        >
          {isListening ? (
            <div className="relative">
              <MicOff className="w-5 h-5" />
              <Loader className="w-5 h-5 absolute top-0 left-0 animate-spin" />
            </div>
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
        <div className="flex-1">
          {transcript ? (
            <p className="text-gray-700">{transcript}</p>
          ) : (
            <p className="text-gray-500">{placeholder}</p>
          )}
        </div>
      </div>
    </div>
  );
}