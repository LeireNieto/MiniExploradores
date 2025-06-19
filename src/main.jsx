import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './styles/app.css';
import { AppProvider } from './components/appcontext';
import { FavoritosProvider } from './components/favoritos';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <FavoritosProvider>
        <App />
      </FavoritosProvider>
    </AppProvider>
  </React.StrictMode>
);
