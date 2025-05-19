import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { database } from '../../firebase';
import "../Style/GerenciarLista.css";

export default function GerenciarLista({ listaId }) {
  const [jogadores, setJogadores] = useState([]);
  const [nome, setNome] = useState('');
  const [user, setUser] = useState(null);
  const [corUniforme, setCorUniforme] = useState("#00b894");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [carregandoJogadores, setCarregandoJogadores] = useState(true);

  // Observa estado de autenticação
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

 const gerarLinkAcesso = (listaId, jogadorId) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/jogador/${listaId}/${jogadorId}`;
};

const copiarLink = (listaId, jogadorId) => {
  const link = gerarLinkAcesso(listaId, jogadorId);
  navigator.clipboard.writeText(link)
    .then(() => alert('Link copiado para a área de transferência!'))
    .catch(() => alert('Falha ao copiar o link'));
};
  // Carrega jogadores privados
  useEffect(() => {
    if (!listaId || !user) return;

    setCarregandoJogadores(true);

    const listaPrivadaRef = ref(database, `listas/${listaId}/jogadoresPrivados`);
    const unsubscribe = onValue(listaPrivadaRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const jogadoresArray = Object.entries(data).map(([id, jogador]) => ({ id, ...jogador }));
        setJogadores(jogadoresArray);
      } else {
        setJogadores([]);
      }
      setCarregandoJogadores(false);
    });

    return () => unsubscribe();
  }, [listaId, user]);

  // Gera ID simples para jogador
  const gerarId = () => Math.random().toString(36).substring(2, 9);

  // Salva lista no Firebase (dados privados e públicos)
  const salvarJogadores = (lista) => {
    if (!listaId) return;

    // Atualiza dados privados
    const listaPrivadaRef = ref(database, `listas/${listaId}/jogadoresPrivados`);
    const dadosPrivados = lista.reduce((acc, jogador) => {
      acc[jogador.id || gerarId()] = jogador;
      return acc;
    }, {});

    // Cria dados públicos simplificados (ex: nome, presença, posição)
    const dadosPublicos = lista.reduce((acc, jogador) => {
      acc[jogador.id || gerarId()] = {
        nome: jogador.nome,
        presente: jogador.presente,
        posicao: jogador.posicao || '',
      };
      return acc;
    }, {});

    // Salva ambos no banco
    set(listaPrivadaRef, dadosPrivados);
    const listaPublicaRef = ref(database, `listas/${listaId}/jogadoresPublicos`);
    set(listaPublicaRef, dadosPublicos);
  };

  const validarLista = () => {
    const confirmedPlayers = jogadores
      .filter(j => j.presente && !j.removido)
      .map((j, i) => ({
        id: i + 1,
        name: j.nome,
      }));
    localStorage.setItem('uniformColor', corUniforme);
    localStorage.setItem('confirmedPlayers', JSON.stringify(confirmedPlayers));
    navigate('/formacao');
  };

  const adicionarJogador = () => {
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) return alert('Informe o nome do jogador');

    const existe = jogadores.some((j) => j.nome.toLowerCase() === nomeLimpo.toLowerCase());
    if (existe) return alert('Jogador já está na lista');

    const novoJogador = {
      nome: nomeLimpo,
      presente: false,
      posicao: '',
      id: gerarId(),
    };

    const novaLista = [...jogadores, novoJogador];
    salvarJogadores(novaLista);
    setNome('');
  };

  const criarNovaLista = () => {
    if (window.confirm('Tem certeza que deseja apagar toda a lista?')) {
      salvarJogadores([]);
    }
  };

  const removerJogador = (id) => {
    const novaLista = jogadores.filter((j) => j.id !== id);
    salvarJogadores(novaLista);
  };

  const alternarPresenca = (id) => {
    const novaLista = jogadores.map((j) =>
      j.id === id ? { ...j, presente: !j.presente } : j
    );
    salvarJogadores(novaLista);
  };

  if (loading) return <p>Carregando...</p>;
  if (!user) return <p>Você precisa estar logado para acessar suas listas.</p>;

  const totalJogadores = jogadores.length;
  const totalConfirmados = jogadores.filter(j => j.presente).length;

  return (
    <div className="gerenciar-container">
      <h1 className="gerenciar-title">Gerenciar Lista</h1>

      <div className="add-player-form">
        <input
          className="player-input"
          type="text"
          placeholder="Nome do jogador"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <button className="add-button" onClick={adicionarJogador}>
          Adicionar
        </button>
      </div>

      <p>Total: {totalJogadores} | Confirmados: {totalConfirmados}</p>

      <h2 className="section-title">Jogadores</h2>

      {carregandoJogadores ? (
        <p>Carregando jogadores...</p>
      ) : (
        <ul className="players-list">
          {jogadores.map(({ id, nome, presente, posicao }) => (
            <li key={id} className={`player-item ${presente ? 'confirmed-player' : ''}`}>
              <span className="player-name">
                {nome} {posicao && `- ${posicao}`}
              </span>
              <div className="player-actions">
                <button className="confirm-button" onClick={() => alternarPresenca(id)}>
                  {presente ? 'Presente' : 'Confirmar'}
                </button>
                <button className="remove-button" onClick={() => removerJogador(id)}>
                  ❌
                </button>
              <button className="copy-link-button" onClick={() => copiarLink(listaId, id)}> 🔑 </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="section-title">Confirmados</h2>
      <ul className="players-list confirmed-list">
        {jogadores.filter(j => j.presente).map(jogador => (
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
  );
}
