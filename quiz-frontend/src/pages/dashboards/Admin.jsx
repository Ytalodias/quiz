import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function DashboardAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('usuarioLogado');
    const tipo = localStorage.getItem('tipoUsuario');
    if (!user || tipo !== 'admin') {
      navigate('/');
    }
  }, []);

  function handleLogout() {
    localStorage.clear();
    navigate('/');
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Área do Administrador</h1>
      <p>Logado como: <strong>{localStorage.getItem('usuarioLogado')}</strong></p>

      <div style={{ marginTop: '2rem' }}>
        <button style={botao} onClick={() => alert('Funcionalidade futura')}>
          Gerenciar Usuários
        </button>
        <button style={botao} onClick={() => alert('Funcionalidade futura')}>
          Ver Estatísticas
        </button>
        <button style={{ ...botao, backgroundColor: '#e74c3c' }} onClick={handleLogout}>
          Sair
        </button>
      </div>
    </div>
  );
}

const botao = {
  padding: '12px 24px',
  fontSize: '16px',
  margin: '10px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#5563DE',
  color: 'white',
  cursor: 'pointer',
};
