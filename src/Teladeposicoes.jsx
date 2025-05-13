import React from 'react';
import './Teladeposicoes.css';
import campoImg from './assets/Campo.png'; // ajuste o caminho se necessário

const Teladeposicoes = () => {
  return (
    <div className="container">
      <div className="field-and-bench">
        <div
          className="field"
          style={{ backgroundImage: `url(${campoImg})` }}
        >
          <div className="player-slot gk" />
          <div className="player-slot d1" />
          <div className="player-slot d2" />
          <div className="player-slot d3" />
          <div className="player-slot d4" />
          <div className="player-slot m1" />
          <div className="player-slot m2" />
          <div className="player-slot a1" />
          <div className="player-slot a2" />
          <div className="player-slot a3" />
        </div>

        <div className="bench">
          <p>Banco:</p>
          <ul>
            <li>1:</li>
            <li>2:</li>
            <li>3:</li>
            <li>4:</li>
            <li>5:</li>
          </ul>
        </div>
      </div>

      <div className="position-selector">
        <p>Posição</p>
        <div className="position-buttons">
          <button>ATA</button>
          <button>MC</button>
          <button>ZAG</button>
          <button>LAT</button>
          <button>GOL</button>
        </div>
      </div>

      <button className="confirm-button">Usar OK</button>
    </div>
  );
};

export default Teladeposicoes;
