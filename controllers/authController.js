const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { validationResult } = require("express-validator");

// Função auxiliar para renderizar views de auth com erros
const renderAuth = (res, view, req, errors = [], oldInput = {}) => {
  res.status(errors.length ? 422 : 200).render(`auth/${view}.ejs`, {
    csrfToken: req.csrfToken(),
    isAuthenticated: req.session.isLoggedIn,
    errors,
    oldInput,
  });
};

// GET /login
exports.getLogin = (req, res) => renderAuth(res, "login", req);

// POST /login
exports.postLogin = async (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return renderAuth(res, "login", req, errors.array(), { email });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return renderAuth(res, "login", req, [{ msg: "Usuário não encontrado." }], { email });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return renderAuth(res, "login", req, [{ msg: "Senha inválida." }], { email });
    }

    req.session.isLoggedIn = true;
    req.session.user = { _id: user._id, email: user.email };

    return req.session.save(() => res.redirect("/"));
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).send("Erro interno ao logar.");
  }
};

// POST /logout
exports.postLogout = (req, res) => {
  req.session.destroy(() => res.redirect("/"));
};

// GET /signup
exports.getSignup = (req, res) => renderAuth(res, "signup", req);

// POST /signup
exports.postSignup = async (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return renderAuth(res, "signup", req, errors.array(), { email });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return renderAuth(res, "signup", req, [{ msg: "Usuário já existe." }], { email });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.redirect("/login");
  } catch (err) {
    console.error("Erro no cadastro:", err);
    res.status(500).send("Erro interno ao cadastrar.");
  }
};
