import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginOrganizador.css';

function LoginOrganizador() {
  const navigate = useNavigate();

  const handleGoClick = () => {
    // Aqui você pode validar os dados, se necessário
    navigate('/App'); // Redireciona para a rota '/lista'
  };

  return (
    <div className="login-organizador-container">
      <img src="logobola.png" alt="Logo PeladeirosFC" className="logo" />
      <h1 className="title">
        <span className="green">Peladeiros</span>
        <span className="red">FC</span>
      </h1>
      <p className="subtitle">Digite o nome da lista</p>
      <div className="form-group">
        <label>Nome Lista:</label>
        <input type="text" placeholder="Digite o nome da lista" />
        <label>E-mail:</label>
        <input type="email" placeholder="Digite seu email" />
        <label>Senha:</label>
        <input type="password" placeholder="Digite sua senha" />
        <button className="go-button" onClick={handleGoClick}>Go!</button>
      </div>
    </div>
  );
}

export default LoginOrganizador;
