import React from 'react';
import Layout from './components/Layout';
import AppRoutes from './routes/Routes';

function App() {
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

export default App;