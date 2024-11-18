let listaBicicleta = []; //conjunto de dados
let oQueEstaFazendo = ''; //variável global de controle
let bicicleta = null; //variavel global 
bloquearAtributos(true);
//backend (não interage com o html)
function dadosIniciais() {
    listaBicicleta.push(new Bicicleta('0', 'Colli Athenas', 'Deborah', '11-05-1978', '2.500', '8'));
    

    listar();
}


function salvarNoComputador() {
    nomeParaSalvar = "./Bicicleta.csv";
    let textoCSV = "";
    for (let i = 0; i < listaBicicleta.length; i++) {
        const linha = listaBicicleta[i];
        textoCSV += linha.id + ";" +
            linha.nome + ";" +
            linha.fabricante + ";" +
            linha.dataDeLancamento + ";" +
            linha.preco + ";" +
            linha.peso + "\n";
    }

    salvarEmArquivo(nomeParaSalvar, textoCSV);
}


function salvarEmArquivo(nomeArq, conteudo) {
    // Cria um blob com o conteúdo em formato de texto
    const blob = new Blob([conteudo], { type: 'text/plain' });
    // Cria um link temporário para o download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nomeArq; // Nome do arquivo de download
    // Simula o clique no link para iniciar o download
    link.click();
    // Libera o objeto URL
    URL.revokeObjectURL(link.href);
}


// Função para abrir o seletor de arquivos para upload
function buscarDadosSalvosNoComputador() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv'; // Aceita apenas arquivos CSV
    input.onchange = function (event) {
        const arquivo = event.target.files[0];
        console.log(arquivo.name);
        if (arquivo) {
            processarArquivo(arquivo);
        }
    };
    input.click(); // Simula o clique para abrir o seletor de arquivos

}

// Função para processar o arquivo CSV e transferir os dados para a listaMusica
function processarArquivo(arquivo) {
    const leitor = new FileReader();
    leitor.onload = function (e) {
        const conteudo = e.target.result; // Conteúdo do arquivo CSV
        const linhas = conteudo.split('\n'); // Separa o conteúdo por linha
        listaBicicleta = []; // Limpa a lista atual (se necessário)
        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i].trim();
            if (linha) {
                const dados = linha.split(';'); // Separa os dados por ';'
                if (dados.length === 6) {
                    // Adiciona os dados à listaMusica como um objeto
                    listaBicicleta.push({
                        id: dados[0],
                        nome: dados[1],
                        fabricante: dados[2],
                        dataDeLancamento: dados[3],
                        preco: dados[4],
                        peso: dados[5]
                    });
                }
            }
        }
        // console.log("Upload concluído!", listaBicicleta); // Exibe no console a lista atualizada
        listar();
    };
    leitor.readAsText(arquivo); // Lê o arquivo como texto
}

function procurePorChavePrimaria(chave) {
    for (let i = 0; i < listaBicicleta.length; i++) {
        const bicicleta = listaBicicleta[i];
        if (bicicleta.id == chave) {
            bicicleta.posicaoNaLista = i;
            return listaBicicleta[i];
        }
    }
    return null;//não achou
}

// Função para procurar um elemento pela chave primária   -------------------------------------------------------------
function procure() {
    const id = document.getElementById("inputId").value;
    if (id) { // 
        bicicleta = procurePorChavePrimaria(id);
        if (bicicleta) { //achou na lista
            mostrarDadosBicicleta(bicicleta);
            visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none'); // Habilita botões de alterar e excluir
            mostrarAviso("Achou na lista, pode alterar ou excluir");
        } else { //não achou na lista
            limparAtributos();
            visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
            mostrarAviso("Não achou na lista, pode inserir");
        }
    } else {
        document.getElementById("inputId").focus();
        return;
    }
}

//backend->frontend
function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clic o botão salvar");
    document.getElementById("inputId").focus();

}

// Função para alterar um elemento da lista
function alterar() {

    // Remove o readonly dos campos
    bloquearAtributos(false);

    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');

    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos e clic o botão salvar");
}

// Função para excluir um elemento da lista
function excluir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)

    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - clic o botão salvar para confirmar a exclusão");
}

function salvar() {
    //gerencia operações inserir, alterar e excluir na lista

    // obter os dados a partir do html

    let id;
    if (bicicleta == null) {
        id = document.getElementById("inputId").value;
    } else {
        id = bicicleta.id;
    }

    const nome = document.getElementById("inputNome").value;
    const fabricante = document.getElementById("inputFabricante").value;
    const dataDeLancamento = parseInt(document.getElementById("inputDataDeLancamento").value);
    const preco = document.getElementById("inputPreco").value;
    const peso = document.getElementById("inputPeso").value;

    if (dataDeLancamento<0) {
        mostrarAviso("O peso não pode ser menor que zero");
        return;
    }

    //verificar se o que foi digitado pelo USUÁRIO está correto
    if (id && nome && fabricante && dataDeLancamento && preco && peso) {// se tudo certo 
        switch (oQueEstaFazendo) {
            case 'inserindo':
                bicicleta = new Bicicleta(id, nome, fabricante, dataDeLancamento, preco, peso);
                listaBicicleta.push(bicicleta);
                mostrarAviso("Inserido na lista");
                break;
            case 'alterando':
                bicicletaAlterado = new Bicicleta(id, nome, fabricante, dataDeLancamento, preco, peso);
                listaBicicleta[bicicleta.posicaoNaLista] = bicicletaAlterado;
                mostrarAviso("Alterado");
                break;
            case 'excluindo':
                let novaLista = [];
                for (let i = 0; i < listaBicicleta.length; i++) {
                    if (bicicleta.posicaoNaLista != i) {
                        novaLista.push(listaBicicleta[i]);
                    }
                }
                listaBicicleta = novaLista;
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
        texto +=
            linha.id + " - " +
            linha.nome + " - " +
            linha.fabricante + " - " +
            linha.dataDeLancamento + " - " +
            linha.preco + " - " +
            linha.peso + "<br>";
    }
    return texto;
}

//backend->frontend (interage com html)
function listar() {
    document.getElementById("outputSaida").innerHTML = preparaListagem(listaBicicleta);
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

// Função para mostrar os dados do Carro nos campos
function mostrarDadosBicicleta(bicicleta) {
    document.getElementById("inputId").value = bicicleta.id;
    document.getElementById("inputNome").value = bicicleta.nome;
    document.getElementById("inputFabricante").value = bicicleta.fabricante;
    document.getElementById("inputDataDeLancamento").value = bicicleta.dataDeLancamento;
    document.getElementById("inputPreco").value = bicicleta.preco;
    document.getElementById("inputPeso").value = bicicleta.peso;

    // Define os campos como readonly
    bloquearAtributos(true);
}

// Função para limpar os dados dos campos
function limparAtributos() {
    document.getElementById("inputNome").value = "";
    document.getElementById("inputFabricante").value = "";
    document.getElementById("inputDataDeLancamento").value = "";
    document.getElementById("inputPreco").value = "";
    document.getElementById("inputPeso").value = "";

    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    //quando a chave primaria possibilita edicao, tranca (readonly) os outros e vice-versa
    document.getElementById("inputId").readOnly = !soLeitura;
    document.getElementById("inputNome").readOnly = soLeitura;
    document.getElementById("inputFabricante").readOnly = soLeitura;
    document.getElementById("inputDataDeLancamento").readOnly = soLeitura;
    document.getElementById("inputPreco").readOnly = soLeitura;
    document.getElementById("inputPeso").readOnly = soLeitura;
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
function menorPeso(bicicleta){
    let c = document.getElementById("inputMenor").value;
    
    let menor = listaBicicleta[0].peso;
    for(let i = 0; i < listaBicicleta.length; i++) {
        if (listaBicicleta[i].peso<menor){
            menor = listaBicicleta[i].peso;
        }
    }


    let novaListaBicicleta=[];
    for(let j = 0; j<listaBicicleta.length; j++){
 if (listaBicicleta[i].peso==menor){
           novaListaBicicleta.push(listaBicicleta[i]);
        }

    }
    document.getElementById("outputSaida").innerHTML = preparaListagem(listaBicicleta);
}


