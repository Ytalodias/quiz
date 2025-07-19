import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from './Jogador.module.css';

export default function DashboardJogador() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todas");

  const email = localStorage.getItem("usuarioLogado");

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    if (!email || tipo !== "jogador") {
      navigate("/");
    } else {
      carregarQuizzes();
      buscarNomeJogador();
    }
  }, [email, navigate]);

  async function carregarQuizzes() {
    try {
      const res = await axios.get("http://localhost:3000/api/quizzes");
      setQuizzes(res.data);
    } catch (err) {
      setMensagem("Erro ao carregar quizzes.");
    }
  }

  async function buscarNomeJogador() {
    try {
      const res = await axios.get(`http://localhost:3000/api/quizzes/jogadores/email/${email}`);
      setNomeUsuario(res.data.nome);
    } catch (err) {
      console.error("Erro ao buscar nome do jogador:", err);
      setNomeUsuario("Jogador");
    }
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  function jogarQuiz(id) {
    navigate(`/jogar/${id}`);
  }

  // === Obter categorias únicas ===
  const categorias = ["todas", ...new Set(quizzes.map(q => q.categoria).filter(Boolean))];

  // === Aplicar filtro ===
  const quizzesFiltrados = categoriaSelecionada === "todas"
    ? quizzes
    : quizzes.filter(q => q.categoria === categoriaSelecionada);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Bem-vindo, {nomeUsuario || "Jogador"}</h1>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Sair
        </button>
      </header>

      <main>
        <h2>Quizzes Disponíveis</h2>

        {/* Filtro por categoria */}
        <div className={styles.filtro}>
          <label htmlFor="categoria">Filtrar por categoria: </label>
          <select
            id="categoria"
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
          >
            {categorias.map((cat, i) => (
              <option key={i} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {quizzesFiltrados.length === 0 ? (
          <p className={styles.noQuizzes}>Nenhum quiz disponível nesta categoria.</p>
        ) : (
          <ul className={styles.quizList}>
            {quizzesFiltrados.map((quiz) => (
              <li key={quiz.id} className={styles.quizItem}>
                <div className={styles.quizInfo}>
                  <strong className={styles.quizTitle}>{quiz.titulo}</strong>
                  <p className={styles.quizDescription}>{quiz.descricao}</p>
                </div>
                <button
                  className={styles.playBtn}
                  onClick={() => jogarQuiz(quiz.id)}
                >
                  Jogar
                </button>
              </li>
            ))}
          </ul>
        )}

        {mensagem && <p className={styles.errorMsg}>{mensagem}</p>}
      </main>
    </div>
  );
}
