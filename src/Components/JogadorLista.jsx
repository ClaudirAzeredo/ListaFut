// src/pages/JogadorLista.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, update } from 'firebase/database';
import { database } from "./firebase";

export default function JogadorLista() {
  const { listaId, jogadorId } = useParams();
  const [jogadores, setJogadores] = useState([]);
  const [meuJogador, setMeuJogador] = useState(null);
  const [posicao, setPosicao] = useState('');

  useEffect(() => {
    const listaRef = ref(database, `listas/${listaId}/jogadores`);
    onValue(listaRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const jogadoresArray = Object.entries(data).map(([id, jogador]) => ({ id, ...jogador }));
        setJogadores(jogadoresArray);

        const jogadorAtual = jogadoresArray.find(j => j.id === jogadorId);
        if (jogadorAtual) {
          setMeuJogador(jogadorAtual);
          setPosicao(jogadorAtual.posicao || '');
        }
      }
    });
  }, [listaId, jogadorId]);

  const confirmarPresenca = () => {
    const jogadorRef = ref(database, `listas/${listaId}/jogadores/${jogadorId}`);
    update(jogadorRef, { presente: true, posicao });
  };

  if (!meuJogador) return <p>Carregando...</p>;

  return (
    <div className="jogador-page">
      <h1>Olá, {meuJogador.nome}</h1>
      <div className="presenca-box">
        <label>
          Sua posição:
          <select value={posicao} onChange={(e) => setPosicao(e.target.value)}>
            <option value="">Selecione</option>
            <option value="Goleiro">Goleiro</option>
            <option value="Zagueiro">Zagueiro</option>
            <option value="Lateral">Lateral</option>
            <option value="Meio-Campo">Meio-Campo</option>
            <option value="Atacante">Atacante</option>
          </select>
        </label>
        <button onClick={confirmarPresenca} className="confirmar-btn">
          Confirmar Presença
        </button>
      </div>

      <h2>Jogadores Confirmados</h2>
      <ul className="confirmados-lista">
        {jogadores
          .filter(j => j.presente)
          .map(j => (
            <li key={j.id}>
              {j.nome} - {j.posicao || 'Posição não definida'}
            </li>
          ))}
      </ul>
    </div>
  );
}
