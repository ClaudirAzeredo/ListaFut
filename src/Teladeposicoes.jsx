import React, { useState } from 'react';
import './Teladeposicoes.css';
import campoImg from './assets/Campo.png';

const PlayerSlot = ({ positionClass, onClick }) => (
  <div className={`player-slot ${positionClass}`} onClick={onClick}>
    +
  </div>
);

const Teladeposicoes = () => {
  const [showModal, setShowModal] = useState(false);
  const [position, setPosition] = useState('');

  const handleSlotClick = (pos) => {
    setPosition(pos);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPosition('');
  };

  const positions = [
    'GOL', 'LE', 'LD', 'ZAG1', 'ZAG2',
    'VOL', 'MC1', 'MC2',
    'PTE', 'PTD', 'CA'
  ];

  return (
    <div className="container">
      <div className="field-and-bench">
        <div
          className="field"
          style={{ backgroundImage: `url(${campoImg})` }}
        >
          {positions.map((pos) => (
            <PlayerSlot key={pos} positionClass={pos} onClick={() => handleSlotClick(pos)} />
          ))}

          {showModal && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <p><strong>{position.toUpperCase()}</strong>: Nome do Jogador</p>
                <input type="text" placeholder={`Nome do ${position.toUpperCase()}`} />
                <button onClick={closeModal}>Adicionar</button>
              </div>
            </div>
          )}
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
