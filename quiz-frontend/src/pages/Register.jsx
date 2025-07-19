import { useState } from 'react';
import api from '../services/api';
import styles from './register.module.css'; // CSS Module certo

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('jogador');
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(`/${tipo}/registro`, { nome, email, senha });
      setMsg(res.data.mensagem || 'Cadastro feito com sucesso!');
      setStatus('sucesso');
      setNome('');
      setEmail('');
      setSenha('');
    } catch (err) {
      if (err.response?.data?.erro) {
        setMsg(err.response.data.erro);
      } else {
        setMsg('Erro ao cadastrar');
      }
      setStatus('erro');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="Logo" />
      </div>

      <h1>Cadastro</h1>

      <form onSubmit={handleSubmit} className={styles.formRegister}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="jogador">Jogador</option>
          <option value="criador">Criador</option>
          <option value="admin">Administrador</option>
        </select>

        <button type="submit">Cadastrar</button>
      </form>

      {msg && (
        <p className={`${styles.statusMsg} ${status === 'sucesso' ? styles.success : styles.error}`}>
          {msg}
        </p>
      )}
    </div>
  );
}
