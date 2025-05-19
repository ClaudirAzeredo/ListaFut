import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from '../../firebase';
import GerenciarLista from './GerenciarLista';
import { ref, set } from 'firebase/database';

export default function GerenciarListaWrapper() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  const [verificandoAuth, setVerificandoAuth] = useState(true);
  const [jogadoresPrivados, setJogadoresPrivados] = useState([]);
  const navigate = useNavigate();
  const { listaId } = useParams();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      if (usuario) {
        setUsuarioAutenticado(usuario);
      } else {
        navigate('/');
      }
      setVerificandoAuth(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Função para salvar a lista privada e atualizar a pública no Firebase
  const salvarLista = async (novaListaPrivada) => {
    try {
      // Atualiza estado local
      setJogadoresPrivados(novaListaPrivada);

      // Monta dados públicos simplificados para jogadores
      const jogadoresPublicos = {};
      novaListaPrivada.forEach((jogador) => {
        jogadoresPublicos[jogador.id] = {
          nome: jogador.nome,
          presente: jogador.presente,
          posicao: jogador.posicao || '',
        };
      });

      // Referências Firebase
      const refPrivados = ref(database, `listas/${listaId}/jogadoresPrivados`);
      const refPublicos = ref(database, `listas/${listaId}/jogadoresPublicos`);

      // Salva os dados privados e públicos
      await Promise.all([set(refPrivados, novaListaPrivada), set(refPublicos, jogadoresPublicos)]);
    } catch (error) {
      console.error('Erro ao salvar listas:', error);
      throw error; // para o componente filho lidar, se quiser
    }
  };

  if (verificandoAuth) {
    return <p>Verificando autenticação...</p>;
  }

  return (
    <GerenciarLista
      listaId={listaId}
      jogadoresPrivados={jogadoresPrivados}
      setJogadoresPrivados={setJogadoresPrivados}
      salvarLista={salvarLista}
      usuario={usuarioAutenticado}
    />
  );
}
