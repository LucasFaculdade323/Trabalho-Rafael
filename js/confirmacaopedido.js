
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
