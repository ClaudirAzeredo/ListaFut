import { Routes, Route, Navigate } from 'react-router-dom';
import GerenciarListaWrapper from './ListaOrganizador/GerenciarListaWrapper.jsx';
import JogadorLista from './ListaJogador/JogadorLista.jsx';
import LoginOrganizador from './LoginOrganizador.jsx';
import Login from "./Telas/Login.jsx";
import TelaLoginJogador from "./Telas/TelaLoginJogador.jsx";
import TeladePosicoes from "./Telas/Teladeposicoes.jsx";
import CadastroOrganizador from './CadastroOrganizador.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import './Style/App.css';

export default function App() {
  return (
    <div className="gerenciar-page">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/loginJogador" element={<TelaLoginJogador />} />
        <Route path="/organizador" element={<LoginOrganizador />} />
        <Route path="/cadastroOrganizador" element={<CadastroOrganizador />} />
        <Route path="/gerenciar/:listaId" element={<PrivateRoute><GerenciarListaWrapper /></PrivateRoute>} />
        <Route path="/formacao" element={<TeladePosicoes />} />
        <Route path="/jogador/:listaId/:jogadorId" element={<JogadorLista />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
