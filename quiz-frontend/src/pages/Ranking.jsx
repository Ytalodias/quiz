import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import styles from './Ranking.module.css'; // crie um CSS legal

export default function RankingQuiz() {
  const { id } = useParams();
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/leaderboard/${id}`)
      .then(res => setRanking(res.data))
      .catch(err => console.error("Erro ao carregar ranking:", err));
  }, [id]);

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>🏆 Ranking do Quiz</h2>
      {ranking.length === 0 ? (
        <p>Nenhum jogador ainda respondeu este quiz.</p>
      ) : (
        <ol className={styles.lista}>
          {ranking.map((item, i) => (
            <li key={i}>
              <span className={styles.nome}>{item.nome}</span> - <span className={styles.pontos}>{item.pontuacao} pts</span>
            </li>
          ))}
        </ol>
      )}
      <Link to="/dashboard/jogador" className={styles.botao}>Voltar</Link>
    </div>
  );
}
