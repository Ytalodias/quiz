import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardCriador from './pages/dashboards/Criador';
import DashboardJogador from './pages/dashboards/Jogador';
import DashboardAdmin from './pages/dashboards/Admin';
import CriarQuiz from './pages/CriarQuiz';
import EditarQuiz from './pages/EditarQuiz';
import Jogar from './pages/Jogar';
import RankingQuiz from './pages/RankingQuiz';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota raiz redireciona para login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rotas principais */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Dashboards */}
        <Route path="/dashboard/criador" element={<DashboardCriador />} />
        <Route path="/dashboard/jogador" element={<DashboardJogador />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />

        {/* Quizzes */}
      <Route path="/criar-quiz" element={<CriarQuiz />} />
<Route path="/editar-quiz/:id" element={<EditarQuiz />} />
        <Route path="/jogar/:id" element={<Jogar />} />
<Route path="/ranking/:id" element={<RankingQuiz />} />
        {/* Rota de fallback para páginas não encontradas */}
        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
