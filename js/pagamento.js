
const pedido = JSON.parse(sessionStorage.getItem('pedido'));

const totalPagamento = document.getElementById("totalPagamento");

const formulario = document.getElementById("formPagamento");

if (!pedido || !pedido.produtos || pedido.produtos.length === 0) {
    alert("Não há pedido para pagamento");
    window.location.href = "Cardapio.html";
} else {
    totalPagamento.textContent = pedido.total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!pedido || !pedido.produtos || pedido.produtos.length === 0) {
        return;
    }

    const pagamento = document.querySelector('input[name="pagamento"]:checked').value;

    sessionStorage.setItem("pagamento", pagamento);

    alert("Pagamento confirmado com sucesso!");

    window.location.href = "confirmacaopedido.html";

});
