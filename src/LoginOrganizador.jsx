import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginOrganizador.css';

function LoginOrganizador() {
  const navigate = useNavigate();
  const [listName, setListName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoClick = () => {
    if (!listName.trim()) {
      alert('Por favor, digite o nome da lista');
      return;
    }
    if (!email.trim()) {
      alert('Por favor, digite seu email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, digite um email válido');
      return;
    }
    if (!password.trim()) {
      alert('Por favor, digite sua senha');
      return;
    }

    navigate('/App'); // ou a rota que preferir
  };

  return (
    <div className="login-organizador-container">
      <div className="login-organizador-box">
        <img src="/logobola.png" alt="Logo PeladeirosFC" className="logo" />
        <h1 className="login-organizador-title">Digite o nome da lista</h1>

        <div className="login-organizador-form">
          <div className="form-group">
            <label className="form-label" htmlFor="listName">Nome Lista:</label>
            <input
              id="listName"
              className="form-input"
              type="text"
              placeholder="Digite o nome da lista"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail:</label>
            <input
              id="email"
              className="form-input"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Senha:</label>
            <input
              id="password"
              className="form-input"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="login-organizador-button-container">
            <button className="login-organizador-button" onClick={handleGoClick}>
              Go!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginOrganizador;
