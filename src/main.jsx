import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './Login.css';
import Login from './Login';
import LoginOrganizador from './LoginOrganizador';
import App from './App';
import Teladeposicoes from './Teladeposicoes';
import Telaloginjogador from './TelaLoginJogador.'; // ✅ Importação adicionada

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/organizador" element={<LoginOrganizador />} />
        <Route path="/app" element={<App />} />
        <Route path="/formacao" element={<Teladeposicoes />} />
        <Route path="/jogador" element={<Telaloginjogador />} /> {/* ✅ Nova rota */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
