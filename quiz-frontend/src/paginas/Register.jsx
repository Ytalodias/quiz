import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('jogador');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    try {
      await axios.post('http://localhost:3000/auth/register', {
        nome,
        email,
        senha,
        tipo_usuario: tipoUsuario
      });
      setSucesso('Cadastro realizado! Você será redirecionado.');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setErro('Erro no cadastro. Verifique os dados.');
    }
  };

  return (
    <div style={estilo.container}>
      <h2>Cadastro</h2>
      <form onSubmit={handleRegister} style={estilo.form}>
        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        <select value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
          <option value="jogador">Jogador</option>
          <option value="criador">Criador</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Cadastrar</button>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
      </form>
      <p>Já tem conta? <Link to="/">Faça login</Link></p>
    </div>
  );
}

const estilo = {
  container: { maxWidth: '400px', margin: 'auto', padding: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' }
};
