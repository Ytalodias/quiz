import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const tipo = localStorage.getItem('tipo_usuario');

  const sair = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Bem-vindo(a) ao Painel!</h2>
      <p>Tipo de usuário: <strong>{tipo}</strong></p>
      <button onClick={sair}>Sair</button>
    </div>
  );
}
