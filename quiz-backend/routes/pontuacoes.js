import express from 'express';

export default function pontuacoesRoutes(db) {
  const router = express.Router();

  // Rota para salvar pontuação
  router.post('/', async (req, res) => {
    const { usuario_id, quiz_id, pontuacao } = req.body;

    if (!usuario_id || !quiz_id || pontuacao == null) {
      return res.status(400).json({ mensagem: "Dados incompletos" });
    }

    try {
      await db.execute(
        "INSERT INTO pontuacoes (usuario_id, quiz_id, pontuacao) VALUES (?, ?, ?)",
        [usuario_id, quiz_id, pontuacao]
      );
      return res.status(201).json({ mensagem: "Pontuação salva com sucesso" });
    } catch (error) {
      console.error("Erro ao salvar pontuação:", error);
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  });

  return router;
}
