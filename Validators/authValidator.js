const { body } = require("express-validator");

// Validações para cadastro
exports.signupValidator = [
  body("email")
    .isEmail().withMessage("Email inválido")
    .normalizeEmail(),

  body("password")
    .trim()
    .isLength({ min: 6 }).withMessage("A senha deve ter no mínimo 6 caracteres")
];

// Validações para login
exports.loginValidator = [
  body("email")
    .isEmail().withMessage("Email inválido")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty().withMessage("Senha é obrigatória")
];
