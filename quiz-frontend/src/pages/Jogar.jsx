import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import styles from './Jogar.module.css';

export default function Jogar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [pontos, setPontos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(null);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [respostaCorreta, setRespostaCorreta] = useState(null);
  const [travado, setTravado] = useState(false);
  const [mensagemAviso, setMensagemAviso] = useState("");
  const [mostrarModalTempoEsgotado, setMostrarModalTempoEsgotado] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [estatisticas, setEstatisticas] = useState([]);

  const somAcerto = useRef(null);
  const somErro = useRef(null);

  useEffect(() => {
    somAcerto.current = new Audio("/sounds/acertou.mp3");
    somErro.current = new Audio("/sounds/errou.mp3");
  }, []);

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    if (tipo !== "jogador") {
      navigate("/");
    } else {
      carregarQuiz();
    }
  }, [navigate]);

  async function carregarQuiz() {
    try {
      const res = await axios.get(`http://localhost:3000/api/quizzes/${id}`);
      setQuiz(res.data);
    } catch (err) {
      console.error("Erro ao carregar quiz:", err);
    }
  }

  useEffect(() => {
    if (quiz && quiz.perguntas[perguntaAtual]) {
      const tempo = quiz.perguntas[perguntaAtual].tempo_limite_segundos || 30;
      setTempoRestante(tempo);
      setRespostaSelecionada(null);
      setRespostaCorreta(null);
      setTravado(false);
      setMensagemAviso("");

      let contador = tempo;

      const intervalo = setInterval(() => {
        contador -= 1;
        setTempoRestante(contador);

        if (contador <= 0) {
          clearInterval(intervalo);
          responder(null, true);
        }
      }, 1000);

      return () => clearInterval(intervalo);
    }
  }, [perguntaAtual, quiz]);

  useEffect(() => {
    if (finalizado && quiz) {
      const usuarioId = parseInt(localStorage.getItem("usuarioId"));
      if (usuarioId && quiz.id) {
        axios.post("http://localhost:3000/api/pontuacoes", {
          usuario_id: usuarioId,
          quiz_id: parseInt(quiz.id),
          pontuacao: pontos,
        })
        .then(() => {
          axios.get(`http://localhost:3000/api/leaderboard/${quiz.id}`)
            .then(res => setLeaderboard(res.data))
            .catch(err => console.error("Erro ao buscar leaderboard:", err));

          axios.get(`http://localhost:3000/api/estatisticas/usuario/${usuarioId}`)
            .then(res => setEstatisticas(res.data))
            .catch(err => console.error("Erro ao buscar estatísticas:", err));
        })
        .catch(err => {
          console.error("Erro ao salvar pontuação:", err);
        });
      }
    }
  }, [finalizado, pontos, quiz]);

  function responder(alternativaSelecionada, tempoEsgotado = false) {
    if (travado) return;

    const pergunta = quiz.perguntas[perguntaAtual];
    const correta = pergunta.resposta_correta;

    setRespostaSelecionada(alternativaSelecionada);
    setRespostaCorreta(correta);
    setTravado(true);

    if (somAcerto.current) somAcerto.current.pause();
    if (somErro.current) somErro.current.pause();
    if (somAcerto.current) somAcerto.current.currentTime = 0;
    if (somErro.current) somErro.current.currentTime = 0;

    if (tempoEsgotado) {
      setMensagemAviso("⏳ Tempo esgotado! A resposta correta foi destacada.");
      setMostrarModalTempoEsgotado(true);
      somErro.current.play();
      return;
    }

    if (alternativaSelecionada === correta) {
      setPontos(p => p + 1);
      setMensagemAviso("🎉 Parabéns! Você acertou.");
      somAcerto.current.play();
    } else {
      setMensagemAviso("❌ Que pena! Você errou.");
      somErro.current.play();
    }

    setTimeout(() => {
      const proxima = perguntaAtual + 1;
      if (proxima < quiz.perguntas.length) {
        setPerguntaAtual(proxima);
        setMensagemAviso("");
      } else {
        setFinalizado(true);
      }
    }, 2000);
  }

  function proximaPergunta() {
    setMostrarModalTempoEsgotado(false);
    setMensagemAviso("");
    setPerguntaAtual(p => p + 1);
  }

  async function compartilharResultado() {
    const texto = `🎮 Resultado do quiz "${quiz.titulo}": Acertei ${pontos} de ${quiz.perguntas.length} perguntas! 💯`;
    try {
      await navigator.clipboard.writeText(texto);
      alert("Resultado copiado para área de transferência! Compartilhe onde quiser.");
    } catch {
      alert("Erro ao copiar resultado.");
    }
  }

  if (!quiz) return <p>Carregando quiz...</p>;

  if (finalizado) {
    return (
      <div className={styles.container}>
        <h2 className={styles.finalizadoTitulo}>Quiz Finalizado!</h2>
        <p className={styles.resultado}>Você acertou {pontos} de {quiz.perguntas.length} perguntas.</p>

        <div className={styles.leaderboard}>
          <h3>🏆 Ranking - Top 10</h3>
          {leaderboard.length === 0 ? (
            <p>Nenhuma pontuação ainda.</p>
          ) : (
            <ol>
              {leaderboard.map((item, i) => (
                <li key={i}>{item.nome} - {item.pontuacao} pts</li>
              ))}
            </ol>
          )}
        </div>

        <div className={styles.estatisticas}>
          <h3>📈 Suas Estatísticas</h3>
          {estatisticas.length === 0 ? (
            <p>Você ainda não respondeu outros quizzes.</p>
          ) : (
            <ul>
              {estatisticas.map((stat, i) => (
                <li key={i}>{stat.titulo}: {stat.pontuacao} / {stat.total_perguntas} pontos</li>
              ))}
            </ul>
          )}
        </div>

      


        <button
          onClick={() => navigate("/dashboard/jogador")}
          className={styles.botaoVoltar}
        >
          Voltar ao painel
        </button>
      </div>
    );
  }

  const pergunta = quiz.perguntas[perguntaAtual];

  return (
    <div className={styles.container}>
      <div className={styles.headerQuiz}>
        <p className={styles.tempo}>⏱️ {tempoRestante}s</p>
      </div>

      {mensagemAviso && <div className={styles.mensagemAviso}>{mensagemAviso}</div>}

      <p className={styles.progress}>Pergunta {perguntaAtual + 1} de {quiz.perguntas.length}</p>

      <h3 className={styles.pergunta}>{pergunta.enunciado}</h3>
      <div className={styles.alternativas}>
        {pergunta.alternativas.map((alt, i) => {
          let classe = styles.botaoAlternativa;
          if (respostaSelecionada) {
            if (alt === respostaCorreta) classe = styles.correta;
            else if (alt === respostaSelecionada) classe = styles.errada;
          }

          return (
            <button
              key={i}
              onClick={() => responder(alt)}
              className={classe}
              disabled={travado}
            >
              {alt}
            </button>
          );
        })}
      </div>

      {mostrarModalTempoEsgotado && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>⏳ Tempo Esgotado!</h2>
            <p>A resposta correta foi destacada.</p>
            <button onClick={proximaPergunta} className={styles.botaoProximo}>
              Próxima pergunta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
