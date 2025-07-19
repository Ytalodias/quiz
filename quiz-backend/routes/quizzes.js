import express from 'express';

export default function (db) {
  const router = express.Router();

  // === Criar novo quiz ===
  router.post('/', async (req, res) => {
    const { titulo, descricao, categoria, criador, perguntas } = req.body;

    if (!titulo || !categoria || !criador || !perguntas || perguntas.length === 0) {
      return res.status(400).json({ mensagem: "Dados incompletos" });
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Buscar ID do criador pelo email
      const [criadorRows] = await conn.query(
        'SELECT id FROM criadores WHERE email = ?',
        [criador]
      );

      if (criadorRows.length === 0) {
        await conn.rollback();
        return res.status(400).json({ mensagem: "Criador não encontrado" });
      }

      const criadorId = criadorRows[0].id;

      // Inserir quiz
      const [quizResult] = await conn.query(
        'INSERT INTO quizzes (titulo, descricao, categoria, id_criador) VALUES (?, ?, ?, ?)',
        [titulo, descricao, categoria, criadorId]
      );

      const quizId = quizResult.insertId;

      // Inserir perguntas e respostas
      for (const p of perguntas) {
        const respostaCorreta = p.respostas.find(r => r.correta)?.texto;
        const respostasErradas = p.respostas.filter(r => !r.correta).map(r => r.texto);

        if (!respostaCorreta || respostasErradas.length === 0) {
          await conn.rollback();
          return res.status(400).json({ mensagem: "Respostas inválidas" });
        }

        await conn.query(
          'INSERT INTO perguntas (id_quiz, enunciado, resposta_correta, respostas_erradas, tempo_limite_segundos) VALUES (?, ?, ?, ?, ?)',
          [
            quizId,
            p.texto,
            respostaCorreta,
            JSON.stringify(respostasErradas),
            p.tempo || 30
          ]
        );
      }

      await conn.commit();
      res.status(201).json({ mensagem: "Quiz criado com sucesso", quizId });
    } catch (err) {
      await conn.rollback();
      console.error("Erro ao criar quiz:", err);
      res.status(500).json({ mensagem: "Erro ao criar quiz" });
    } finally {
      conn.release();
    }
  });

  // === Listar todos os quizzes ===
  router.get('/', async (req, res) => {
    try {
      const [quizzes] = await db.query('SELECT * FROM quizzes');
      res.json(quizzes);
    } catch (err) {
      console.error('Erro ao buscar quizzes:', err);
      res.status(500).json({ erro: 'Erro ao buscar quizzes' });
    }
  });

  // === Obter quiz por ID com perguntas ===
  router.get('/:id', async (req, res) => {
    const quizId = req.params.id;

    try {
      const [[quiz]] = await db.query('SELECT * FROM quizzes WHERE id = ?', [quizId]);

      if (!quiz) {
        return res.status(404).json({ erro: 'Quiz não encontrado' });
      }

      const [perguntas] = await db.query('SELECT * FROM perguntas WHERE id_quiz = ?', [quizId]);

      for (const pergunta of perguntas) {
        const alternativas = [pergunta.resposta_correta, ...JSON.parse(pergunta.respostas_erradas)];
        pergunta.alternativas = alternativas.sort(() => Math.random() - 0.5);
      }

      res.json({
        id: quiz.id,
        titulo: quiz.titulo,
        descricao: quiz.descricao,
        perguntas
      });
    } catch (err) {
      console.error('Erro ao buscar quiz por ID:', err);
      res.status(500).json({ erro: 'Erro ao buscar quiz' });
    }
  });

  // === Buscar nome do jogador pelo email ===
  router.get('/jogadores/email/:email', async (req, res) => {
    const { email } = req.params;

    try {
      const [rows] = await db.query('SELECT nome FROM jogadores WHERE email = ?', [email]);

      if (rows.length === 0) {
        return res.status(404).json({ mensagem: 'Jogador não encontrado' });
      }

      res.json(rows[0]); // { nome: 'ytalo' }
    } catch (err) {
      console.error('Erro ao buscar nome do jogador:', err);
      res.status(500).json({ mensagem: 'Erro ao buscar nome do jogador' });
    }
  });

  return router;
}
