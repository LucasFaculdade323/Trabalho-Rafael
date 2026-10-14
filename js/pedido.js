const pedido = JSON.parse(sessionStorage.getItem("pedido"));

const listaPedido = document.getElementById("listaPedido");
const totalPedido = document.getElementById("totalPedido");
const confirmarPedido = document.getElementById("confirmarPedido");


if (!pedido || !pedido.produtos || pedido.produtos.length === 0) {
    listaPedido.textContent = "Nenhum produto selecionado.";
    confirmarPedido.disabled = true;
} else {

    // Mostra cada produto selecionado
    pedido.produtos.forEach(produto => {

        // Cria um parágrafo para cada produto
        const item = document.createElement("p");

        // Mostra o nome e o preço do produto
        item.textContent = produto.nome + " — " +
            produto.preco.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

        // Adiciona o produto na lista do pedido
        listaPedido.appendChild(item);
    });

    // Mostra o valor total do pedido
    totalPedido.textContent = pedido.total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

confirmarPedido.addEventListener("click", function() {
    window.location.href = "pagamento.html";

});
