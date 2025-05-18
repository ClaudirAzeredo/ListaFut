import { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { database } from '../firebase';
import './GerenciarLista.css';

export default function GerenciarLista({ listaId }) {
  
  console.log('listaId:', listaId);

  const [jogadores, setJogadores] = useState([]);
  const [nome, setNome] = useState('');
  const [user, setUser] = useState(null);
  const [listas, setListas] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Carrega as listas do organizador logado
  useEffect(() => {
    if (!user) return;

    const listasRef = ref(database, 'listas');
    const unsubscribe = onValue(listasRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setListas([]);
        return;
      }

      const minhasListas = Object.entries(data)
        .filter(([id, lista]) => lista.organizadorId === user.uid)
        .map(([id, lista]) => ({ id, ...lista }));

      setListas(minhasListas);
    });

    return () => unsubscribe();
  }, [user]);

  // Carrega jogadores da lista selecionada
  useEffect(() => {
    if (!listaId || !user) return;

    setCarregandoJogadores(true);

    const listaRef = ref(database, `listas/${listaId}/jogadores`);
    const unsubscribe = onValue(listaRef, (snapshot) => {
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

  // Salva a lista de jogadores no Firebase
  const salvarJogadores = (lista) => {
    if (!listaId) return;
    const listaRef = ref(database, `listas/${listaId}/jogadores`);
    set(
      listaRef,
      lista.reduce((acc, jogador) => {
        acc[jogador.id || gerarId()] = jogador;
        return acc;
      }, {})
    );
  };

  // Gera ID simples para jogador
  const gerarId = () => Math.random().toString(36).substring(2, 9);

  // Adiciona novo jogador
  const adicionarJogador = () => {
    const nomeLimpo = nome.trim();
    if (nomeLimpo === '') return alert('Informe o nome do jogador');

    const nomeExiste = jogadores.some((j) => j.nome.toLowerCase() === nomeLimpo.toLowerCase());
    if (nomeExiste) return alert('Jogador já está na lista');

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

  // Remove jogador por id
  const removerJogador = (id) => {
    const novaLista = jogadores.filter((j) => j.id !== id);
    salvarJogadores(novaLista);
  };

  // Alterna presença do jogador
  const alternarPresenca = (id) => {
    const novaLista = jogadores.map((j) => {
      if (j.id === id) return { ...j, presente: !j.presente };
      return j;
    });
    salvarJogadores(novaLista);
  };

  if (loading) return <p>Carregando...</p>;
  if (!user) return <p>Você precisa estar logado para acessar suas listas.</p>;

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
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2>Minhas Listas</h2>
      <ul>
          {listas.map((lista) => (
        <li key={lista.id}>
          <a href={`/gerenciar/${lista.id}`}>{lista.nome} - {lista.data}</a>
       </li>
      ))}
    </ul>
    </div>
  );
}
