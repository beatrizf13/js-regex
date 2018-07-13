const executa =  event => {

	event.preventDefault();

	limparResultados();
	let valores 	 = pegaValoresDoForm();

    let resultados 	 = executaRegex(valores);

    imprimeResultadoNoInput(resultados);
    highlightResultados(resultados, valores.target);
}


const executaRegex = valores => {

	let textoPattern = valores.pattern; //montaPatternDeDataMaisLegivel();
	let textoTarget  = valores.target;
	let mostraIndex  = valores.mostraIndex;
	let mostraGrupos = valores.mostraGrupos;

	let resultados	 = [];
    let resultado 	 = null;


	let objetoRegex  = new RegExp(textoPattern, 'g');

	while (resultado = objetoRegex.exec(textoTarget)) {

		if(resultado[0] === "") {
			throw Error("Regex retornou valor vazio.");
		}

		console.log("Resultado: " + resultado[0]);

		resultados.push(geraResultado(mostraGrupos ? resultado.join(' ||| ') : resultado[0], resultado.index, objetoRegex.lastIndex, mostraIndex));
	}


	logaTempoDeExecucao(textoPattern, textoTarget);

	return resultados;
}


const geraResultado = (resultado, index, lastIndex, mostraIndex) => {

	let textoIndex = mostraIndex ? " [" + index + "-" + lastIndex+ "]" : ""

	return {
		'resultado': resultado + textoIndex,
		'index': index,
		'lastIndex': lastIndex
	};
}


const logaTempoDeExecucao = (textoPattern, textoTarget) => {
	let pObjetoRegex  = new RegExp(textoPattern, 'g');
    let ini = performance.now();
    pObjetoRegex.test(textoTarget)
	let fim =  performance.now();
	console.log("Tempo de execução (ms) " + (fim-ini));
}

const imprimeResultadoNoInput = resultados => {
	let inputResultado 	= document.querySelector('#resultado');
	let labelResultado 	= document.querySelector('#labelResultados');

    labelResultado.innerHTML = (resultados.length) + " Matches (resultados)";

	let resultadosComoArray = resultados.map(function(item){
		return item.resultado;
	});

	labelResultado.innerHTML = (resultadosComoArray.length) + " Matches (resultados)";

    if(resultadosComoArray.length > 0) {
    	inputResultado.value = resultadosComoArray.join(' | ');
    	inputResultado.style.borderStyle = 'solid';
    	inputResultado.style.borderColor = 'lime';//verde
    } else {
    	inputResultado.placeholder = 'Sem matches (resultados)';
    	inputResultado.value = '';
    	inputResultado.style.borderStyle = 'solid';
    	inputResultado.style.borderColor = 'red';
    }
}


const highlightResultados = (resultados, texto) => {
	let item = null;
	let indexBegin = 0;
	let conteudo = "";

	while((item = resultados.shift()) != null) {
		conteudo += semHighlight(escapeHtml(texto.substring(indexBegin, item.index)));
		conteudo += comHighlight(escapeHtml(texto.substring(item.index, item.lastIndex)));
		indexBegin = item.lastIndex;
	}

	//sobrou algum texto?
	if((texto.length - indexBegin) > 0) {
		conteudo += semHighlight(escapeHtml(texto.substring(indexBegin, texto.length)));
	}

	document.querySelector("#highlightText").innerHTML = conteudo;
}

const semHighlight = texto => texto;

const comHighlight = texto => "<span class='bg-primary'>" + texto + "</span>";

const escapeHtml =  string  => string.replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');


const pegaValoresDoForm = () => {

	let inputTarget 	= document.querySelector('#target');
	let inputPattern 	= document.querySelector('#pattern')
	inputPattern.focus();

	let checkboxIndex 	= document.querySelector('#mostraIndex');
	let checkboxGroups 	= document.querySelector('#mostraGrupos');

  	_verifiqueInputs(inputTarget, inputPattern);

  	console.log('Target:  ' + inputTarget.value);
  	console.log('Pattern: ' + inputPattern.value.trim());

  	return {'target': inputTarget.value.trim(),
  			'pattern': inputPattern.value,
  			'mostraIndex': checkboxIndex.checked,
  			'mostraGrupos' : checkboxGroups.checked};
}

const _verifiqueInputs = (inputTarget, inputPattern) => {
	if(!inputTarget.value) {
		inputTarget.placeholder = 'Digite um target';
	}

	if(!inputPattern.value) {
		inputPattern.placeholder = 'Digite um pattern';
	}

	if(!inputTarget.value || !inputPattern.value) {
		throw Error('Valores invalidos');
	}
}

const limparResultados = () => {
	console.clear();
	document.querySelector('#labelResultados').innerHTML = '0 Matches (resultados)';
	document.querySelector('#resultado').value = '';
	document.querySelector('#resultado').placeholder = 'sem resultado';
	document.querySelector("#highlightText").innerHTML = '<em>sem resultado</em>';
}

const montaPatternDeDataMaisLegivel = () => {
	let DIA  = "[0123]?\\d";
	let _DE_ = "\\s+(de )?\\s*";
	let MES  = "[A-Za-z][a-zç]{3,8}";
	let ANO  = "[12]\\d{3}";
	return DIA + _DE_ +  MES + _DE_ + ANO;
}
