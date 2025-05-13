import { useEffect, useState } from 'react';
import { ref, onValue, set } from "firebase/database";
import { database } from "./firebase";
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function App() {
  const [jogadores, setJogadores] = useState([]);
  const [nome, setNome] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const jogadoresRef = ref(database, "jogadores");
    onValue(jogadoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setJogadores(data);
      } else {
        setJogadores([]);
      }
    });
  }, []);

  const salvarNoFirebase = (lista) => {
    set(ref(database, "jogadores"), lista);
  };

  const adicionarJogador = () => {
    const nomeLimpo = nome.replace(/\\/g, "").trim();
    if (nomeLimpo !== "") {
      const nomeExiste = jogadores.some(j => j.nome.toLowerCase() === nomeLimpo.toLowerCase());
      if (!nomeExiste) {
        const novaLista = [...jogadores, { nome: nomeLimpo, presente: false, emoji: "", removido: false }];
        salvarNoFirebase(novaLista);
        setNome("");
      } else {
        alert("Jogador já está na lista!");
      }
    }
  };

  const removerJogador = (index) => {
    const novaLista = [...jogadores];
    const emoji = Math.random() > 0.5 ? "🚺" : "🤕";
    novaLista[index].removido = true;
    novaLista[index].emoji = emoji;
    novaLista[index].presente = false;
    salvarNoFirebase(novaLista);
  };

  const restaurarJogador = (index) => {
    const novaLista = [...jogadores];
    novaLista[index].emoji = "";
    novaLista[index].removido = false;
    salvarNoFirebase(novaLista);
  };

  const criarNovaLista = () => {
    salvarNoFirebase([]);
  };

  const alternarPresenca = (index) => {
    const novaLista = [...jogadores];
    novaLista[index].presente = !novaLista[index].presente;
    salvarNoFirebase(novaLista);
  };

  const validarLista = () => {
    navigate('/formacao');
  };

  return (
    <div className="container">
      <h1>Lista da Pelada</h1>
      <div className="input-area">
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do jogador"
        />
        <button onClick={adicionarJogador}>Adicionar</button>
      </div>

      <h2>Jogadores</h2>
      <ul className="lista lista-jogadores">
        {jogadores.map((jogador, index) => (
          <li
            key={index}
            className={`jogador ${jogador.presente ? "presente" : ""} ${jogador.removido ? "removido" : ""}`}
          >
            <span onClick={() => alternarPresenca(index)}>
              {jogador.emoji
                ? `${jogador.nome} ${jogador.emoji}`
                : `${jogador.nome}`}
            </span>

            <div className="botoes-jogador">
              {!jogador.removido && (
                <>
                  <button className="remove-btn" onClick={() => removerJogador(index)}>❌</button>
                  <button className="confirmar-btn" onClick={() => alternarPresenca(index)}>✅</button>
                </>
              )}
              {jogador.removido && (
                <button className="restaurar-btn" onClick={() => restaurarJogador(index)}>🔄</button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <h2>Confirmados</h2>
      <ul className="lista lista-confirmados">
        {jogadores
          .filter(jogador => jogador.presente)
          .map((jogador, index) => (
            <li key={index} className="jogador">
              {jogador.nome}
            </li>
          ))}
      </ul>

      <div className="buttons">
        <button onClick={criarNovaLista} className="new-list-btn">Nova Lista</button>
        <button onClick={validarLista} className="save-list-btn">Validar Lista</button>
      </div>
    </div>
  );
}
