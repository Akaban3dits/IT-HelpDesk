import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Importa BrowserRouter
import App from './App';
import './index.css';  // Asegúrate de que este archivo esté importado
import { AppProvider } from './context/AppContext';

if (process.env.NODE_ENV === 'development') {
  const consoleWarn = console.warn;
  console.warn = (message, ...args) => {
    if (!message.includes('Support for defaultProps will be removed')) {
      consoleWarn(message, ...args);
    }
  };
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> 
      <AppProvider>
        <App />
      </AppProvider>
    </Router>
  </React.StrictMode>
);
