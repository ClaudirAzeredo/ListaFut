import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './Login.css';
import Login from './Login';
import LoginOrganizador from './LoginOrganizador';
import App from './App';
import Teladeposicoes from './Teladeposicoes';
import Telaloginjogador from './TelaLoginJogador.'; // ✅ Importação adicionada
import CadastroOrganizador from './CadastroOrganizador';
import GerenciarLista from './GerenciarLista';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Organizador" element={<LoginOrganizador />} />
        <Route path="/CadastroOrganizador" element={<CadastroOrganizador />} />
        <Route path="/gerenciar/:id" element={<GerenciarLista />} />
        <Route path="/app" element={<App />} />
        <Route path="/formacao" element={<Teladeposicoes />} />
        <Route path="/jogador" element={<Telaloginjogador />} /> {/* ✅ Nova rota */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
