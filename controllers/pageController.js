// Controller de páginas de erro

// Página 404 - Não encontrado
exports.get404 = (req, res) => {
  res.status(404).render("404.ejs");
};

// Página 500 - Erro interno do servidor
exports.get500 = (req, res) => {
  res.status(500).render("500.ejs");
};
