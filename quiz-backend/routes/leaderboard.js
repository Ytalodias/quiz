import express from 'express';

export default function leaderboardRoutes(db) {
  const router = express.Router();

  router.get('/:quizId', async (req, res) => {
    const { quizId } = req.params;
    try {
      const [rows] = await db.query(
        `
        SELECT u.nome, p.pontuacao
        FROM pontuacoes p
        JOIN usuarios u ON u.id = p.usuario_id
        WHERE p.quiz_id = ?
        ORDER BY p.pontuacao DESC
        LIMIT 10
        `,
        [quizId]
      );
      res.json(rows);
    } catch (err) {
      console.error('Erro ao buscar leaderboard:', err);
      res.status(500).json({ erro: 'Erro ao buscar leaderboard' });
    }
  });

  return router;
}
