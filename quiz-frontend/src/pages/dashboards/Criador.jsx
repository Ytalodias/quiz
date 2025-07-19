import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from './Criador.module.css';

export default function DashboardCriador() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const email = localStorage.getItem("usuarioLogado");

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    if (tipo !== "criador") {
      navigate("/");
    } else {
      carregarQuizzes();
    }
  }, [navigate]);

  async function carregarQuizzes() {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/quizzes?criador=" + encodeURIComponent(email)
      );
      setQuizzes(res.data);
    } catch {
      setMensagem("Erro ao carregar quizzes");
    }
  }

  function handleLogout() {
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("tipoUsuario");
    navigate("/");
  }

  function editarQuiz(id) {
    navigate(`/editar-quiz/${id}`);
  }

  async function excluirQuiz(id) {
    try {
      await axios.delete(`http://localhost:3000/api/quizzes/${id}`);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
      setMensagem("Quiz excluído com sucesso!");
    } catch {
      setMensagem("Erro ao excluir quiz");
    }
  }

  function irParaCriarQuiz() {
    navigate("/criar-quiz");
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Painel do Criador</h1>
        <p>
          Logado como: <b>{email}</b>
        </p>
        <button onClick={handleLogout} className={styles.btnLogout}>Sair</button>
        <button onClick={irParaCriarQuiz} className={styles.btnCriar}>Criar Novo Quiz</button>
      </header>

      <section>
        <h2 className={styles.title}>Quizzes Criados</h2>
        {quizzes.length === 0 ? (
          <p className={styles.semQuiz}>Nenhum quiz criado ainda.</p>
        ) : (
          <ul className={styles.lista}>
            {quizzes.map((quiz) => (
              <li key={quiz.id} className={styles.itemQuiz}>
                <strong>{quiz.titulo}</strong>
                <p>{quiz.descricao}</p>
                <button onClick={() => editarQuiz(quiz.id)} className={styles.btnEditar}>Editar</button>
                <button onClick={() => excluirQuiz(quiz.id)} className={styles.btnExcluir}>Excluir</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
    </div>
  );
}
