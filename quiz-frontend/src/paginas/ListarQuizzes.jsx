import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ListarQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/quizzes");
        setQuizzes(res.data);
      } catch (err) {
        setErro("Erro ao carregar quizzes.");
      } finally {
        setLoading(false);
      }
    }

    fetchQuizzes();
  }, []);

  if (loading) return <p>Carregando quizzes...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "1rem" }}>
      <h2>Quizzes Disponíveis</h2>
      {quizzes.length === 0 && <p>Nenhum quiz disponível.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {quizzes.map((quiz) => (
          <li
            key={quiz.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "4px",
            }}
          >
            <h3>{quiz.titulo}</h3>
            <p><strong>Categoria:</strong> {quiz.categoria}</p>
            <button onClick={() => navigate(`/responder/${quiz.id}`)}>
              Jogar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
