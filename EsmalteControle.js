let listaEsmaltes = []; //conjunto de dados
let oQueEstaFazendo = ''; //variável global de controle
let esmalte = null; //variavel global 

window.onload = inserirDadosIniciais;

//metodo para mostrar mensagem quando o foco for para a chave primaria 
document.getElementById("inputId").addEventListener("focus", function () {
    mostrarAviso("Digite o Id e clic no botão procure");
});

function dadosIniciais() { //dados iniciais da lista
    listaEsmaltes.push(new Esmalte('0', 'Risque', 'Maça do amor', 'Vermelho', 'Metálico', '11-12-2027', '9'));
    
    listar();
}


function prepararESalvarCSV() { //gera um arquivo csv com as informações de listaEsmaltes vai enviar da memória RAM para dispositivo de armazenamento permanente.
   let nomeDoArquivoDestino = "./Esmalte.csv";  //define o nome do arquivo csv
    let textoCSV = "";
    for (let i = 0; i < listaEsmaltes.length; i++) {
        const linha = listaEsmaltes[i]; //variavel linha contem as informações de cada musica
        textoCSV += linha.Id + ";" + //concatena os dados das musicas formatados para linha csv (separada por ;)
            linha.marca + ";" +
            linha.nome + ";" +
            linha.cor + ";" +
            linha.tipoDeEsmalte + ";" +
            linha.dataValidade + ";" +
            linha.quantasVezesUsado + "\n";
    }
    persistirEmLocalPermanente(nomeDoArquivoDestino, textoCSV);
}


function persistirEmLocalPermanente(nomeArq, conteudo) {
    /*cria um blob (objeto que representa dados de arquivo) que armazena "[conteudo]" como arquivo de texto,
    criando um arquivo temporário*/
    const blob = new Blob([conteudo], { type: 'text/plain' });
    //cria o elemento "a" (link temporário) usado para adicionar o dowload do arquivo
    const link = document.createElement('a'); /*cria uma URL temporária que aponta para o blob e
    atribui ela ao href do link para que ele "aponte" para o arquivo gerado (permitindo seu download)*/
    link.href = URL.createObjectURL(blob);
    link.download = nomeArq; // Nome do arquivo de download
    link.click(); //inicia o processo de dowload automaticamente
    // Libera o objeto URL
    URL.revokeObjectURL(link.href); //remove a URL temporária que foi criada (liberando a memória)
}


// Função para abrir o seletor de arquivos para upload (para processar o arquivo selecionado)
function abrirArquivoSalvoEmLocalPermanente() {
    
    const input = document.createElement('input');
    //cria o elemento input do tipo file (serve para abrir o seletor de arquivos)
    input.type = 'file';
    input.accept = '.csv'; // Aceita apenas arquivos CSV do sistema local
    input.onchange = function (event) {
        /*associa uma função de evento ao onchange, que será chamada quando o usuário selecionar um arquivo
        O evento change é disparado quando um arquivo é selecionado*/
        const arquivo = event.target.files[0]; //acessa o arquivo selecionado e armazena na variavel arquivo
        console.log(arquivo.name);
        if (arquivo) {
            converterDeCSVparaListaObjeto(arquivo);
        }
        /*verifica se um arquivo foi selecionado: 
        se sim, chama a função processarArquivo e passa o arquivo selecionado como argumento
        permitindo que o arquivo seja lido e processado na função processarArquivo*/
    };
    input.click(); //seletor de arquivos exibido automaticamente    
}


// Função para processar o arquivo CSV e transferir os dados para a listaEsmaltes
function converterDeCSVparaListaObjeto(arquivo) {
    const leitor = new FileReader();  //objeto que permite ler arquivos locais no navegador 
    leitor.onload = function (e) {
        const conteudo = e.target.result; // Conteúdo do arquivo CSV
        const linhas = conteudo.split('\n'); // Separa o conteúdo por linha
        listaEsmaltes = []; // Limpa a lista atual (se necessário)
        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i].trim();  //linhas[i] representa cada linha do arquivo CSV
            if (linha) { //verifica se a linha não está vazia
                const dados = linha.split(';'); // Separa os dados por ';'
                if (dados.length === 7) { //verifica os seis campos
                    // Adiciona os dados à listaEsmaltes como um objeto
                    listaEsmaltes.push({
                        Id: dados[0],
                        marca: dados[1],
                        nome: dados[2],
                        cor: dados[3],
                        tipoDeEsmalte: dados[4],
                        dataValidade: dados[5],
                        quantasVezesUsado: dados[6]
                
                    });
                }
            }
        }
        listar(); //exibe a lista atualizada
    };
    leitor.readAsText(arquivo); // Lê o arquivo como texto
}




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
    { id: 0, marca: 'Risque', nome: 'Maça do Amor', cor: 'Vermelho Escuro', tipoDeEsmalte: 'Metálico',
        dataValidade: '11-12-2027', quantasVezesUsado: '9' },
   
];

