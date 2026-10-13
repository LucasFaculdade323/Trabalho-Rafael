const formulario = document.getElementById('formCadastro');

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const senha = document.getElementById("senha").value;
    const confirmar = document.getElementById("confirmar").value;
    if (senha !== confirmar) {
        alert("As senhas não coincidem.");
        return;
    }
    alert("Cadastro realizado com sucesso!");
    window.location.href = "cardapio.html"; // Redireciona para a página de login
});


