import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { ref, onValue, update } from 'firebase/database';
import { database } from "../../firebase";
import './JogadorLista.css';

export default function JogadorLista() {
  const { listaId, jogadorId } = useParams();
  const [jogadores, setJogadores] = useState([]);
  const [meuJogador, setMeuJogador] = useState(null);
  const [posicao, setPosicao] = useState('');
  const [confirmado, setConfirmado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!listaId || !jogadorId) {
      setErro('ID da lista ou do jogador está vazio.');
      setLoading(false);
      return;
    }

    const refPublicos = ref(database, `listas/${listaId}/jogadoresPublicos`);
    const refPrivado = ref(database, `listas/${listaId}/jogadoresPrivados/${jogadorId}`);

    const unsubPublicos = onValue(refPublicos, (snapshotPublicos) => {
      const dataPublica = snapshotPublicos.val();
      if (dataPublica) {
        const jogadoresArray = Object.entries(dataPublica).map(([id, jogador]) => ({ id, ...jogador }));
        setJogadores(jogadoresArray);
      } else {
        setJogadores([]);
      }
    });

    const unsubPrivado = onValue(refPrivado, (snapshotPrivado) => {
      const dadosPrivados = snapshotPrivado.val();
      if (dadosPrivados) {
        setMeuJogador(dadosPrivados);
        setPosicao(dadosPrivados.posicao || '');
        setConfirmado(dadosPrivados.presente || false);
        setErro('');
      } else {
        setMeuJogador(null);
        setErro('Jogador não encontrado.');
      }
      setLoading(false);
    }, (error) => {
      console.error('Erro ao ler jogador privado:', error);
      setErro('Erro ao acessar dados do jogador.');
      setLoading(false);
    });

    return () => {
      unsubPublicos();
      unsubPrivado();
    };
  }, [listaId, jogadorId]);

  const validarLista = () => {
    const confirmedPlayers = jogadores
      .filter(j => j.presente && !j.removido)
      .map((j, i) => ({
        id: i + 1,
        name: j.nome,
      }));
    // localStorage.setItem('uniformColor', corUniforme); //
    localStorage.setItem('confirmedPlayers', JSON.stringify(confirmedPlayers));
    navigate('/formacao');
  };

  const confirmarPresenca = () => {
    if (!posicao) {
      alert('Por favor, selecione uma posição antes de confirmar presença.');
      return;
    }

    const refPrivado = ref(database, `listas/${listaId}/jogadoresPrivados/${jogadorId}`);
    const refPublico = ref(database, `listas/${listaId}/jogadoresPublicos/${jogadorId}`);

    Promise.all([
      update(refPrivado, { presente: true, posicao }),
      update(refPublico, { nome: meuJogador.nome, presente: true, posicao }),
    ])
      .then(() => {
        setConfirmado(true);
        setErro('');
      })
      .catch((error) => {
        setErro('Erro ao confirmar presença. Tente novamente.');
        console.error(error);
      });
  };

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p style={{ color: 'red' }}>{erro}</p>;
  if (!meuJogador) return <p>Jogador não encontrado.</p>;

  return (
    <div className="gerenciar-page">
      <div className="gerenciar-container">
        <h1 className="gerenciar-title">Olá, {meuJogador.nome}</h1>

        <div className="add-player-form presenca-box">
          <label htmlFor="posicao-select" style={{ fontWeight: 'bold' }}>
            Posição desejada:
            <select
              id="posicao-select"
              value={posicao}
              onChange={(e) => setPosicao(e.target.value)}
              disabled={confirmado}
              className="player-input"
            >
              <option value="">Selecione</option>
              <option value="Goleiro">Goleiro</option>
              <option value="Zagueiro">Zagueiro</option>
              <option value="Lateral">Lateral</option>
              <option value="Meio-Campo">Meio-Campo</option>
              <option value="Atacante">Atacante</option>
            </select>
          </label>

          <button
            onClick={confirmarPresenca}
            className="confirm-button"
            disabled={confirmado}
          >
            {confirmado ? 'Presença Confirmada' : 'Confirmar Presença'}
          </button>

          {erro && <p className="error-message" style={{ color: 'red' }}>{erro}</p>}
        </div>

        <h2 className="section-title">Jogadores Confirmados</h2>
        <ul className="players-list confirmed-list">
          {jogadores
            .filter(j => j.presente)
            .map(j => (
              <li key={j.id} className="player-item confirmed-player">
                <span className="player-name">{j.nome} - {j.posicao || 'Posição não definida'}</span>
              </li>
            ))}
        </ul>
        <div> 
        <button onClick={validarLista} className="list-button validate-list">Verificar Escalação</button>
        </div>  
    </div>
    </div>
  );
}
