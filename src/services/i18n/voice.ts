import { VoiceInputResult } from '../../types/i18n';

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private language: string = 'en-US';

  constructor() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
    }
  }

  public setLanguage(language: string) {
    this.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  public async startListening(onResult: (result: VoiceInputResult) => void): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition is not supported in this browser');
    }

    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition is not supported'));
        return;
      }

      this.recognition.onstart = () => {
        resolve();
      };

      this.recognition.onerror = (event) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        const transcript = lastResult[0].transcript;
        const confidence = lastResult[0].confidence;
        const isFinal = lastResult.isFinal;

        onResult({
          transcript,
          confidence,
          isFinal
        });
      };

      this.recognition.start();
    });
  }

  public stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }
}
