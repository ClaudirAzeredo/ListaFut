import React from 'react';
import './Telaloginjogador.css';

const Telaloginjogador = () => {
  return (
    <div className="container">
      <div className="logo">
        <img src="logobola.png" alt="Logo PeladeirosFC" />
      </div>
      <h1 className="title">
        <span className="green">Peladeiros</span><span className="red">FC</span>
      </h1>
      <p className="subtitle">Digite o nome da lista</p>
      <input
        type="text"
        className="input"
        placeholder="Digite o link do jogador"
      />
      <button className="button">Go!</button>
    </div>
  );
};

export default Telaloginjogador;
