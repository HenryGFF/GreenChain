import express from 'express';
import session from 'express-session';

import cadastroRoute from './src/api/componenteCadastroAPI.js';
import consultaComponenteRoute from './src/api/consultarComponenteAPI.js';
import consultaTodosComponentesRoute from './src/api/conultarTodosComponentes.js';
import consultaHistoricoRoute from './src/api/consultarHistoricoAPI.js';
import atualizarRoute from './src/api/atualizarAPI.js';
import criarLoginRoute from './src/api/criarLoginAPI.js';
import loginRoute from './src/api/login.js';
import logoutRoute from './src/api/logout.js';
import verificarLoginRoute from './src/api/verificarLoginAPI.js';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(session({
  secret: 'segredo-ultra-mega-secreto',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60,
    path: '/',          
    httpOnly: true,
    sameSite: 'lax'
  }
}))

app.use('/cadastroComponente', cadastroRoute);
app.use('/consultarComponente', consultaComponenteRoute);
app.use('/consultarTodosComponente', consultaTodosComponentesRoute);
app.use('/consultarHistorico', consultaHistoricoRoute);
app.use('/atualizacao', atualizarRoute);
app.use('/criarLogin', criarLoginRoute);
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/verificarSessaoLogin', verificarLoginRoute);

app.use(express.static('./public'));


app.get("/", (req, res) => {
  res.json({ status: "ok", mensagem: "Servidor rodando com sucesso!" });
});

app.use((req, res) => {
  res.status(404).json({ status: "erro", mensagem: "Rota não encontrada!" });
});

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({status:'erro', mensagem:'Houve um erro interno no servidor'})
})

app.use(express.static('./public'));

export default app;
