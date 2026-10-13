const formulario = document.getElementById("formCadastro");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const ra = document.getElementById("ra").value;
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmar = document.getElementById("confirmar").value;


    if (senha !== confirmar) {
        alert("As senhas não coincidem. Por favor, tente novamente.");
        return;
    }

    const cadastro = { ra: ra, nome: nome, email: email, senha: senha  };
    sessionStorage.setItem("cadastro", JSON.stringify(cadastro));
    alert("Cadastro realizado com sucesso!");

    window.location.href = "Login.html";
});


