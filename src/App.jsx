import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

export default function App() {
  const [jogadores, setJogadores] = useState([]);
  const [nome, setNome] = useState("");

  // Carrega os jogadores do localStorage ao iniciar
  useEffect(() => {
    const jogadoresSalvos = localStorage.getItem("jogadores");
    if (jogadoresSalvos) {
      setJogadores(JSON.parse(jogadoresSalvos));
    }
  }, []);

  // Salva os jogadores no localStorage sempre que mudar
  useEffect(() => {
    if (jogadores.length > 0) {
      localStorage.setItem("jogadores", JSON.stringify(jogadores));
    }
  }, [jogadores]);

  const adicionarJogador = () => {
    const nomeLimpo = nome.replace(/\\/g, "").trim();
    if (nomeLimpo !== "") {
      const nomeExiste = jogadores.some(j => j.nome.toLowerCase() === nomeLimpo.toLowerCase());
      if (!nomeExiste) {
        setJogadores([...jogadores, { nome: nomeLimpo, presente: false, emoji: "", removido: false }]);
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
    novaLista[index].emoji = emoji; // corrigido aqui
    novaLista[index].presente = false;
    setJogadores(novaLista); // corrigido aqui
  };

  const restaurarJogador = (index) => {
    const novosJogadores = [...jogadores];
    novosJogadores[index].emoji = "";
    novosJogadores[index].removido = false;
    setJogadores(novosJogadores);
  };

  const criarNovaLista = () => {
    setJogadores([]);
    localStorage.removeItem("jogadores");
  };

  const alternarPresenca = (index) => {
    const novosJogadores = [...jogadores];
    novosJogadores[index].presente = !novosJogadores[index].presente;
    setJogadores(novosJogadores);
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
                : `${jogador.presente ? "" : ""} ${jogador.nome}`}
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
      </div>

    </div>
  );
}
