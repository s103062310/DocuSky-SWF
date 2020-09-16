/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
This file defined all functions of selector.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


var _input = 'no';
var _output = 'no';
var _flows = [];


// * * * * * * * * * * * * * * * * initialization * * * * * * * * * * * * * * * * *


/* ---
initilaze after loading tool content
--- */
function initializeTool() {

	// parse url
	var url = new URL(window.location.href);

	// language choose - default zh
	if (url.searchParams.has('language')) _language = url.searchParams.get('language');

	displayHeader();
	displaySelector();
	displayGraph();
}


// * * * * * * * * * * * * * * * * display * * * * * * * * * * * * * * * * *


/* ---
display tool bar of simple work flow selector
--- */
function displayHeader() {

	// title
	$('.header h1').html(_mainContent.title[_language]);

	// buttons at right side
	$('#l-language').html(_mainContent.language[_language]);

	// language list
	$.getJSON('assets/json/language.json', function($result) {
		let languageList = "";
		for (let l in $result) languageList += `<a href="selector.html?language=${ l }">${ $result[l] }</a>`;
		$('#language-list').html(languageList);
	});
}


/* ---
display user selector
--- */
function displaySelector() {

	// label
	$('#input-label').html(_mainContent.input[_language]);
	$('#output-label').html(_mainContent.output[_language]);

	// input select
	$('#input-select').html(generateOptionsHtml(_id2text.input));
	$('#output-select').html(generateOptionsHtml(_id2text.output));

	// button
	$('#search-btn').html(`<i class="fa fa-search"></i>&nbsp&nbsp${ _mainContent.search[_language] }`);
}


/* ---
generate option items of select element
INPUT: array, options
OUTPUT: string, options in html form
--- */
function generateOptionsHtml($arr) {
	var htmlCode = `<option value="no" selected><span>${ _mainContent.choose[_language] }</span></option>`;
	$.each($arr, function(key, text) {
		htmlCode += `<option value="${ key }"><span>${ text[_language] }</span></option>`;
	});
	return htmlCode;
}


/* ---
display flows after search
--- */
function displayFlows() {
	var flowText = "";

	// each flow
	_flows.forEach((flow, index) => {
		let stageText = "";
		let text = _id2text.input[_input][_language];	// input text

		// each tool
		flow.forEach(id => {
			let func = _id2text.func[_tools[id].func][_language];
			let material = _tools[id].material;
			let materialText = "";

			// material text
			if (material.length > 0) {
				let matT = "";

				// each material
				material.forEach((mat, i) => {
					matT += _id2text.material[mat][_language];
					if (i < material.length - 1) matT += _mainContent.pause[_language];
				});

				materialText = `${ _mainContent.material[_language] }<b>${ matT }</b>`;
			}

			// html text
			text += ` → ` + func;
			stageText += `<li>${ func }${ _mainContent.colon[_language] }${ _tools[id].info[_language].toolname }${ materialText }</li>`;
		});

		// a flow
		flowText += `<div class="card">
						<div class="card-header" id="flow-${ index }">
							<button class="btn btn-link" data-toggle="collapse" data-target="#flow-collapse-${ index }" aria-expanded="true" aria-controls="flow-collapse-${ index }" onclick="highlightInGraph(${ index })">${ text }</button>
						</div>

						<div id="flow-collapse-${ index }" class="collapse" aria-labelledby="flow-${ index }" data-parent="#accordion">
							<div class="card-body">
								<ol>${ stageText}</ol>
								<button class="btn btn-danger" onclick="toSWF(${ index })">${ _mainContent.enterSWF[_language] }</button>
							</div>
						</div>
					</div>`;
	});	

	// recommandation block
	var recommandation = (_flows.length > 0) ?`<h3 style="margin-bottom: 15px;">${ _mainContent.recommandation[_language] }</h3>
											   <div id="accordion">${flowText}</div>`
											  :_mainContent.nowf[_language];
	$('.recommandation').html(recommandation);
}


// * * * * * * * * * * * * * * * * interaction / button functions * * * * * * * * * * * * * * * * *


/* ---
toggle the language choice list
--- */
function toggleLanguageList() {
	if ($('#language-list').css('display') === 'none') {
		$('#language-list').css('display', 'grid');
		$('#l-language').addClass('target');
	} else {
		$('#language-list').css('display', 'none');
		$('#l-language').removeClass('target');
	}
}


/* ---
click search button to search flows given input(corpus) and output(goal)
--- */
function search() {

	// check input
	_input = $('#input-select').val();
	if (_input === 'no') {
		alert(_mainContent.lackInput[_language]);
		return;
	}

	// check output
	_output = $('#output-select').val();
	if (_output === 'no') {
		alert(_mainContent.lackOutput[_language]);
		return;
	}

	// reset
	_flows = [];

	// search all tool
	$.each(_tools, function(key, obj) {
		if (obj.input.indexOf(_input) >= 0) searchNext([key]);
	});

	// display
	displayFlows();
}


/* ---
recursion function when searching suggested flows
INPUT: array, searched flow till now
--- */
function searchNext($flow) {

	// find the end of flow
	var lastTool = $flow[$flow.length - 1];
	if (_tools[lastTool].output.indexOf(_output) >= 0) _flows.push($flow);

	// continue to search
	_tools[lastTool].next.forEach(id => {
		if ($flow.indexOf(id) >= 0) return;	// alread visited
		let flow = $flow.concat([id]);
		searchNext(flow);
	});
}


/* ---
hightlight flow in tool map when selecting it in recommandation block
INPUT: int, flow ID
--- */
function highlightInGraph($flowID) {

	// reset
	$('.graph .target').removeClass('target');

	// each tool
	var flow = _flows[$flowID];
	flow.forEach((toolID, i) => {
		$(`#circle-${ toolID }`).addClass('target');										// node
		if (i < flow.length-1) $(`#line-${ toolID }-${ flow[i+1] }`).addClass('target');	// edge
	});
}


/* ---
click enter flow button, open new tab to simple work flow
INPUT: int, flow ID
--- */
function toSWF($flowID) {
	var para = {
		input: _input,
		output: _output,
		tools: _flows[$flowID]
	};

	// go to
	window.open(`swf.html?info=${ escape(JSON.stringify(para)) }&language=${ _language }`);
}


/* ---
click node on tool map, open new tab to correspond tool
INPUT: string, tool ID
--- */
function toTool($toolID) {
	window.open(_tools[$toolID].info[_language].url);
}