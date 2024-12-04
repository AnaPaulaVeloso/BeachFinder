document.addEventListener("DOMContentLoaded", () => {
  const pwShowHide = document.querySelectorAll(".showHidePw");  // Todos os ícones
  const pwFields = document.querySelectorAll(".password"); 
  
  pwShowHide.forEach((eyeIcon, index) => {
    eyeIcon.addEventListener("click", () => {
      const pwField = pwFields[index];
      if (pwField.type === "password") {
        pwField.type = "text";  // Exibe a senha
        eyeIcon.classList.replace("uil-eye-slash", "uil-eye");
      } else {
        pwField.type = "password";  // Oculta a senha
        eyeIcon.classList.replace("uil-eye", "uil-eye-slash");
      }
    });
  });
});

// Função para cadastro
document.getElementById('formCadastro').addEventListener('submit', async function(e) {
  e.preventDefault(); // Previne o envio tradicional do formulário

  const nome = document.querySelector('input[placeholder="Digite seu nome"]').value;
  const email = document.querySelector('input[placeholder="Digite seu email"]').value;
  const senha = document.querySelector('input[placeholder="Crie uma senha"]').value;
  const re = document.querySelector('input[placeholder="Digite seu CNBC"]').value;

  const dados = { nome, email, senha, re };

  try {
    const response = await fetch('http://localhost:3000/bombeiros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    if (response.status === 201) {
      // Salva o nome do bombeiro no localStorage
      localStorage.setItem('nomeBombeiro', nome);
      // Redireciona para a página de boas-vindas
      window.location.href = 'bem-vindo.html';
    } else {
      alert('Erro ao cadastrar bombeiro');
    }
  } catch (error) {
    alert("Erro ao enviar os dados: " + error.message);
  }
});

// Função para login
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
  });

  if (response.status === 200) {
      const { nome } = await response.json();
      localStorage.setItem('nomeBombeiro', nome); // Armazena o nome no localStorage
      window.location.href = '/bem-vindo.html'; // Redireciona para a página de boas-vindas
  } else {
      alert('Erro ao fazer login');
  }
});


// Espera que a página seja carregada
document.addEventListener("DOMContentLoaded", function() {
  // Encontre o botão pelo ID
  var loginButton = document.getElementById("loginButton");

  // Adiciona um evento de clique
  loginButton.addEventListener("click", function() {
      window.location.href = "login_bombeiro.html";
  });
});