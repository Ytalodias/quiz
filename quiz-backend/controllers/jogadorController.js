const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Jogador = require('../models/jogador')

exports.registrar = async (req, res) => {
  const { nome, email, senha } = req.body

  const existente = await Jogador.buscarPorEmail(email)
  if (existente) return res.status(400).json({ erro: 'Email já cadastrado' })

  const senhaHash = await bcrypt.hash(senha, 10)
  await Jogador.criarJogador(nome, email, senhaHash)

  res.status(201).json({ mensagem: 'Jogador registrado com sucesso!' })
}

exports.login = async (req, res) => {
  const { email, senha } = req.body
  const jogador = await Jogador.buscarPorEmail(email)

  if (!jogador) return res.status(400).json({ erro: 'Credenciais inválidas' })

  const senhaValida = await bcrypt.compare(senha, jogador.senha)
  if (!senhaValida) return res.status(400).json({ erro: 'Credenciais inválidas' })

  const token = jwt.sign({ id: jogador.id, tipo: 'jogador' }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  })

  res.json({ token, jogador: { id: jogador.id, nome: jogador.nome, email: jogador.email } })
}
