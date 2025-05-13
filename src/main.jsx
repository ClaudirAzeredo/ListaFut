import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './Login.css';
import Login from './Login';
import LoginOrganizador from './LoginOrganizador';
import App from './App'; // Importando o componente App
import Teladeposicoes from './Teladeposicoes'; // Tela de posições

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/organizador" element={<LoginOrganizador />} />
        <Route path="/app" element={<App />} />
        <Route path="/formacao" element={<Teladeposicoes />} /> {/* NOVA ROTA AQUI */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
