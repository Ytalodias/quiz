import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./paginas/Login";
import Register from "./paginas/Register";
import Dashboard from "./paginas/Dashboard";
import CriarQuiz from './paginas/CriarQuiz';
import ListarQuizzes from './paginas/ListarQuizzes';
import ResponderQuiz from './paginas/ResponderQuiz';
import Ranking from './paginas/Ranking';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
<Route path="/criarQuiz" element={<CriarQuiz />} />
<Route path="/quizzes" element={<ListarQuizzes />} />
<Route path="/responder/:quizId" element={<ResponderQuiz />} />
<Route path="/ranking" element={<Ranking />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
