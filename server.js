import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configurações gerais do servidor
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração mais restritiva para Live Server
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Permitir apenas o Live Server
  methods: ['GET', 'POST'],        // Métodos permitidos
}));

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Função para inicializar o banco de dados e criar tabelas
const initDB = async () => {
  const db = await open({
    filename: './banco.db',
    driver: sqlite3.Database,
  });

  // Criar tabela bombeiros (caso não exista)
  await db.run(`
    CREATE TABLE IF NOT EXISTS bombeiros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      senha TEXT NOT NULL,
      re TEXT NOT NULL
    )
  `);

  console.log('Tabela de bombeiros criada/verificada.');
  return db;
};

// Endpoint inicial
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Endpoint para cadastrar bombeiros
app.post('/bombeiros', async (req, res) => {
  try {
    console.log('Recebendo dados do bombeiro:', req.body); // Log para depuração
    const { nome, email, senha, re } = req.body;

    // Validação de campos obrigatórios
    if (!nome || !email || !senha || !re) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const db = await open({
      filename: './banco.db',
      driver: sqlite3.Database,
    });

    // Inserir dados no banco
    await db.run('INSERT INTO bombeiros (nome, email, senha, re) VALUES (?, ?, ?, ?)', [
      nome,
      email,
      senha,
      re,
    ]);

    res.status(201).send('Bombeiro cadastrado com sucesso!');
  } catch (error) {
    console.error('Erro ao cadastrar bombeiro:', error);
    res.status(500).send('Erro ao cadastrar bombeiro.');
  }
});

// Endpoint de login para bombeiros
app.post('/login', async (req, res) => {
  try {
    console.log('Tentativa de login:', req.body); // Log para depuração
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).send('Email e senha são obrigatórios.');
    }

    const db = await open({
      filename: './banco.db',
      driver: sqlite3.Database,
    });

    // Verificar se o email e senha correspondem a um bombeiro
    const bombeiro = await db.get('SELECT * FROM bombeiros WHERE email = ? AND senha = ?', [email, senha]);

    if (!bombeiro) {
      return res.status(401).send('Email ou senha inválidos.');
    }

    res.status(200).send(`Bem-vindo, ${bombeiro.nome}!`);
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).send('Erro ao realizar login.');
  }
});

// Inicializar servidor
const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await initDB();
});
