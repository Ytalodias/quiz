// backend/models/User.js
const db = require('../config/db');

const User = {
  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM jogadores WHERE email = ?';
    db.query(query, [email], callback);
  }
};

module.exports = User;
