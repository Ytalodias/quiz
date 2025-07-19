import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import styles from "./Ranking.module.css"; // opcional

export default function RankingQuiz() {
  const { id } = useParams(); // id do quiz
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/resultados/ranking/${id}`)
      .then(res => setRanking(res.data))
      .catch(err => console.error("Erro ao buscar ranking:", err));
  }, [id]);

  return (
    <div className={styles.rankingContainer}>
      <h1>🏆 Ranking do Quiz</h1>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>#</th>
            <th>Jogador</th>
            <th>Pontuação</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((r, index) => (
            <tr key={index}>
              <td>{index + 1}º</td>
              <td>{r.jogador_nome}</td>
              <td>{r.pontuacao} / {r.total_perguntas}</td>
              <td>{new Date(r.data_hora).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/" className={styles.botaoVoltar}>Voltar</Link>
    </div>
  );
}
