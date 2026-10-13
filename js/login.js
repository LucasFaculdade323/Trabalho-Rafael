const formulario = document.getElementById('formLogin'); // Seleciona o formulário pelo ID

formulario.addEventListener("submit", function(event){
    event.preventDefault(); // Impede o envio do formulário

    const email = document.getElementById('email').value; // Seleciona o campo de e-mail pelo ID
    const senha = document.getElementById('senha').value; // Selecion

    const cadastro = JSON.parse(sessionStorage.getItem('cadastro')); // Recupera o cadastro do usuário do armazenamento local

    if (!cadastro){
        alert("Nenhum cadastro encontrado");
        return;

    }

    if(email !== cadastro.email || senha !== cadastro.senha){
        alert("E-mail ou senha incorretos");
        return;
    }
    alert("Login realizado com sucesso!")


    window.location.href = "Cardapio.html"; // Redireciona para a página de index.html após o login

});
