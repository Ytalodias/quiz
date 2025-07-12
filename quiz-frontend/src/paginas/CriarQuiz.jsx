import { useState } from "react";
import axios from "axios";

export default function CriarQuiz() {
  // Estados para guardar os dados do quiz
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [perguntas, setPerguntas] = useState([]);

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h2>Criar Quiz</h2>

      {/* Aqui vai o formulário para criar quiz */}

    </div>
  );
}
