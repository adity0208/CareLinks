import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { FirebaseAppProvider } from 'reactfire';
import { firebaseConfig } from './config/firebase';
import { TranslationProvider } from './components/common/TranslationProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
      <BrowserRouter>
        <TranslationProvider>
          <App />
        </TranslationProvider>
      </BrowserRouter>
    </FirebaseAppProvider>
  </React.StrictMode>
);
