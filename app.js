require("dotenv").config();
const fs = require("fs");
const path = require("path");
const https = require("https");

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const helmet = require("helmet");

const isAuth = require("./util/is-auth");
const authController = require("./controllers/authController");
const taskController = require("./controllers/taskController");
const pageController = require("./controllers/pageController");
const { signupValidator, loginValidator } = require("./validators/authValidator");

// -------------------- Configurações iniciais --------------------
const app = express();
const port = 3000;
const uri = process.env.MONGODB_URI;
const secret = process.env.SESSION_SECRET;

if (!uri || !secret) {
  throw new Error("Variáveis de ambiente MONGODB_URI ou SESSION_SECRET não definidas.");
}

// -------------------- View engine --------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// -------------------- Middlewares --------------------
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// -------------------- Sessão --------------------
const store = new MongoDBStore({ uri, collection: "sessions" });
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// -------------------- CSRF --------------------
const csrfProtection = csrf();
app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

// -------------------- Rotas --------------------
// Home
app.get("/", isAuth, taskController.getTasks);

// Auth
app.get("/login", authController.getLogin);
app.post("/login", loginValidator, authController.postLogin);
app.post("/logout", authController.postLogout);
app.get("/signup", authController.getSignup);
app.post("/signup", signupValidator, authController.postSignup);

// Tasks
app.post("/task/add", isAuth, taskController.postAddTask);
app.post("/task/delete/:id", isAuth, taskController.postDeleteTask);
app.post("/task/edit/:id", isAuth, taskController.postEditTask);

// 404 
app.use(pageController.get404);

// -------------------- HTTPS --------------------
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

// -------------------- Tratamento de Erros Internos --------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render("500", {
    pageTitle: "Erro Interno",
    message: err.message,
    isAuthenticated: req.session.isLoggedIn,
  });
});

// -------------------- Inicialização --------------------
async function startServer() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB (Mongoose)");

    https.createServer(options, app).listen(port, () => {
      console.log(`App rodando em https://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); 
  }
}

startServer();
