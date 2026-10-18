
const pedido = JSON.parse(sessionStorage.getItem("pedido"));

const pagamento = sessionStorage.getItem("pagamento");

// Localiza os elementos do HTML
const produtosConfirmacao = document.getElementById("produtosConfirmacao");
const totalConfirmacao = document.getElementById("totalConfirmacao");
const formaPagamento = document.getElementById("formaPagamento");

// Verifica se existe um pedido confirmado
if (!pedido || !pedido.produtos || pedido.produtos.length === 0 || !pagamento) {
    alert("Nenhum pedido confirmado encontrado");
    window.location.href = "Cardapio.html";
} else {

    // Desconta o estoque somente uma vez por pedido
    if (sessionStorage.getItem("estoqueDescontado") !== "sim") {

        // Percorre os produtos comprados
        pedido.produtos.forEach(function(produto) {

            // Recupera a quantidade salva no estoque
            const chave = "estoque_" + produto.nome;
            const quantidadeSalva = localStorage.getItem(chave);

            // Verifica se o produto possui controle de estoque
            if (quantidadeSalva !== null) {

                const quantidade = Number(quantidadeSalva);

                // Diminui uma unidade, sem deixar negativo
                if (quantidade > 0) {
                    localStorage.setItem(chave, quantidade - 1);
                }
            }
        });

        // Registra que o estoque já foi descontado
        sessionStorage.setItem("estoqueDescontado", "sim");
    }

    // Mostra os produtos comprados
    pedido.produtos.forEach(function(produto) {

        const item = document.createElement("p");

        item.textContent = produto.nome + " - R$ " +
            produto.preco.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

        // Adiciona o produto na página
        produtosConfirmacao.appendChild(item);
    });

    // Mostra o total do pedido
    totalConfirmacao.textContent = pedido.total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Mostra a forma de pagamento
    formaPagamento.textContent = pagamento;
}
