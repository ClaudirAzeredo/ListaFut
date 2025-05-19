import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/TelaLoginJogador.css';

const TelaLoginJogador = () => {
  const [link, setLink] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const entrarNaLista = () => {
    try {
      const url = new URL(link);
      const paths = url.pathname.split('/').filter(Boolean);

      // aceitar os dois formatos possíveis:
      if (
        paths.length === 4 &&
        paths[0] === 'lista' &&
        paths[2] === 'jogador'
      ) {
        const listaId = paths[1];
        const jogadorId = paths[3];
        navigate(`/jogador/${listaId}/${jogadorId}`);
      } else if (
        paths.length === 3 &&
        paths[0] === 'jogador'
      ) {
        const listaId = paths[1];
        const jogadorId = paths[2];
        navigate(`/jogador/${listaId}/${jogadorId}`);
      } else {
        setErro('Link inválido. Certifique-se de colar o link completo no formato correto.');
      }
    } catch (e) {
      setErro('Link inválido. Cole o link completo recebido.');
    }
  };

  return (
    <div className="container">
      <div className="logo">
        <img src="logobola.png" alt="Logo PeladeirosFC" />
      </div>
      <h1 className="title">
        <span className="green">Peladeiros</span><span className="red">FC</span>
      </h1>
      <p className="subtitle">Cole o link do jogador</p>
      <input
        type="text"
        className="input"
        placeholder="Cole aqui o link do jogador"
        value={link}
        onChange={(e) => {
          setLink(e.target.value);
          setErro('');
        }}
      />
      <button className="button" onClick={entrarNaLista}>Go!</button>
      {erro && <p style={{ color: 'red', marginTop: '10px' }}>{erro}</p>}
    </div>
  );
};

export default TelaLoginJogador;
