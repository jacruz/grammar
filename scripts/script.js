var arrayVerbs;
var arrayTimes;
var arraySimplePerfect;
var arrayContinuous;
var arrayNouns;
var arrayKinds;
var arrayGrammarStructures;

var isLockedSP=false;
var isLockedT=false;
var isLockedC=false;
var isLockedK=false;
var isLockedS=false;
var isLockedV=false;

var currentVerbIndex;
var currentNounIndex;
var LAST_INDEX_COMMON_NOUNS = 7;
var LAST_INDEX_COMMON_VERBS = 2;

var currentGrammarStructureIndex;

var switchValEye = 1;//Default

//////////////////
// READ SECTION //
//////////////////

readSrc('assets/data/verbs.txt', successFunctionV);
readSrc('assets/data/times.txt', successFunctionT);
readSrc('assets/data/simplePerfect.txt', successFunctionSP);
readSrc('assets/data/continuous.txt', successFunctionC);
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

function successFunctionC(data) {
	var allRows = data.split(/\r?\n|\r/);
	arrayContinuous = allRows;
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
	if(category=='v' && !isLockedV){//Verbs
	
		//Da mitad de probabilidad de escoger un sustantivo comun o uno no comun
		let isCommonVerb = Math.floor((Math.random() * 2));
		let indexRandom = 0;
		if(isCommonVerb){//Es comun
			indexRandom = Math.floor((Math.random() * LAST_INDEX_COMMON_VERBS));
		}else{
			indexRandom = Math.floor((Math.random() * (arrayVerbs.length - LAST_INDEX_COMMON_VERBS + 1)) + LAST_INDEX_COMMON_VERBS);
		}
		currentVerbIndex = indexRandom;
		document.getElementById("vw").innerHTML = arrayVerbs[indexRandom].split(';')[0];
	}
	if(category=='t' && !isLockedT){//Times
		let indexRandom = Math.floor((Math.random() * arrayTimes.length));
		document.getElementById("tw").innerHTML = arrayTimes[indexRandom].split(';')[0];
	}
	if(category=='sp' && !isLockedSP){//Simple or Perfect
		let indexRandom = Math.floor((Math.random() * arraySimplePerfect.length));
		document.getElementById("spw").innerHTML = arraySimplePerfect[indexRandom].split(';')[0];
	}
	if(category=='c' && !isLockedC){//Continuous
		let indexRandom = Math.floor((Math.random() * arrayContinuous.length));
		document.getElementById("pw").innerHTML = arrayContinuous[indexRandom].split(';')[0];
	}
	if(category=='s' && !isLockedS){//Nouns
		
		//Da mitad de probabilidad de escoger un sustantivo comun o uno no comun
		let isCommonNoun = Math.floor((Math.random() * 2));
		let indexRandom = 0;
		if(isCommonNoun==1){//Es comun
			indexRandom = Math.floor((Math.random() * LAST_INDEX_COMMON_NOUNS));
		}else{//No es comun
			indexRandom = Math.floor((Math.random() * (arrayNouns.length - LAST_INDEX_COMMON_NOUNS + 1)) + LAST_INDEX_COMMON_NOUNS);
		}
		currentNounIndex = indexRandom;
		document.getElementById("sw").innerHTML = arrayNouns[indexRandom].split(';')[0];
		
	}
	if(category=='k' && !isLockedK){//Kinds (+ - ?)
		let indexRandom = Math.floor((Math.random() * arrayKinds.length));
		document.getElementById("kw").innerHTML = arrayKinds[indexRandom].split(';')[0];
	}
	
	if(category=='all'){
		change('v');
		change('t');
		change('sp');
		change('c');
		change('s');
		change('k');

		showHideRes(1);
	}
	
	/* Si es to be y continuous entonces cambiar para que sea no <- Pero debería poderse
	if(document.getElementById("vw").innerHTML=='be'
		&& document.getElementById("pw").innerHTML=='yes'){
		change('p');
	}*/
	
	updateGrammar();
}

function lock(category,val){
	if(category=='v'){//Verbs
		isLockedV=val;
	}
	if(category=='t'){//Times
		isLockedT=val;
	}
	if(category=='sp'){//Simple or Perfect
		isLockedSP=val;
	}
	if(category=='c'){//Continuous
		isLockedC=val;
	}
	if(category=='s'){//Nouns
		isLockedS=val;
	}
	if(category=='k'){//Kinds (+ - ?)
		isLockedK=val;
	}

	if(val==true){
		document.getElementById("btn-lock-close-"+category).style = "display:inline-block";
		document.getElementById("btn-lock-open-"+category).style = "display:none";
	}else{
		document.getElementById("btn-lock-close-"+category).style = "display:none";
		document.getElementById("btn-lock-open-"+category).style = "display:inline-block";
	}
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
		pw = 'continuous';
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
	
		let resGrammar = structureVal.replace('noun', '<span class="highlight-nv">'+s+'</span>');
		resGrammar = resGrammar.replace('verb(participle)', '<span class="highlight-nv">'+getParticipleW()+"(participle)"+'</span>');
		resGrammar = resGrammar.replace('verb(past -> regular/irregular)', '<span class="highlight-nv">'+getPastW()+"(past)"+'</span>');
		resGrammar = resGrammar.replace('verb', '<span class="highlight-nv">'+getCurrentVerb()+'</span>');
		
		resGrammar = resGrammar.replace('aux[do|does]','<span class="highlight-aux">[do/does]</span>');
		resGrammar = resGrammar.replace('aux[have|has]','<span class="highlight-aux">[have|has]</span>');
		resGrammar = resGrammar.replace('aux(did)','<span class="highlight-aux">did</span>');
		resGrammar = resGrammar.replace('aux(had)','<span class="highlight-aux">had</span>');
		resGrammar = resGrammar.replace('aux(will)','<span class="highlight-aux">will</span>');
		resGrammar = resGrammar.replace('aux(have)','<span class="highlight-aux">have</span>');

		resGrammar = resGrammar.split("+").join(" ");
		
		document.getElementById("ge").innerHTML = formatGrammarStructure();
		document.getElementById("ge_nv").innerHTML = formatGrammarStructureSV();
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


function showHideRes(switchValEye_in){
	switchValEye = switchValEye*switchValEye_in;
	if(switchValEye==-1 || switchValEye==0){
		document.getElementById("res").style = "display:block";
		document.getElementById("btn-eye-slash").style = "display:none";
		document.getElementById("btn-eye-open").style = "display:block";
	}else{
		document.getElementById("res").style = "display:none";
		document.getElementById("btn-eye-slash").style = "display:block";
		document.getElementById("btn-eye-open").style = "display:none";
	}
	
}

function hideRes(){
	document.getElementById("res").style = "display:none";
}

function formatGrammarStructure(){
	let t = document.getElementById("tw").innerHTML;
	let spw = document.getElementById("spw").innerHTML;
	let pw = document.getElementById("pw").innerHTML;
	let kw = document.getElementById("kw").innerHTML;
	let s = document.getElementById("sw").innerHTML;
	let v = document.getElementById("vw").innerHTML;
	let structure = "";

	if(kw=='infinitive'){
		kw='+';
	}else if(kw=='interrogative'){
		kw='?';
	}else if(kw=='negative'){
		kw='-';
	}

	if(pw=='yes'){
		pw = 'continuous';
		structure = spw+' '+t+' '+pw+' [ '+kw+' ]';
	}else{
		pw = '';
		structure = spw+' '+t+' [ '+kw+' ]';
	}
	if(v=='be'){
		structure=structure.replace(' [ ', ' (be) [ ');
	}
	return structure;
}

function formatGrammarStructureSV(){
	let s = document.getElementById("sw").innerHTML;
	let v = document.getElementById("vw").innerHTML;
	let structure = s + " " + v;
	return structure;
}