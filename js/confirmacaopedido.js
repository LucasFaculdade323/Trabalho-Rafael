
const pedido = JSON.parse(sessionStorage.getItem("pedido"));
const pagamento = sessionStorage.getItem("pagamento");

// Localiza os elementos da página
const produtosConfirmacao = document.getElementById("produtosConfirmacao");
const totalConfirmacao = document.getElementById("totalConfirmacao");
const formaPagamento = document.getElementById("formaPagamento");
const statusPedido = document.getElementById("statusPedido");

const selecionarStatus = document.getElementById("selecionarStatus");
const atualizarStatus = document.getElementById("atualizarStatus");
const cancelarPedido = document.getElementById("cancelarPedido");

// Recupera o status atual
const statusSalvo = sessionStorage.getItem("statusPedido") || "Em preparação";

// Atualiza a quantidade dos produtos cadastrados
function atualizarProdutoCadastrado(nome, quantidade) {

    const produtos = JSON.parse(
        localStorage.getItem("produtosCadastrados") || "[]"
    );

    const produto = produtos.find(function(item) {
        return item.nome === nome;
    });

    if (produto) {
        produto.quantidade = quantidade;

        localStorage.setItem(
            "produtosCadastrados",
            JSON.stringify(produtos)
        );
    }
}

// Verifica quais ações estão permitidas
function verificarCancelamento() {

    const statusAtual =
        sessionStorage.getItem("statusPedido") || "Em preparação";

    // Só permite cancelar durante a preparação
    cancelarPedido.disabled = statusAtual !== "Em preparação";

    // Não permite atualizar pedidos entregues ou cancelados
    const finalizado =
        statusAtual === "Cancelado" || statusAtual === "Entregue";

    selecionarStatus.disabled = finalizado;
    atualizarStatus.disabled = finalizado;
}

// Verifica se existe um pedido confirmado
if (
    !pedido ||
    !Array.isArray(pedido.produtos) ||
    pedido.produtos.length === 0 ||
    !pagamento
) {

    alert("Nenhum pedido confirmado encontrado");
    window.location.href = "Cardapio.html";

} else {

    // Mostra o status atual
    statusPedido.textContent = statusSalvo;

    // Ajusta a seleção para o status atual
    if (statusSalvo !== "Cancelado") {
        selecionarStatus.value = statusSalvo;
    }

    // Desconta o estoque somente uma vez por pedido
    if (
        sessionStorage.getItem("estoqueDescontado") !== "sim" &&
        statusSalvo !== "Cancelado"
    ) {

        // Guarda os produtos realmente descontados
        const produtosDescontados = [];

        // Percorre os produtos comprados
        pedido.produtos.forEach(function(produto) {

            const chave = "estoque_" + produto.nome;
            const quantidadeSalva = localStorage.getItem(chave);

            // Verifica se o produto possui controle de estoque
            if (quantidadeSalva !== null) {

                const quantidade = Number(quantidadeSalva);

                // Diminui uma unidade sem deixar negativo
                if (quantidade > 0) {

                    const novaQuantidade = quantidade - 1;

                    localStorage.setItem(chave, novaQuantidade);

                    // Atualiza também os produtos cadastrados
                    atualizarProdutoCadastrado(
                        produto.nome,
                        novaQuantidade
                    );

                    // Guarda o nome do produto descontado
                    produtosDescontados.push(produto.nome);
                }
            }
        });

        // Salva quais produtos foram descontados
        sessionStorage.setItem(
            "produtosDescontados",
            JSON.stringify(produtosDescontados)
        );

        // Impede descontar novamente ao atualizar a página
        sessionStorage.setItem("estoqueDescontado", "sim");
    }

    // Mostra os produtos comprados
    pedido.produtos.forEach(function(produto) {

        const item = document.createElement("p");

        item.textContent = produto.nome + " - R$ " +
            Number(produto.preco).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

        produtosConfirmacao.appendChild(item);
    });

    // Mostra o total do pedido
    totalConfirmacao.textContent =
        Number(pedido.total).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    // Mostra a forma de pagamento
    formaPagamento.textContent = pagamento;

    // Atualiza os botões conforme o status
    verificarCancelamento();
}

// Atualiza o status do pedido
atualizarStatus.addEventListener("click", function() {

    const statusAtual =
        sessionStorage.getItem("statusPedido") || "Em preparação";

    const novoStatus = selecionarStatus.value;

    // Não permite alterar pedidos cancelados
    if (statusAtual === "Cancelado") {
        alert("Este pedido já foi cancelado.");
        return;
    }

    // Não permite alterar pedidos entregues
    if (statusAtual === "Entregue") {
        alert("Este pedido já foi entregue e não pode ser alterado.");
        selecionarStatus.value = statusAtual;
        return;
    }

    // Não permite voltar para uma etapa anterior
    if (
        statusAtual === "Pronto" &&
        novoStatus === "Em preparação"
    ) {
        alert("Não é possível voltar o pedido para Em preparação.");
        selecionarStatus.value = statusAtual;
        return;
    }

    // Não precisa atualizar se o status já for o mesmo
    if (statusAtual === novoStatus) {
        alert("O pedido já está com esse status.");
        return;
    }

    // Salva o novo status
    sessionStorage.setItem("statusPedido", novoStatus);

    // Atualiza o status na página
    statusPedido.textContent = novoStatus;

    // Atualiza os botões
    verificarCancelamento();

    alert("Status atualizado com sucesso!");
});

// Cancela o pedido
cancelarPedido.addEventListener("click", function() {

    const statusAtual =
        sessionStorage.getItem("statusPedido") || "Em preparação";

    // Permite cancelar somente pedidos em preparação
    if (statusAtual !== "Em preparação") {
        alert("Este pedido não pode ser cancelado.");
        return;
    }

    // Pede confirmação
    const confirmar = confirm(
        "Deseja realmente cancelar este pedido?"
    );

    if (!confirmar) {
        return;
    }

    // Impede devolver produtos mais de uma vez
    if (sessionStorage.getItem("estoqueDevolvido") !== "sim") {

        // Recupera os produtos realmente descontados
        const produtosDescontados = JSON.parse(
            sessionStorage.getItem("produtosDescontados") || "[]"
        );

        // Devolve os produtos ao estoque
        produtosDescontados.forEach(function(nome) {

            const chave = "estoque_" + nome;
            const quantidadeSalva = localStorage.getItem(chave);

            if (quantidadeSalva !== null) {

                const quantidade = Number(quantidadeSalva);
                const novaQuantidade = quantidade + 1;

                localStorage.setItem(chave, novaQuantidade);

                // Atualiza também os produtos cadastrados
                atualizarProdutoCadastrado(
                    nome,
                    novaQuantidade
                );
            }
        });

        // Registra que os produtos já foram devolvidos
        sessionStorage.setItem("estoqueDevolvido", "sim");
    }

    // Marca o pedido como cancelado
    sessionStorage.setItem("statusPedido", "Cancelado");

    // Atualiza o texto da página
    statusPedido.textContent = "Cancelado";

    // Desativa os controles
    verificarCancelamento();

    alert("Pedido cancelado com sucesso!");
});
