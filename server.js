import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração de __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Rota inicial
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Configuração do banco de dados (exemplo de uso)
app.post('/bombeiros', async (req, res) => {
  try {
    const { nome, email, senha, re } = req.body;

    const db = await open({
      filename: './banco.db',
      driver: sqlite3.Database,
    });

    await db.run('INSERT INTO bombeiros (nome, email, senha, re) VALUES (?, ?, ?, ?)', [
      nome,
      email,
      senha,
      re,
    ]);

    res.status(201).send('Bombeiro cadastrado com sucesso!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao cadastrar bombeiro');
  }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
