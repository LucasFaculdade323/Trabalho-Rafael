
 // Elementos da página
const listaEstoque = document.getElementById("listaEstoque");
const formulario = document.getElementById("formProduto");

const campoNome = document.getElementById("nomeProduto");
const campoPreco = document.getElementById("precoProduto");
const campoQuantidade = document.getElementById("quantidadeProduto");

const btnCadastrar = document.getElementById("btnCadastrar");
const btnCancelar = document.getElementById("btnCancelar");

// Produtos cadastrados pelo usuário
const produtosCadastrados = JSON.parse(
    localStorage.getItem("produtosCadastrados") || "[]"
);

// Produto que está sendo editado
let produtoEmEdicao = null;

// Salva a lista de produtos cadastrados
function salvarProdutos() {
    localStorage.setItem(
        "produtosCadastrados",
        JSON.stringify(produtosCadastrados)
    );
}

// Atualiza a quantidade no navegador
function atualizarQuantidade(nome, valor) {
    localStorage.setItem("estoque_" + nome, valor);

    const cadastrado = produtosCadastrados.find(function(produto) {
        return produto.nome === nome;
    });

    if (cadastrado) {
        cadastrado.quantidade = valor;
        salvarProdutos();
    }
}

// Volta o formulário ao modo de cadastro
function cancelarEdicao() {
    produtoEmEdicao = null;
    formulario.reset();
    btnCadastrar.textContent = "Cadastrar";

    if (btnCancelar) {
        btnCancelar.hidden = true;
    }
}

// Ativa os controles de cada produto
function configurarProduto(produto) {

    const titulo = produto.querySelector("h3");
    const quantidade = produto.querySelector(".quantidade");
    const status = produto.querySelector(".status");
    const diminuir = produto.querySelector(".diminuir");
    const aumentar = produto.querySelector(".aumentar");

    // Adiciona os botões Editar e Excluir
    const editar = document.createElement("button");
    editar.type = "button";
    editar.className = "editar";
    editar.textContent = "Editar";

    const excluir = document.createElement("button");
    excluir.type = "button";
    excluir.className = "excluir";
    excluir.textContent = "Excluir";

    produto.appendChild(editar);
    produto.appendChild(excluir);

    // Recupera a quantidade salva
    const quantidadeSalva = localStorage.getItem(
        "estoque_" + titulo.textContent
    );

    if (quantidadeSalva !== null) {
        quantidade.textContent = quantidadeSalva;
    }

    // Atualiza a quantidade e o status
    function atualizarEstoque(valor) {
        quantidade.textContent = valor;

        status.textContent = valor > 0
            ? "Status: Disponível"
            : "Status: Indisponível";

        atualizarQuantidade(titulo.textContent, valor);
    }

    atualizarEstoque(Number(quantidade.textContent));

    // Diminui a quantidade
    diminuir.addEventListener("click", function() {
        const valor = Number(quantidade.textContent);

        if (valor > 0) {
            atualizarEstoque(valor - 1);
        }
    });

    // Aumenta a quantidade
    aumentar.addEventListener("click", function() {
        const valor = Number(quantidade.textContent);
        atualizarEstoque(valor + 1);
    });

    // Edita um produto
    editar.addEventListener("click", function() {

        produtoEmEdicao = produto;

        // Preenche os campos com os dados do produto
        campoNome.value = titulo.textContent;
        campoQuantidade.value = quantidade.textContent;

        // Recupera o preço do produto
        const cadastrado = produtosCadastrados.find(function(item) {
            return item.nome === titulo.textContent;
        });

        if (cadastrado) {
            campoPreco.value = cadastrado.preco;
        } else {
            // Produtos originais ainda não possuem preço salvo
            campoPreco.value = "";
        }

        // Muda o formulário para edição
        btnCadastrar.textContent = "Salvar Alterações";

        if (btnCancelar) {
            btnCancelar.hidden = false;
        }

        // Leva a tela até o formulário
        formulario.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        // Seleciona o campo para editar
        campoNome.focus({
            preventScroll: true
        });
    });

    // Exclui um produto
    excluir.addEventListener("click", function() {

        const nome = titulo.textContent;

        if (!confirm("Deseja excluir o produto " + nome + "?")) {
            return;
        }

        // Remove da lista de produtos cadastrados
        const indice = produtosCadastrados.findIndex(function(item) {
            return item.nome === nome;
        });

        if (indice !== -1) {
            produtosCadastrados.splice(indice, 1);
            salvarProdutos();
        } else {
            // Registra a exclusão dos produtos originais
            const excluidos = JSON.parse(
                localStorage.getItem("produtosExcluidos") || "[]"
            );

            if (!excluidos.includes(nome)) {
                excluidos.push(nome);

                localStorage.setItem(
                    "produtosExcluidos",
                    JSON.stringify(excluidos)
                );
            }
        }

        localStorage.removeItem("estoque_" + nome);

        if (produtoEmEdicao === produto) {
            cancelarEdicao();
        }

        produto.remove();

        alert("Produto excluído com sucesso!");
    });
}

// Cria um produto na página
function criarProduto(nome, preco, quantidade) {

    const produto = document.createElement("div");
    produto.className = "produto";

    produto.innerHTML = `
        <h3></h3>
        <p class="preco"></p>
        <p>Quantidade: <span class="quantidade"></span></p>
        <p class="status"></p>

        <button type="button" class="diminuir">−</button>
        <button type="button" class="aumentar">+</button>
    `;

    produto.querySelector("h3").textContent = nome;

    produto.querySelector(".preco").textContent =
        "Preço: R$ " + preco.toFixed(2).replace(".", ",");

    produto.querySelector(".quantidade").textContent = quantidade;

    listaEstoque.appendChild(produto);

    configurarProduto(produto);

    return produto;
}

// Recupera os produtos excluídos
const produtosExcluidos = JSON.parse(
    localStorage.getItem("produtosExcluidos") || "[]"
);

// Ativa os produtos originais
document.querySelectorAll(".produto").forEach(function(produto) {

    const nome = produto.querySelector("h3").textContent;

    if (produtosExcluidos.includes(nome)) {
        produto.remove();
    } else {
        configurarProduto(produto);
    }
});

// Exibe os produtos cadastrados anteriormente
produtosCadastrados.forEach(function(produto) {
    criarProduto(
        produto.nome,
        Number(produto.preco),
        Number(produto.quantidade)
    );
});

// Cadastra ou salva alterações
formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    const nome = campoNome.value.trim();
    const preco = Number(campoPreco.value);
    const quantidade = Number(campoQuantidade.value);

    if (!nome || !Number.isFinite(preco) || preco <= 0 ||
        !Number.isInteger(quantidade) || quantidade < 0) {
        alert("Preencha os dados corretamente.");
        return;
    }

    // Verifica se já existe outro produto com o mesmo nome
    const repetido = Array.from(
        document.querySelectorAll(".produto")
    ).some(function(produto) {
        return produto !== produtoEmEdicao &&
            produto.querySelector("h3").textContent.toLowerCase() ===
            nome.toLowerCase();
    });

    if (repetido) {
        alert("Já existe outro produto com esse nome.");
        return;
    }

    if (produtoEmEdicao === null) {

        // Cadastra um novo produto
        const novoProduto = {
            nome: nome,
            preco: preco,
            quantidade: quantidade
        };

        produtosCadastrados.push(novoProduto);
        salvarProdutos();

        localStorage.setItem("estoque_" + nome, quantidade);

        criarProduto(nome, preco, quantidade);

        alert("Produto cadastrado com sucesso!");

    } else {

        // Atualiza o produto selecionado
        const nomeAntigo = produtoEmEdicao.querySelector("h3").textContent;

        const indice = produtosCadastrados.findIndex(function(item) {
            return item.nome === nomeAntigo;
        });

        const dadosAtualizados = {
            nome: nome,
            preco: preco,
            quantidade: quantidade
        };

        if (indice !== -1) {
            produtosCadastrados[indice] = dadosAtualizados;
        } else {
            // Produto original passa a ter dados editáveis
            produtosCadastrados.push(dadosAtualizados);

            const excluidos = JSON.parse(
                localStorage.getItem("produtosExcluidos") || "[]"
            );

            if (!excluidos.includes(nomeAntigo)) {
                excluidos.push(nomeAntigo);
            }

            localStorage.setItem(
                "produtosExcluidos",
                JSON.stringify(excluidos)
            );
        }

        // Evita duplicação dos produtos originais editados
        if (nomeAntigo !== nome) {
            localStorage.removeItem("estoque_" + nomeAntigo);
        }

        localStorage.setItem("estoque_" + nome, quantidade);

        salvarProdutos();

        produtoEmEdicao.remove();

        criarProduto(nome, preco, quantidade);

        alert("Produto atualizado com sucesso!");
    }

    cancelarEdicao();
});

// Cancela a edição, se o botão existir
if (btnCancelar) {
    btnCancelar.addEventListener("click", cancelarEdicao);
}
