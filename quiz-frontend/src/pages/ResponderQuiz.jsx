import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ResponderQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [perguntaIndex, setPerguntaIndex] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [quizFinalizado, setQuizFinalizado] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await axios.get(`http://localhost:3000/quizzes/${quizId}`);
        setQuiz(res.data);
        setTempoRestante(res.data.perguntas[0]?.tempo || 30);
      } catch (error) {
        alert("Erro ao carregar quiz: " + error.message);
        navigate("/quizzes");
      }
    }
    fetchQuiz();
  }, [quizId, navigate]);

  useEffect(() => {
    if (tempoRestante <= 0 && quiz && !quizFinalizado) {
      handleProximaPergunta(null); // nenhuma resposta escolhida no tempo
    }

    const timer = setInterval(() => {
      setTempoRestante((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [tempoRestante, quiz, quizFinalizado]);

  function handleResposta(indiceAlternativa) {
    if (quizFinalizado) return;

    // registra resposta escolhida
    const respostaAtual = {
      perguntaIndex,
      respostaEscolhida: indiceAlternativa,
    };

    setRespostas((prev) => [...prev.filter(r => r.perguntaIndex !== perguntaIndex), respostaAtual]);

    handleProximaPergunta(indiceAlternativa);
  }

  function handleProximaPergunta(respostaEscolhida) {
    // checa se acertou e atualiza pontuação
    if (quiz) {
      const correta = quiz.perguntas[perguntaIndex].respostaCorreta;
      if (respostaEscolhida === correta) {
        setPontuacao((p) => p + 1);
      }

      if (perguntaIndex + 1 < quiz.perguntas.length) {
        setPerguntaIndex(perguntaIndex + 1);
        setTempoRestante(quiz.perguntas[perguntaIndex + 1].tempo || 30);
      } else {
        // quiz finalizado
        setQuizFinalizado(true);
      }
    }
  }

  if (!quiz) return <p>Carregando quiz...</p>;

  if (quizFinalizado) {
    return (
      <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
        <h2>Quiz Finalizado!</h2>
        <p>
          Você acertou <strong>{pontuacao}</strong> de {quiz.perguntas.length} perguntas.
        </p>
        <button onClick={() => navigate("/quizzes")}>Voltar para lista</button>
      </div>
    );
  }

  const perguntaAtual = quiz.perguntas[perguntaIndex];

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
      <h2>{quiz.titulo}</h2>
      <h3>
        Pergunta {perguntaIndex + 1} de {quiz.perguntas.length}
      </h3>
      <p><strong>Tempo restante:</strong> {tempoRestante}s</p>
      <p>{perguntaAtual.texto}</p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {perguntaAtual.alternativas.map((alt, i) => (
          <li key={i} style={{ marginBottom: "0.5rem" }}>
            <button
              style={{ width: "100%", padding: "0.5rem" }}
              onClick={() => handleResposta(i)}
            >
              {alt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
