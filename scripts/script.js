var arrayVerbs;
var arrayTimes;
var arraySimplePerfect;
var arrayProgressive;
var arrayNouns;
var arrayKinds;
var arrayGrammarStructures;

var currentVerbIndex;
var currentNounIndex;
var lastIndexCommonNouns = 7;
var lastIndexCommonVerbs = 2;

var currentGrammarStructureIndex;

var switchVal = 1;

//////////////////
// READ SECTION //
//////////////////

readSrc('assets/data/verbs.txt', successFunctionV);
readSrc('assets/data/times.txt', successFunctionT);
readSrc('assets/data/simplePerfect.txt', successFunctionSP);
readSrc('assets/data/progressive.txt', successFunctionP);
readSrc('assets/data/nouns.txt', successFunctionS);
readSrc('assets/data/kinds.txt', successFunctionK);
readSrc('assets/data/grammarStructures.txt', successFunctionG);

function readSrc(src, successFunction){
	$.ajax({
		url: src,
		dataType: 'text',
	}).done(successFunction);
}

function successFunctionV(data) {
	var allRows = data.split(/\r?\n|\r/);
	arrayVerbs = allRows;
	for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
		var rowCells = allRows[singleRow].split(';');
		for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
			//console.log(rowCells[rowCell]);
		}
    }
}

function successFunctionT(data) {
	var allRows = data.split(/\r?\n|\r/);
	arrayTimes = allRows;
}

function successFunctionSP(data) {
	var allRows = data.split(/\r?\n|\r/);
	arraySimplePerfect = allRows;
}

function successFunctionP(data) {
	var allRows = data.split(/\r?\n|\r/);
	arrayProgressive = allRows;
}

function successFunctionS(data) {
	var allRows = data.split(/\r?\n|\r/);
	arrayNouns = allRows;
}

function successFunctionK(data) {
	var allRows = data.split(/\r?\n|\r/);
	arrayKinds = allRows;
}

function successFunctionG(data) {
	var allRows = data.split(/\r?\n|\r/);
	arrayGrammarStructures = allRows;
}




/////////////////////
// ACTIONS SECTION //
/////////////////////


function change(category){
	if(category=='v'){//Verbs
	
		//Da mitad de probabilidad de escoger un sustantivo comun o uno no comun
		let isCommonVerb = Math.floor((Math.random() * 2));
		let indexRandom = 0;
		if(isCommonVerb){//Es comun
			indexRandom = Math.floor((Math.random() * lastIndexCommonVerbs));
		}else{
			indexRandom = Math.floor((Math.random() * (arrayVerbs.length - lastIndexCommonVerbs + 1)) + lastIndexCommonVerbs);
		}
		currentVerbIndex = indexRandom;
		document.getElementById("vw").innerHTML = arrayVerbs[indexRandom].split(';')[0];
	}
	if(category=='t'){//Times
		let indexRandom = Math.floor((Math.random() * arrayTimes.length));
		document.getElementById("tw").innerHTML = arrayTimes[indexRandom].split(';')[0];
	}
	if(category=='sp'){//Simple or Perfect
		let indexRandom = Math.floor((Math.random() * arraySimplePerfect.length));
		document.getElementById("spw").innerHTML = arraySimplePerfect[indexRandom].split(';')[0];
	}
	if(category=='p'){//Progressive
		let indexRandom = Math.floor((Math.random() * arrayProgressive.length));
		document.getElementById("pw").innerHTML = arrayProgressive[indexRandom].split(';')[0];
	}
	if(category=='s'){//Nouns
		
		//Da mitad de probabilidad de escoger un sustantivo comun o uno no comun
		let isCommonNoun = Math.floor((Math.random() * 2));
		let indexRandom = 0;
		if(isCommonNoun==1){//Es comun
			indexRandom = Math.floor((Math.random() * lastIndexCommonNouns));
		}else{//No es comun
			indexRandom = Math.floor((Math.random() * (arrayNouns.length - lastIndexCommonNouns + 1)) + lastIndexCommonNouns);
		}
		currentNounIndex = indexRandom;
		document.getElementById("sw").innerHTML = arrayNouns[indexRandom].split(';')[0];
		
	}
	if(category=='k'){//Kinds (+ - ?)
		let indexRandom = Math.floor((Math.random() * arrayKinds.length));
		document.getElementById("kw").innerHTML = arrayKinds[indexRandom].split(';')[0];
	}
	
	if(category=='all'){
		change('v');
		change('t');
		change('sp');
		change('p');
		change('s');
		change('k');
	}
	
	
	if(document.getElementById("vw").innerHTML=='be'
		&& document.getElementById("pw").innerHTML=='yes'){
		change('p');
	}
	
	updateGrammar();
}

function updateGrammar(){
	
	
	
	//armar solicitud
	let t = document.getElementById("tw").innerHTML;
	let spw = document.getElementById("spw").innerHTML;
	let pw = document.getElementById("pw").innerHTML;
	let kw = document.getElementById("kw").innerHTML;
	let s = document.getElementById("sw").innerHTML;
	let v = document.getElementById("vw").innerHTML;
	let structure = "";
	if(pw=='yes'){
		pw = 'progressive';
		structure = t+'_'+spw+'_'+pw+'_'+kw;
	}else{
		pw = '';
		structure = t+'_'+spw+'_'+kw;
	}
	
	if(v=='be'){
		structure += '_be';
	}
	
	//buscar la estructura solicitada
	let found = false;
	for (var singleRow = 0; singleRow < arrayGrammarStructures.length; singleRow++) {
		var rowCells = arrayGrammarStructures[singleRow].split('=');
		if(rowCells[0]==structure){
			currentGrammarStructureIndex = singleRow;
			found = true;
		}else{
			
		}
    }
	//console.log("structure.substring(structure.length-3, structure.length): " + structure.substring(structure.length-3, structure.length));
	if(found==false && structure.substring(structure.length-3, structure.length)=='_be'){
		structure = structure.substring(0, structure.length-3);
		
		for (var singleRow = 0; singleRow < arrayGrammarStructures.length; singleRow++) {
			var rowCells = arrayGrammarStructures[singleRow].split('=');
			if(rowCells[0]==structure){
				currentGrammarStructureIndex = singleRow;
				found = true;
			}else{
				
			}
		}
	}
	
	
	if(found==true){
		let structureVal = arrayGrammarStructures[currentGrammarStructureIndex].split('=')[1];
	
		let resGrammar = structureVal.replace('noun', s);
		resGrammar = resGrammar.replace('verb(participle)', getParticipleW()+"(participle)");
		resGrammar = resGrammar.replace('verb(past -> regular/irregular)', getPastW()+"(past)");
		resGrammar = resGrammar.replace('verb', getCurrentVerb());
		
		document.getElementById("ge").innerHTML = structure;
		document.getElementById("gg").innerHTML = resGrammar;
		
		
	}
	
	
}


function viewPastW(){
	let rowVerb = arrayVerbs[currentVerbIndex].split(';');
	document.getElementById("vw").innerHTML = rowVerb[0] + " -> " + rowVerb[1];
}

function getPastW(){
	let rowVerb = arrayVerbs[currentVerbIndex].split(';');
	return rowVerb[1];
}


function getCurrentVerb(){
	let rowVerb = arrayVerbs[currentVerbIndex].split(';');
	return rowVerb[0];
}

function viewParticipleW(){
	let rowVerb = arrayVerbs[currentVerbIndex].split(';');
	document.getElementById("vw").innerHTML = rowVerb[0] + " -> " + rowVerb[2];
}

function getParticipleW(){
	let rowVerb = arrayVerbs[currentVerbIndex].split(';');
	return rowVerb[2];
}


function translateW(){
	let rowVerb = arrayVerbs[currentVerbIndex].split(';');
	document.getElementById("vw").innerHTML = rowVerb[0] + " -> " + rowVerb[3];
}



function translateS(){
	let rowNoun = arrayNouns[currentNounIndex].split(';');
	document.getElementById("sw").innerHTML = rowNoun[0] + " -> " + rowNoun[1];
}


function showHideRes(switchVal_in){
	switchVal = switchVal*switchVal_in;
	if(switchVal==-1){
		document.getElementById("res").style = "display:block";
	}else{
		document.getElementById("res").style = "display:none";
	}
	
}

function hideRes(){
	document.getElementById("res").style = "display:none";
}
