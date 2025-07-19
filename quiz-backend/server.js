import express from 'express'; 
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import quizzesRoutes from './routes/quizzes.js';
import resultadosRoutes from './routes/resultados.js';
import pontuacoesRoutes from './routes/pontuacoes.js';
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();

async function main() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Cria a pool dentro da função async
  const db = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'quiz',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Rotas de registro (jogador, criador, admin)
  app.post('/api/jogador/registro', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha)
      return res.status(400).json({ erro: 'Preencha todos os campos' });

    try {
      const [rows] = await db.query('SELECT id FROM jogadores WHERE email = ?', [email]);
      if (rows.length > 0)
        return res.status(400).json({ erro: 'Email já cadastrado' });

      const hash = await bcrypt.hash(senha, 10);
      await db.query('INSERT INTO jogadores (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hash]);

      res.json({ mensagem: 'Jogador registrado com sucesso!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao registrar jogador' });
    }
  });

  app.post('/api/criador/registro', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha)
      return res.status(400).json({ erro: 'Preencha todos os campos' });

    try {
      const [rows] = await db.query('SELECT id FROM criadores WHERE email = ?', [email]);
      if (rows.length > 0)
        return res.status(400).json({ erro: 'Email já cadastrado' });

      const hash = await bcrypt.hash(senha, 10);
      await db.query('INSERT INTO criadores (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hash]);

      res.json({ mensagem: 'Criador registrado com sucesso!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao registrar criador' });
    }
  });

  app.post('/api/admin/registro', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha)
      return res.status(400).json({ erro: 'Preencha todos os campos' });

    try {
      const [rows] = await db.query('SELECT id FROM admins WHERE email = ?', [email]);
      if (rows.length > 0)
        return res.status(400).json({ erro: 'Email já cadastrado' });

      const hash = await bcrypt.hash(senha, 10);
      await db.query('INSERT INTO admins (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hash]);

      res.json({ mensagem: 'Administrador registrado com sucesso!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao registrar administrador' });
    }
  });

  // Rota de login
  app.post('/api/login', async (req, res) => {
    const { email, senha, tipo } = req.body;
    if (!email || !senha || !tipo)
      return res.status(400).json({ erro: 'Preencha todos os campos e selecione o tipo' });

    const tabela = tipo === 'jogador' ? 'jogadores' :
                   tipo === 'criador' ? 'criadores' :
                   tipo === 'admin' ? 'admins' : null;

    if (!tabela) return res.status(400).json({ erro: 'Tipo inválido' });

    try {
      const [rows] = await db.query(`SELECT * FROM ${tabela} WHERE email = ?`, [email]);
      const usuario = rows[0];
      if (!usuario)
        return res.status(401).json({ erro: 'Email ou senha incorretos' });

      const senhaOk = await bcrypt.compare(senha, usuario.senha);
      if (!senhaOk)
        return res.status(401).json({ erro: 'Email ou senha incorretos' });

      res.json({ mensagem: 'Login realizado com sucesso!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro no login' });
    }
  });

  // Rotas que recebem a pool 'db'
  app.use('/api/quizzes', quizzesRoutes(db));
  app.use('/api/resultados', resultadosRoutes(db));
  app.use('/api/pontuacoes', pontuacoesRoutes(db));
  app.use('/api/leaderboard', leaderboardRoutes(db));

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

main().catch((err) => {
  console.error('Erro ao iniciar servidor:', err);
});
