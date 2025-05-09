import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const handleLogin = (tipo) => {
    if (tipo === 'organizador') {
      navigate('/organizador');
    } else if (tipo === 'jogador') {
      navigate('/app');
    }
  };

  return (
    <div className="login-container">
      <img
        src="logobola.png"
        alt="Logo PeladeirosFC"
        className="logo"
      />
      <h1 className="title">
        <span className="green">Peladeiros</span>
        <span className="red">FC</span>
      </h1>
      <p className="subtitle">Escolha como deseja logar!</p>
      <div className="button-group">
        <button className="login-button" onClick={() => handleLogin('jogador')}>
          Sou Jogador!
        </button>
        <button className="login-button" onClick={() => handleLogin('organizador')}>
          Sou Organizador!
        </button>
      </div>
      <p className="footer">Seja bem-vindo!</p>
    </div>
  );
}

export default Login;
