// Script para exibir o nome do bombeiro
document.addEventListener('DOMContentLoaded', () => {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const nomeBombeiro = localStorage.getItem('nomeBombeiro');
  
    if (nomeBombeiro) {
      welcomeMessage.textContent = `Bem-vindo, ${nomeBombeiro}!`;
    } else {
      welcomeMessage.textContent = 'Bem-vindo!';
    }
  });
  