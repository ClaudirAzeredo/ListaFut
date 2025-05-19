import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set, push } from "firebase/database";
import { database } from '../firebase';
import './Style/CadastroOrganizador.css';

function CadastroOrganizador() {
  const navigate = useNavigate();

  const [listName, setListName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!listName.trim()) {
      alert('Por favor, digite o nome da lista.');
      return;
    }
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Gerar um novo ID para a lista
      const novaListaRef = push(ref(database, 'listas'));
      const listaId = novaListaRef.key;

      // Salvar a lista no Realtime Database
      await set(novaListaRef, {
        nome: listName.trim(),
        organizadorId: user.uid,
        dataCriacao: new Date().toISOString(),
        jogadores: {}
      });

      alert('Cadastro realizado com sucesso! Agora faça login.');
      navigate('/');
    } catch (error) {
      alert('Erro no cadastro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-organizador-container">
      <h2>Cadastro de Organizador</h2>

      <label>Nome da Lista:</label>
      <input
        type="text"
        placeholder="Digite o nome da lista"
        value={listName}
        onChange={e => setListName(e.target.value)}
        disabled={loading}
      />

      <label>Email:</label>
      <input
        type="email"
        placeholder="Digite seu email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={loading}
      />

      <label>Senha:</label>
      <input
        type="password"
        placeholder="Digite sua senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={loading}
      />

      <label>Confirmar senha:</label>
      <input
        type="password"
        placeholder="Confirme sua senha"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        disabled={loading}
      />

      <button onClick={handleRegister} disabled={loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </div>
  );
}

export default CadastroOrganizador;
