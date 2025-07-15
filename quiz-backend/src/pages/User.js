
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    role: { type: String, enum: ["admin", "criador", "jogador"], default: "jogador"}
})

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password)
}

app.post('/login', (req, res) => {
    const { username, password} = req.body;
    const user = user.find(u => u.username == username && u.password == password);
    if (!user) {
        return res.status().json({message: 'Usuário ou senha inválidos'});
    }

    const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
})

module.exports = mongoose.model("User", userSchema)