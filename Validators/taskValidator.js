const express = require("express");
const { body } = require("express-validator");
const taskController = require("../controllers/task");

const router = express.Router();

// Validação do resumo da tarefa
const validateSummary = body("summary")
  .trim()
  .notEmpty().withMessage("O resumo não pode estar vazio")
  .isLength({ max: 100 }).withMessage("Máximo de 100 caracteres");

// Rotas de tarefas
router.post("/add-task", validateSummary, taskController.postAddTask);
router.post("/edit-task/:id", validateSummary, taskController.postEditTask);
router.post("/delete-task/:id", taskController.postDeleteTask);

module.exports = router;
