import express from 'express';

export default function resultadosRoutes(db) {
  const router = express.Router();

  // Salvar resultado
  router.post('/salvar', async (req, res) => {
    const { usuario_id, quiz_id, pontuacao, total_perguntas } = req.body;

    try {
      await db.query(
        'INSERT INTO resultados_quiz (usuario_id, quiz_id, pontuacao, total_perguntas) VALUES (?, ?, ?, ?)',
        [usuario_id, quiz_id, pontuacao, total_perguntas]
      );
      res.status(200).json({ sucesso: true });
    } catch (err) {
      console.error('Erro ao salvar resultado:', err);
      res.status(500).json({ erro: 'Erro ao salvar resultado' });
    }
  });

  // Ranking por quiz (Top 10)
  router.get('/ranking/:quiz_id', async (req, res) => {
    const { quiz_id } = req.params;

    try {
      const [result] = await db.query(
        `SELECT jogadores.nome, MAX(r.pontuacao) AS pontuacao
         FROM resultados_quiz r
         JOIN jogadores ON r.usuario_id = jogadores.id
         WHERE r.quiz_id = ?
         GROUP BY r.usuario_id
         ORDER BY pontuacao DESC
         LIMIT 10`,
        [quiz_id]
      );
      res.json(result);
    } catch (err) {
      console.error('Erro ao buscar ranking:', err);
      res.status(500).json({ erro: 'Erro ao buscar ranking' });
    }
  });

  // Estatísticas por usuário
  router.get('/estatisticas/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;

    try {
      const [result] = await db.query(
        `SELECT q.titulo, r.pontuacao, r.total_perguntas
         FROM resultados_quiz r
         JOIN quizzes q ON r.quiz_id = q.id
         WHERE r.usuario_id = ?
         ORDER BY r.data_resposta DESC
         LIMIT 10`,
        [usuario_id]
      );
      res.json(result);
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
      res.status(500).json({ erro: 'Erro ao buscar estatísticas' });
    }
  });

  return router;
}
