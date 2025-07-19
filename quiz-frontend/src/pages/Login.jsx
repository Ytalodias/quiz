import { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css'; // Importa CSS Module
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('jogador');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/api/login', {
        email,
        senha,
        tipo,
      });

      setMsg(res.data.mensagem || 'Login feito com sucesso!');
      localStorage.setItem('usuarioLogado', email);
      localStorage.setItem('tipoUsuario', tipo);

      if (tipo === 'admin') {
        navigate('/dashboard/admin');
      } else if (tipo === 'criador') {
        navigate('/dashboard/criador');
      } else {
        navigate('/dashboard/jogador');
      }
    } catch (err) {
      setMsg(err.response?.data?.erro || 'Erro no login');
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="Logo" />
      </div>
      <h1 className={styles.title}>Entrar</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className={styles.input}
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className={styles.select}
        >
          <option value="admin">Administrador</option>
          <option value="criador">Criador</option>
          <option value="jogador">Jogador</option>
        </select>

        <button type="submit" className={styles.button}>
          Entrar
        </button>
      </form>
      {msg && <p className={styles.message}>{msg}</p>}
    </div>
  );
}
