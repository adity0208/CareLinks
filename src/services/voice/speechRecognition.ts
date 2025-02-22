import { VoiceInputResult } from '../../types/i18n';

// Mock Google Cloud Speech-to-Text API
export class SpeechRecognitionService {
  private isListening: boolean = false;
  private onResultCallback: (result: VoiceInputResult) => void = () => {};
  private language: string = 'en-US';

  setLanguage(languageCode: string) {
    this.language = languageCode;
  }

  async startListening(
    onResult: (result: VoiceInputResult) => void
  ): Promise<void> {
    if (this.isListening) return;
    
    this.isListening = true;
    this.onResultCallback = onResult;

    // Simulate continuous speech recognition
    this.simulateRecognition();
  }

  stopListening(): void {
    this.isListening = false;
  }

  private async simulateRecognition() {
    if (!this.isListening) return;

    // Simulate interim results
    this.onResultCallback({
      transcript: 'Patient shows symptoms of...',
      confidence: 0.85,
      isFinal: false
    });

    // Simulate final result after delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (this.isListening) {
      this.onResultCallback({
        transcript: 'Patient shows symptoms of fever and cough',
        confidence: 0.95,
        isFinal: true
      });
    }

    this.isListening = false;
  }
}