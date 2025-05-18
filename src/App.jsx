import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ref, onValue, set } from "firebase/database";
import { database } from "./firebase";
import './App.css';

export default function App() {
  const [jogadores, setJogadores] = useState([]);
  const [nome, setNome] = useState("");
  const [corUniforme, setCorUniforme] = useState("#00b894")
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const jogadoresRef = ref(database, "jogadores");
    onValue(jogadoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Array.isArray(data) ? data : Object.values(data);
        setJogadores(lista);
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
        const novaLista = [...jogadores, {
          id: Date.now(),
          nome: nomeLimpo,
          presente: false,
          emoji: "",
          removido: false
        }];
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
    if (window.confirm("Tem certeza que deseja apagar toda a lista?")) {
      salvarNoFirebase([]);
    }
  };

  const alternarPresenca = (index) => {
    const novaLista = [...jogadores];
    novaLista[index].presente = !novaLista[index].presente;
    salvarNoFirebase(novaLista);
  };

  const totalJogadores = jogadores.length;
  const totalConfirmados = jogadores.filter(j => j.presente).length;

  return (
    <div className="gerenciar-page">
      <div className="gerenciar-container">
        <h1 className="gerenciar-title">Lista da Pelada</h1>

        <div className="add-player-form">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="player-input"
            placeholder="Nome do jogador"
          />
          <button onClick={adicionarJogador} className="add-button">Adicionar</button>
        </div>

        <p>Total: {totalJogadores} | Confirmados: {totalConfirmados}</p>

        <h2 className="section-title">Jogadores</h2>
        <ul className="players-list">
          {jogadores.map((jogador, index) => (
            <li
              key={jogador.id}
              className={`player-item ${jogador.removido ? "removed-player" : ""} ${jogador.presente ? "confirmed-player" : ""}`}
            >
              <span className="player-name">
                {jogador.emoji
                  ? `${jogador.nome} ${jogador.emoji}`
                  : jogador.nome}
              </span>

              <div className="player-actions">
                {!jogador.removido ? (
                  <>
                    <button
                      className="remove-button"
                      onClick={() => removerJogador(index)}
                    >❌</button>
                    <button
                      className={`confirm-button ${jogador.presente ? "confirmed" : ""}`}
                      onClick={() => alternarPresenca(index)}
                    >✅</button>
                  </>
                ) : (
                  <button className="restaurar-btn" onClick={() => restaurarJogador(index)}>
                    🔄
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        <h2 className="section-title">Confirmados</h2>
        <ul className="players-list confirmed-list">
          {jogadores
            .filter(j => j.presente)
            .map(jogador => (
              <li key={jogador.id} className="player-item confirmed-player">
                <span className="player-name">{jogador.nome}</span>
              </li>
            ))}
        </ul>
          <div className="color-picker-container">
            <span>Selecione a cor do uniforme:</span>
            <input
              type="color"
              value={corUniforme}
              onChange={(e) => setCorUniforme(e.target.value)}
              className="color-picker"
            />
            <div className="color-preview" style={{ backgroundColor: corUniforme }}></div>
          </div>

        <div className="button-container">
          <button onClick={criarNovaLista} className="list-button new-list">Nova Lista</button>
          <button onClick={validarLista} className="list-button validate-list">Validar Lista</button>
        </div>
      </div>
    </div>
  );
}
