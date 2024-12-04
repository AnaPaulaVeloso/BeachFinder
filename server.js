import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.urlencoded({ extended: true }));



app.use(
  cors({
    origin: 'http://127.0.0.1:5500', 
    methods: ['GET', 'POST'], // Métodos permitidos
  })
);

app.use(express.static(path.join(__dirname, 'public')));

const initDB = async () => {
  const db = await open({
    filename: './banco.db',
    driver: sqlite3.Database,
  });

  // Criar tabela para cadastro de crianças desaparecidas
  await db.run(`
    CREATE TABLE IF NOT EXISTS crianças_desaparecidas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_crianca TEXT NOT NULL,
      nome_responsavel TEXT NOT NULL,
      telefone_responsavel TEXT NOT NULL,
      descricao TEXT NOT NULL,
      foto TEXT
    )
  `);

  // Criar tabela para cadastro de bombeiros
  await db.run(`
    CREATE TABLE IF NOT EXISTS bombeiros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      senha TEXT NOT NULL,
      re TEXT NOT NULL
    )
  `);

  // Criar tabela para cadastro de crianças encontradas
  await db.run(`
    CREATE TABLE IF NOT EXISTS crianças_encontradas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_crianca TEXT NOT NULL,
      descricao TEXT NOT NULL,
      onde_encontrou TEXT NOT NULL,
      posto TEXT NOT NULL
    )
  `);

  console.log('Tabelas verificadas e prontas.');
  return db;
};

// Endpoint inicial
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Endpoint para cadastrar bombeiros
app.post('/cadastro-bombeiro', async (req, res) => {
  try {
    console.log('Recebendo dados do bombeiro:', req.body); // Log para depuração

    const { nome, email, senha, re } = req.body;

    // Verificação de campos obrigatórios
    if (!nome || !email || !senha || !re) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const db = await open({
      filename: './banco.db',
      driver: sqlite3.Database,
    });

    // Inserção de dados no banco com os nomes corretos das colunas
    await db.run(
      'INSERT INTO bombeiros (nome, email, senha, re) VALUES (?, ?, ?, ?)',
      [nome, email, senha, re]
    );

    res.status(201).send('Cadastro de bombeiro realizado com sucesso!');
  } catch (error) {
    console.error('Erro ao cadastrar bombeiro:', error);
    res.status(500).send('Erro ao cadastrar bombeiro.');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).send('Email e senha são obrigatórios.');
    }

    const db = await open({
      filename: './banco.db',
      driver: sqlite3.Database,
    });

    // Verifica se o email e a senha existem no banco
    const bombeiro = await db.get('SELECT * FROM bombeiros WHERE email = ? AND senha = ?', [email, senha]);

    if (bombeiro) {
      res.status(200).send('Login bem-sucedido');
    } else {
      res.status(401).send('Credenciais incorretas');
    }
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    res.status(500).send('Erro ao realizar login.');
  }
});



// Endpoint para cadastrar crianças encontradas
app.post('/cadastro-crianca-encontrada', async (req, res) => {
  try {
    console.log('Recebendo dados da criança encontrada:', req.body); // Verifique o corpo da requisição
    const { nomeCrianca, descricaoCrianca, ondeEncontrou, posto } = req.body;

    if (!nomeCrianca || !descricaoCrianca || !ondeEncontrou || !posto) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const db = await open({
      filename: './banco.db',
      driver: sqlite3.Database,
    });

    // Inserção no banco de dados
    await db.run(
      'INSERT INTO crianças_encontradas (nomeCrianca, descricaoCrianca, ondeEncontrou, posto) VALUES (?, ?, ?, ?)',
      [nomeCrianca, descricaoCrianca, ondeEncontrou, posto]
    );

    res.status(201).send('Cadastro de criança encontrada realizado com sucesso!');
  } catch (error) {
    console.error('Erro ao cadastrar criança encontrada:', error); // Exibe o erro completo no console
    res.status(500).send('Erro ao cadastrar criança encontrada.');
  }
});


// Inicializar servidor
const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await initDB();
});
