import express from 'express';
import bcrypt from 'bcryptjs';
import db from './db.js'; // sua conexão com o banco

const router = express.Router();

// Função auxiliar para registrar usuário
async function registrarUsuario(tabela, nome, email, senha, res) {
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos' });
  }
  try {
    const [rows] = await db.query(`SELECT id FROM ${tabela} WHERE email = ?`, [email]);
    if (rows.length > 0) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }
    const hash = await bcrypt.hash(senha, 10);
    await db.query(`INSERT INTO ${tabela} (nome, email, senha) VALUES (?, ?, ?)`, [nome, email, hash]);
    res.json({ mensagem: `${tabela.charAt(0).toUpperCase() + tabela.slice(1)} registrado com sucesso!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao registrar usuário' });
  }
}

// Função auxiliar para login
async function loginUsuario(tabela, email, senha, res) {
  if (!email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos' });
  }
  try {
    const [rows] = await db.query(`SELECT * FROM ${tabela} WHERE email = ?`, [email]);
    if (rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }
    const usuario = rows[0];
    const senhaOk = await bcrypt.compare(senha, usuario.senha);
    if (!senhaOk) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }
    res.json({
      mensagem: 'Login realizado com sucesso!',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipoUsuario: tabela,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no login' });
  }
}

// Rotas Registro
router.post('/jogador/registro', async (req, res) => {
  const { nome, email, senha } = req.body;
  await registrarUsuario('jogadores', nome, email, senha, res);
});

router.post('/criador/registro', async (req, res) => {
  const { nome, email, senha } = req.body;
  await registrarUsuario('criadores', nome, email, senha, res);
});

router.post('/admin/registro', async (req, res) => {
  const { nome, email, senha } = req.body;
  await registrarUsuario('admins', nome, email, senha, res);
});

// Rotas Login
router.post('/jogador/login', async (req, res) => {
  const { email, senha } = req.body;
  await loginUsuario('jogadores', email, senha, res);
});

router.post('/criador/login', async (req, res) => {
  const { email, senha } = req.body;
  await loginUsuario('criadores', email, senha, res);
});

router.post('/admin/login', async (req, res) => {
  const { email, senha } = req.body;
  await loginUsuario('admins', email, senha, res);
});

export default router;
