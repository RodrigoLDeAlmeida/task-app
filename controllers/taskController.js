const Task = require("../models/task");
const { validationResult } = require("express-validator");

// Função auxiliar para renderizar menu com erros
const renderMenuWithErrors = async (req, res, oldInput = {}, errors = []) => {
  try {
    const tasks = await Task.find({ userId: req.session.user._id });
    res.status(errors.length ? 422 : 200).render("menu.ejs", {
      tasks,
      csrfToken: req.csrfToken(),
      isAuthenticated: req.session.isLoggedIn,
      errors,
      oldInput,
    });
  } catch (err) {
    console.error("Erro ao buscar tarefas:", err);
    res.send("Erro ao carregar tarefas.");
  }
};

exports.getTasks = async (req, res) => {
  await renderMenuWithErrors(req, res);
};

exports.postAddTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return await renderMenuWithErrors(req, res, { summary: req.body.summary }, errors.array());
  }

  try {
    const task = new Task({
      summary: req.body.summary,
      userId: req.session.user._id,
    });
    await task.save();
    res.redirect("/");
  } catch (err) {
    console.error("Erro ao adicionar tarefa:", err);
    res.send("Erro ao adicionar tarefa.");
  }
};

exports.postEditTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return await renderMenuWithErrors(req, res, { summary: req.body.summary }, errors.array());
  }

  try {
    await Task.updateOne(
      { _id: req.params.id, userId: req.session.user._id },
      { $set: { summary: req.body.summary } }
    );
    res.redirect("/");
  } catch (err) {
    console.error("Erro ao editar tarefa:", err);
    res.send("Erro ao editar tarefa.");
  }
};

exports.postDeleteTask = async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.params.id, userId: req.session.user._id });
    res.redirect("/");
  } catch (err) {
    console.error("Erro ao deletar tarefa:", err);
    res.send("Erro ao deletar tarefa.");
  }
};
