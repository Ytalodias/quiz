import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from './CriarQuiz.module.css';

export default function CriarQuiz() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [perguntas, setPerguntas] = useState([
    { texto: "", respostas: [{ texto: "", correta: false }] },
  ]);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  const navigate = useNavigate();
  const criador = localStorage.getItem("usuarioLogado");

  const categoriasFixas = [
    "Tecnologia", "História", "Esportes", "Cinema",
    "Matemática", "Ciência", "Geografia", "Arte"
  ];

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    if (!criador || tipo !== "criador") {
      navigate("/");
    }
  }, [criador, navigate]);

  function handleTextoPergunta(index, valor) {
    const novas = [...perguntas];
    novas[index].texto = valor;
    setPerguntas(novas);
  }

  function handleTextoResposta(pIndex, rIndex, valor) {
    const novas = [...perguntas];
    novas[pIndex].respostas[rIndex].texto = valor;
    setPerguntas(novas);
  }

  function handleRespostaCorreta(pIndex, rIndex) {
    const novas = perguntas.map((p, pi) => ({
      ...p,
      respostas: pi === pIndex
        ? p.respostas.map((r, ri) => ({ ...r, correta: ri === rIndex }))
        : p.respostas
    }));
    setPerguntas(novas);
  }

  function adicionarPergunta() {
    setPerguntas([...perguntas, { texto: "", respostas: [{ texto: "", correta: false }] }]);
  }

  function removerPergunta(index) {
    setPerguntas(perguntas.filter((_, i) => i !== index));
  }

  function adicionarResposta(pIndex) {
    const novas = [...perguntas];
    novas[pIndex].respostas.push({ texto: "", correta: false });
    setPerguntas(novas);
  }

  function removerResposta(pIndex, rIndex) {
    const novas = [...perguntas];
    if (novas[pIndex].respostas.length === 1) return;
    novas[pIndex].respostas.splice(rIndex, 1);
    setPerguntas(novas);
  }

  async function handleCriarQuiz(e) {
    e.preventDefault();
    setMensagem("");

    if (!titulo.trim()) return setMensagem("O título é obrigatório.");
    if (!categoria) return setMensagem("Selecione uma categoria.");

    for (let i = 0; i < perguntas.length; i++) {
      const p = perguntas[i];
      if (!p.texto.trim()) return setMensagem(`Digite o texto da pergunta ${i + 1}`);
      if (p.respostas.length < 1) return setMensagem(`A pergunta ${i + 1} deve ter pelo menos uma resposta.`);
      if (!p.respostas.some(r => r.correta)) return setMensagem(`Marque a resposta correta da pergunta ${i + 1}`);
      for (let j = 0; j < p.respostas.length; j++) {
        if (!p.respostas[j].texto.trim()) return setMensagem(`Digite o texto da resposta ${j + 1} da pergunta ${i + 1}`);
      }
    }

    try {
      setEnviando(true);
      await axios.post("http://localhost:3000/api/quizzes", {
        titulo, descricao, categoria, criador, perguntas
      });
      alert("Quiz criado com sucesso!");
      window.location.href = "http://localhost:5173/dashboard/criador";
    } catch (err) {
      setMensagem(err.response?.data?.mensagem || "Erro ao criar quiz.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Criar Novo Quiz</h1>
      <form onSubmit={handleCriarQuiz} className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Título do quiz"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <textarea
          className={styles.textarea}
          placeholder="Descrição (opcional)"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
        />
        <label className={styles.label} htmlFor="categoria">Categoria:</label>
        <select
          id="categoria"
          className={styles.select}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        >
          <option value="">-- Selecione uma categoria --</option>
          {categoriasFixas.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <h2 className={styles.sectionTitle}>Perguntas</h2>
        {perguntas.map((p, pIndex) => (
          <div key={pIndex} className={styles.perguntaContainer}>
            <input
              className={styles.input}
              type="text"
              placeholder={`Pergunta ${pIndex + 1}`}
              value={p.texto}
              onChange={(e) => handleTextoPergunta(pIndex, e.target.value)}
            />
            <button type="button" onClick={() => removerPergunta(pIndex)} className={styles.removerPergunta}>Remover Pergunta</button>

            <div>
              <h3 className={styles.subTitle}>Respostas</h3>
              {p.respostas.map((r, rIndex) => (
                <div key={rIndex} className={styles.respostaContainer}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder={`Resposta ${rIndex + 1}`}
                    value={r.texto}
                    onChange={(e) => handleTextoResposta(pIndex, rIndex, e.target.value)}
                  />
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name={`resposta-correta-${pIndex}`}
                      checked={r.correta}
                      onChange={() => handleRespostaCorreta(pIndex, rIndex)}
                    />
                    Correta
                  </label>
                  <button
                    type="button"
                    onClick={() => removerResposta(pIndex, rIndex)}
                    disabled={p.respostas.length === 1}
                    className={styles.removerResposta}
                  >
                    X
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => adicionarResposta(pIndex)} className={styles.adicionarBtn}>
                + Adicionar Resposta
              </button>
            </div>
          </div>
        ))}

        <button type="button" onClick={adicionarPergunta} className={styles.adicionarBtn}>
          + Adicionar Pergunta
        </button>

        <button type="submit" className={styles.submitBtn} disabled={enviando}>
          {enviando ? "Criando..." : "Criar Quiz"}
        </button>

        {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
      </form>
    </div>
  );
}
