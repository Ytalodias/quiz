import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const res = await axios.post('http://localhost:3000/auth/login', { email, senha });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('tipo_usuario', res.data.tipo_usuario);
      navigate('/dashboard');
    } catch (err) {
      setErro('Email ou senha inválidos.');
    }
  };

  return (
    <div style={estilo.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={estilo.form}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        <button type="submit">Entrar</button>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
      </form>
      <p>Não tem conta? <Link to="/register">Cadastre-se</Link></p>
    </div>
  );
}

const estilo = {
  container: { maxWidth: '400px', margin: 'auto', padding: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' }
};
