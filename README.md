# Task App

Aplicação web para gerenciamento de tarefas com autenticação de usuários.

## Tecnologias

- Node.js
- Express.js
- MongoDB + Mongoose
- EJS (view engine)
- Express-session + connect-mongodb-session
- express-validator
- CSURF (proteção contra CSRF)
- Helmet (segurança)
- HTTPS (SSL/TLS)

## Funcionalidades

- Cadastro e login de usuários com validação de dados
- Sessões seguras armazenadas no MongoDB
- Criação, edição e exclusão de tarefas pessoais
- Proteção contra ataques CSRF
- Middleware para rotas autenticadas
- Interface simples com EJS
- HTTPS configurado com certificados SSL

## Instalação

0-Clone o repositório:

```
git clone https://github.com/RodrigoLDeAlmeida/task-app.git
cd task-app
```

1-Instale as dependências:

```
npm install
```

2-Crie um arquivo .env na raiz com as variáveis:

```
MONGODB_URI=mongodb://localhost:27017/taskapp
SESSION_SECRET=sua_chave_secreta
```

3-Gere os certificados SSL (para ambiente local de desenvolvimento):

```
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

4-Inicie o servidor:

```
node app.js
```

5-Acesse via navegador:

```
https://localhost:3000
```
