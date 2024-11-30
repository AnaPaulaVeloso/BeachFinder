document.getElementById('formCadastroCrianca').addEventListener('submit', function (event) {
    event.preventDefault();
  
    const nomeCrianca = document.getElementById('nomeCrianca').value;
    const nomeResponsavel = document.getElementById('nomeResponsavel').value;
    const telefoneResponsavel = document.getElementById('telefoneResponsavel').value;
    const descricaoCrianca = document.getElementById('descricaoCrianca').value;
    const ultimaVezVista = document.getElementById('ultimaVezVista').value;
  
    // Simula o envio para o servidor (exemplo)
    console.log({
      nomeCrianca,
      nomeResponsavel,
      telefoneResponsavel,
      descricaoCrianca,
      ultimaVezVista,
    });
  
    alert("Cadastro realizado com sucesso!");
  });
  