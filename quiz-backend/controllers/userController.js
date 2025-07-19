// backend/controllers/userController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { email, senha } = req.body;

  User.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ msg: 'Erro no servidor' });
    if (results.length === 0) return res.status(401).json({ msg: 'Email ou senha inválidos' });

    const user = results[0];

    bcrypt.compare(senha, user.senha, (err, ok) => {
      if (!ok) return res.status(401).json({ msg: 'Senha incorreta' });

      const token = jwt.sign({ id: user.id, tipo: user.tipo }, 'segredo', { expiresIn: '1h' });
      res.json({ token });
    });
  });
};
