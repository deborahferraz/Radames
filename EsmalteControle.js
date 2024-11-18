let listaEsmaltes = []; //conjunto de dados
let oQueEstaFazendo = ''; //variável global de controle
let esmalte = null; //variavel global 

window.onload = inserirDadosIniciais;

//metodo para mostrar mensagem quando o foco for para a chave primaria 
document.getElementById("inputId").addEventListener("focus", function () {
    mostrarAviso("Digite o Id e clic no botão procure");
});

//backend (não interage com o html)
function procurePorChavePrimaria(chave) {
    for (let i = 0; i < listaEsmaltes.length; i++) {
        const esmalte = listaEsmaltes[i];
        if (esmalte.Id == chave) {
            esmalte.posicaoNaLista = i; // se achou, guarda nesse atributo a posição na lista (índice)
            return listaEsmaltes[i];//se achou, interrompe o laço de repetição e devolve a linha inteira
        }
    }
    return null;//não achou
}

// Função para procurar um elemento pela chave primária   ---------------------------------------------------------
function procure() {
    const Id = document.getElementById("inputId").value;
    if (Id) { // se digitou uma Placa
        esmalte = procurePorChavePrimaria(Id);
        if (esmalte) { //achou na lista
            mostrarDadosEsmalte(esmalte);
            visibilidadeDosBotoes('inline', 'none', 
                'inline', 'inline', 'none'); // Habilita botões de alterar e excluir
            mostrarAviso("Achou na lista, pode alterar ou excluir");
        } else { //não achou na lista
            limparAtributos();
            visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
            mostrarAviso("Não achou na lista, pode inserir");
        }
    } else { // se deixou a Placa em branco e tentou procurar
        document.getElementById("inputId").focus();
        return;
    }
}

//backend->frontend
function inserir() {
    liberarEdicaoDaChaveOuAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clic o botão salvar");
    document.getElementById("inputId").focus();


}

// Função para alterar um elemento da lista
function alterar() {
    // Remove o readonly dos campos
    liberarEdicaoDaChaveOuAtributos(true);

    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');

    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos e clic o botão salvar");
}

// Função para excluir um elemento da lista
function excluir() {
    liberarEdicaoDaChaveOuAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)

    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - clic o botão salvar para confirmar a exclusão");
}

function salvar() {
    //gerencia operações inserir, alterar e excluir na lista
    const Id = document.getElementById("inputId").value;
    const marca = document.getElementById("inputMarca").value;

    let nome = document.getElementById("inputNome").value;
    let cor = document.getElementById("inputCor").value;
    let tipoDeEsmalte = document.getElementById("inputTipodeEsmalte").value;
    let dataValidade = document.getElementById("inputDataValidade").value;
    let quantasVezesUsado = document.getElementById("inputQuantasVezesUsado").value;

    //verificar se o que foi digitado pelo USUÁRIO está correto
    if (Id &&
        marca &&
        nome &&
        cor &&
        tipoDeEsmalte &&
        dataValidade &&
        quantasVezesUsado )
        

     { // se tudo certo 
        switch (oQueEstaFazendo) {
            case 'inserindo':
                esmalte = new Esmalte(Id, marca, nome, cor, tipoDeEsmalte, dataValidade, quantasVezesUsado);
                listaEsmaltes.push(esmalte);
                mostrarAviso("Inserido na lista");
                break;
            case 'alterando':
                esmalteAlterado = new Esmalte(Id, marca, nome, cor, tipoDeEsmalte, dataValidade, quantasVezesUsado);
                listaEsmaltes[esmalte.posicaoNaLista] = esmalteAlterado;
                mostrarAviso("Alterado");
                break;
            case 'excluindo':
                let novaLista = [];
                for (let i = 0; i < listaEsmaltes.length; i++) {
                    if (esmalte.posicaoNaLista != i) {
                        novaLista.push(listaEsmaltes[i]);
                    }
                }
                listaEsmaltes = novaLista;
                mostrarAviso("EXCLUIDO");
                break;
            default:
                // console.error('Ação não reconhecida: ' + oQueEstaFazendo);
                mostrarAviso("Erro aleatório");
        }
        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        listar();
        document.getElementById("inputId").focus();
    } else {
        alert("Erro nos dados digitados");
        return;
    }
}

//backend
function preparaListagem(vetor) {
    let texto = "";
    for (let i = 0; i < vetor.length; i++) {
        const linha = vetor[i];
        texto += linha.Id + " - " +
            linha.marca + " - " +
            linha.nome + " - " +
            linha.cor + " - " +
            linha.tipoDeEsmalte + " - " +
            linha.dataValidade + " - " +
            linha.quantasVezesUsado + "<br>";
    }
    return texto;
}

//backend->frontend (interage com html)
function listar() {
    document.getElementById("outputSaida").innerHTML = preparaListagem(listaEsmaltes);
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação de edição");
}

function mostrarAviso(mensagem) {
    //printa a mensagem na divAviso
    document.getElementById("divAviso").innerHTML = mensagem;
}

// Função para mostrar os dados do aluno nos campos
function mostrarDadosEsmalte(esmalte) {
    document.getElementById("inputMarca").value = esmalte.marca;
    document.getElementById("inputNome").value = esmalte.nome;
    document.getElementById("inputCor").value = esmalte.cor;
    document.getElementById("inputTipodeEsmalte").value = esmalte.tipoDeEsmalte;
    document.getElementById("inputDataValidade").value = esmalte.dataValidade;
    document.getElementById("inputQuantasVezesUsado").value = esmalte.quantasVezesUsado;


    // Define os campos como readonly
    liberarEdicaoDaChaveOuAtributos(false);
}

function liberarEdicaoDaChaveOuAtributos(soLeitura) {
    //quando chamado com true, tranca a chave e libera os outros atributos. False, faz o contrário..
    //quando a chave primaria possibilita edicao, tranca (readonly) os outros e vice-versa
    document.getElementById("inputId").readOnly = soLeitura;
    document.getElementById("inputMarca").readOnly = !soLeitura;
    document.getElementById("inputNome").readOnly = !soLeitura;
    document.getElementById("inputCor").readOnly = !soLeitura;
    document.getElementById("inputTipodeEsmalte").readOnly = !soLeitura;
    document.getElementById("inputDataValidade").readOnly = !soLeitura;
    document.getElementById("inputQuantasVezesUsado").readOnly = !soLeitura;


}

// Função para limpar os dados
function limparAtributos() {
    document.getElementById("inputMarca").value = "";
    document.getElementById("inputNome").value = "";
    document.getElementById("inputCor").value = "";
    document.getElementById("inputTipodeEsmalte").value = "";
    document.getElementById("inputDataValidade").value = "";
    document.getElementById("inputQuantasVezesUsado").value = "";



    bloquearAtributos(true);
}

function bloquearAtributos(valor) {
    //quando recebe valor == true no parâmetro, libera a chave e bloqueia a edição dos outros atributos. Se receber false, faz o contrário.
    document.getElementById("inputId").readOnly = !valor; // sempre ao contrário dos outros atributos
    document.getElementById("inputMarca").readOnly = valor;
    document.getElementById("inputNome").readOnly = valor;
    document.getElementById("inputCor").readOnly = valor;
    document.getElementById("inputTipodeEsmalte").readOnly = valor;
    document.getElementById("inputDataValidade").readOnly = valor;
    document.getElementById("inputQuantasVezesUsado").readOnly = valor;


}

// Função para deixar visível ou invisível os botões
function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    //  visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); 
    //none significa que o botão ficará invisível (visibilidade == none)
    //inline significa que o botão ficará visível 

    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar; // o cancelar sempre aparece junto com o salvar
    document.getElementById("inputId").focus();
}

//backend
function inserirDadosIniciais() {
    //esta função é para não ter que ficar digitando dados a cada vez que 
    //recarrega a página. Facilita os testes. 

    listaEsmaltes = [];//se houver dados na lista, apaga todos
    let esmalte = new Esmalte('1', 'Risque', "Maça do Amor", "Vermelho Escuro", "Metálico", "11-12-2027", 9);
    listaEsmaltes.push(esmalte);
    listar();
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    bloquearAtributos(true);
}
const crudEsmalte = [
    { id: 1, marca: 'Risque', nome: 'Maça do Amor', cor: 'Vermelho Escuro', tipoDeEsmalte: 'Metálico',
        dataValidade: '11-12-2027', quantasVezesUsado: '9' },
   
];

// Função para buscar linhas que contenham a palavra específica
function buscarLinhaPorPalavra(palavra) {
    const resultados = crudEsmalte.filter(item =>
        Object.values(item).some(valor =>
            typeof valor === 'string' && valor.toLowerCase().includes(palavra.toLowerCase())
        )
    );

    if (resultados.length > 0) {
        console.log('Resultados encontrados:', resultados);
        alert('Resultados encontrados: ' + JSON.stringify(resultados, null, 2));
    } else {
        console.log('Nenhuma linha encontrada com a palavra especificada.');
        alert('Nenhuma linha encontrada com a palavra especificada.');
    }
}

// Função chamada ao clicar no botão
function executarBusca() {
    const palavra = document.getElementById('input-palavra').value;
    buscarLinhaPorPalavra(palavra);
}
