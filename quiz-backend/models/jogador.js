const db = require('../database/db')

const criarJogador = async (nome, email, senhaHash) => {
  const [result] = await db.execute(
    'INSERT INTO jogadores (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senhaHash]
  )
  return result
}

const buscarPorEmail = async (email) => {
  const [result] = await db.execute(
    'SELECT * FROM jogadores WHERE email = ?',
    [email]
  )
  return result[0]
}

module.exports = {
  criarJogador,
  buscarPorEmail
}
