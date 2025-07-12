import { useEffect, useState } from "react";
import axios from "axios";

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function fetchRanking() {
      try {
        // Ajuste a URL para seu backend
        const res = await axios.get("http://localhost:3000/ranking");
        setRanking(res.data); // supondo que retorne array [{nome, pontos}]
      } catch (e) {
        setErro("Erro ao buscar ranking.");
      } finally {
        setLoading(false);
      }
    }

    fetchRanking();
  }, []);

  if (loading) return <p>Carregando ranking...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "1rem" }}>
      <h2>Ranking dos Jogadores</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #333" }}>
            <th style={{ textAlign: "left", padding: "8px" }}>Posição</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Nome</th>
            <th style={{ textAlign: "right", padding: "8px" }}>Pontos</th>
          </tr>
        </thead>
        <tbody>
          {ranking.length === 0 && (
            <tr>
              <td colSpan="3" style={{ padding: "8px" }}>
                Nenhum dado no ranking.
              </td>
            </tr>
          )}

          {ranking.map((item, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: index % 2 === 0 ? "#f0f0f0" : "white",
                borderBottom: "1px solid #ccc",
              }}
            >
              <td style={{ padding: "8px" }}>{index + 1}</td>
              <td style={{ padding: "8px" }}>{item.nome}</td>
              <td style={{ padding: "8px", textAlign: "right" }}>{item.pontos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
