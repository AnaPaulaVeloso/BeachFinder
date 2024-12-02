import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configurações gerais do servidor
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração mais restritiva para Live Server
app.use(
  cors({
    origin: 'http://127.0.0.1:5500', // Permitir apenas o Live Server
    methods: ['GET', 'POST'], // Métodos permitidos
  })
);

app.use(express.static(path.join(__dirname, 'public')));


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define o local de armazenamento
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Define um nome único para o arquivo
  },
});

const upload = multer({ storage });


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

  // Criar tabela para cadastro de crianças desaparecidas (caso não exista)
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

  console.log('Tabelas verificadas e prontas.');
  return db;
};

// Endpoint inicial
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Endpoint para cadastrar crianças desaparecidas
app.post('/cadastro-crianca', upload.single('foto'), async (req, res) => {
  try {
    console.log('Recebendo dados da criança:', req.body, req.file); // Log para depuração

    const { nome_crianca, nome_responsavel, telefone_responsavel, descricao } = req.body;
    const foto = req.file ? req.file.filename : null; // Nome do arquivo enviado

    // Validação de campos obrigatórios
    if (!nome_crianca || !nome_responsavel || !telefone_responsavel || !descricao) {
      return res.status(400).send('Todos os campos (exceto a foto) são obrigatórios.');
    }

    const db = await open({
      filename: './banco.db',
      driver: sqlite3.Database,
    });

    // Inserir dados no banco de dados
    await db.run(
      'INSERT INTO crianças_desaparecidas (nome_crianca, nome_responsavel, telefone_responsavel, descricao, foto) VALUES (?, ?, ?, ?, ?)',
      [nome_crianca, nome_responsavel, telefone_responsavel, descricao, foto]
    );

    res.status(201).send('Cadastro de criança realizado com sucesso!');
  } catch (error) {
    console.error('Erro ao cadastrar criança:', error);
    res.status(500).send('Erro ao cadastrar criança.');
  }
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

