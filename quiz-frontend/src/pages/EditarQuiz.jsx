import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarQuiz() {
  const { id } = useParams(); // pega o id do quiz na URL
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [perguntas, setPerguntas] = useState([]);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    // Carregar os dados do quiz para edição
    async function carregarQuiz() {
      try {
        const res = await axios.get(`http://localhost:3000/api/quizzes/${id}`);
        const quiz = res.data;
        setTitulo(quiz.titulo);
        setDescricao(quiz.descricao);
        setCategoria(quiz.categoria);
        setPerguntas(quiz.perguntas || []);
      } catch (error) {
        setMensagem('Erro ao carregar quiz.');
      }
    }
    carregarQuiz();
  }, [id]);

  async function handleSalvar(e) {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/quizzes/${id}`, {
        titulo,
        descricao,
        categoria,
        perguntas,
      });
      setMensagem('Quiz atualizado com sucesso!');
      // Pode redirecionar para o dashboard do criador, por exemplo:
      navigate('/dashboard/criador');
    } catch (error) {
      setMensagem('Erro ao atualizar quiz.');
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <h1>Editar Quiz</h1>

      {mensagem && <p>{mensagem}</p>}

      <form onSubmit={handleSalvar}>
        <div>
          <label>Título:</label><br />
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginBottom: 12 }}
          />
        </div>

        <div>
          <label>Descrição:</label><br />
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: 8, marginBottom: 12 }}
          />
        </div>

        <div>
          <label>Categoria:</label><br />
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginBottom: 12 }}
          />
        </div>

        {/* Você pode implementar aqui a edição das perguntas do quiz */}

        <button type="submit" style={{ padding: '10px 20px' }}>
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
