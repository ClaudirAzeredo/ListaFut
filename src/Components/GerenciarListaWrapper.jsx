// src/GerenciarListaWrapper.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import GerenciarLista from './GerenciarLista';

export default function GerenciarListaWrapper () {


  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  const [verificandoAuth, setVerificandoAuth] = useState(true);
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

  if (verificandoAuth) {
    return <p>Verificando autenticação...</p>;
  }

  return <GerenciarLista listaId={listaId} />;
}
