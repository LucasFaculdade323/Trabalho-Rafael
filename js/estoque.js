
const produtos = document.querySelectorAll(".produto");

// Percorre todos os produtos do estoque
produtos.forEach(function(produto) {

    // Seleciona os elementos de cada produto
    const nome = produto.querySelector("h3").textContent;
    const quantidade = produto.querySelector(".quantidade");
    const status = produto.querySelector(".status");
    const diminuir = produto.querySelector(".diminuir");
    const aumentar = produto.querySelector(".aumentar");

    // Recupera a quantidade salva no navegador
    const quantidadeSalva = localStorage.getItem("estoque_" + nome);

    if (quantidadeSalva !== null) {
        quantidade.textContent = quantidadeSalva;
    }

    // Atualiza a quantidade e a disponibilidade
    function atualizarEstoque(valor) {
        quantidade.textContent = valor;

        if (valor > 0) {
            status.textContent = "Status: Disponível";
        } else {
            status.textContent = "Status: Indisponível";
        }

        // Salva a quantidade no navegador
        localStorage.setItem("estoque_" + nome, valor);
    }

    // Atualiza o status ao carregar a página
    atualizarEstoque(Number(quantidade.textContent));

    // Botão para diminuir a quantidade
    diminuir.addEventListener("click", function() {
        let valor = Number(quantidade.textContent);

        if (valor > 0) {
            valor--;
        }

        atualizarEstoque(valor);
    });

    // Botão para aumentar a quantidade
    aumentar.addEventListener("click", function() {
        let valor = Number(quantidade.textContent);

        valor++;

        atualizarEstoque(valor);
    });

});
