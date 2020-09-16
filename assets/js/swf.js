/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
This file defined all functions of simple work flow tool.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


var _now = 'overview';


// * * * * * * * * * * * * * * * * initialization * * * * * * * * * * * * * * * * *


/* ---
initilaze after loading tool content
--- */
function initializeTool() {

	// parse url
	var url = new URL(window.location.href);

	// language choose - default zh
	if (url.searchParams.has('language')) _language = url.searchParams.get('language');

	// check swf parameters (transmit by url)
	if (!url.searchParams.has('info')) {
		alert(_mainContent.paraError[_language]);
		return;
	}

	// parse swf parameters
	var info = JSON.parse(unescape(url.searchParams.get('info')));

	displayHeader(info);
	displayOverview(info);

	// display tools
	info.tools.forEach(toolID => {
		displayTool(toolID);
	});
}


// * * * * * * * * * * * * * * * * display * * * * * * * * * * * * * * * * *


/* ---
display tool bar of simple work flow
INPUT: object, parameters from url
--- */
function displayHeader($info) {

	// stage tab
	$info.tools.forEach((id, index) => {
		let tabHtml = `<div id="${ id }-tab" class="headerBtn" onclick="switchTool('${ id }')">${ index+1 }. ${ _id2text.func[_tools[id].func][_language] }</div>`;
		$('#stageTabs').append(tabHtml);
	});

	// buttons at right side
	$('#l-steps').html(_mainContent.steps[_language]);
	$('#l-language').html(_mainContent.language[_language]);

	// language list
	$.getJSON('assets/json/language.json', function($result) {
		let languageList = "";
		let infoStr = escape(JSON.stringify($info));
		for (let l in $result) languageList += `<a href="swf.html?info=${ infoStr }&language=${ l }">${ $result[l] }</a>`;
		$('#language-list').html(languageList);
	});
}


/* ---
display overview page (without tool information)
INPUT: object, parameters from url
--- */
function displayOverview($info) {

	// title
	var title = `<div class=title>${ _id2text.input[$info.input][_language] } → ${ _id2text.output[$info.output][_language] }&nbsp<span>Simple Work Flow</span></div><hr>`;	

	// material
	var material = "";
	$info.tools.forEach(id => {
		_tools[id].material.forEach(item => {
			material += `<li>${ _id2text.material[item][_language] }</li>`;
		});
	});	

	// needed files
	var prepared = `<p>${ _mainContent.neededFiles[_language] }</p>
					<ul id="needed-files">
						<li>${ _id2text.input[$info.input][_language] }</li>
						${ material }
					</ul>`;

	// flow block parameters
	var toolNum = $info.tools.length;
	var rowNum = Math.ceil(toolNum / 3);
	var rowStyle = "auto";

	// flow block style
	for (let i = 1; i < rowNum; i++) rowStyle += " 80px auto";

	// flow block
	var flow = "";
	for (let i = 0; i < rowNum; i++) {

		// positive row: 0 -> 1 -> 2
		if (i % 2 === 0) {
			for (let j = 0; j < 3; j++) {
				let toolIndex = i * 3 + j;

				// tool block
				if (toolIndex < toolNum) flow += stageBlockHTML(toolIndex, $info.tools[toolIndex]);
				else flow += `<div></div>`;				// fill of empty entry

				// arrow
				if (j < 2) {
					if (toolIndex < toolNum-1) flow += dirHTML('right');
					else flow += `<div></div>`;			// fill of empty entry
				}
			}

			// if have next row, add (empty) (empty) (empty) (empty) (down)
			if (i < rowNum - 1) flow += `<div></div><div></div><div></div><div></div>` + dirHTML('down');

		// reverse row: 5 <- 4 <- 3
		} else {
			for (let j = 2; j >= 0; j--) {
				let toolIndex = i * 3 + j;

				// tool block
				if (toolIndex < toolNum) flow += stageBlockHTML(toolIndex, $info.tools[toolIndex]);
				else flow += `<div></div>`;				// fill of empty entry
				
				// arrow
				if (j > 0) {
					if (toolIndex < toolNum) flow += dirHTML('left');
					else flow += `<div></div>`;			// fill of empty entry
				}
			}

			// if have next row, add (down) (empty) (empty) (empty) (empty)
			if (i < rowNum - 1) flow += dirHTML('down') + `<div></div><div></div><div></div><div></div>`;
		}
	}

	var procedure = `<h1>${ _mainContent.procedure[_language] }</h1>
					 <div class="flow" style="grid-template-rows: ${ rowStyle };">
					 	${ flow }
					 </div>`;
	$('#overview').html(title + prepared + procedure);
}


/* ---
display stage block on overview page (under procedure)
INPUT: 1) int, tool order
	   2) string, tool ID
--- */
function stageBlockHTML($index, $id) {
	return `<div id="${ $id }-block" class="stage-block" onclick="switchTool('${ $id }')">
				<h3>${ $index+1 }. ${ _id2text.func[_tools[$id].func][_language] }</h3>
				<img src="${ _tools[$id].info[_language].image }">
				<p><b>${ _tools[$id].info[_language].toolname }${ _mainContent.colon[_language] }</b>${ _tools[$id].info[_language].description }</p>
			</div>`;
}


/* ---
display direction icon in procedure on overview page
INPUT: string, direction
--- */
function dirHTML($dir) {
	return `<div class="dir">
				<span class="glyphicon glyphicon-chevron-${ $dir }"></span>
			</div>`;
}


/* ---
display tool tab
INPUT: string, tool ID
--- */
function displayTool($toolID) {

	// tool
	var tool = `<div id="${ $toolID }" class="tool-frame">
					<iframe src="${ _tools[$toolID].info[_language].url }"></iframe>
				</div>`;
	$('.body').append(tool);

	// steps
	var path = `tools/${ $toolID }/step_${ _language }.json`;

	// success
	$.getJSON(path).done(function($result) {
		displayStep($toolID, $result);

	// fail
	}).fail(function() {
		path = `tools/${ $toolID }/step_zh.json`;

		// load default file - zh
		$.getJSON(path).done(function($result) {
			displayStep($toolID, $result);
		}).fail(function() {
			alert(`${ _mainContent.loadStepError[_language] } (${ $toolID })`);
		});
	});
}


/* ---
display explain content of a tool (in menu)
INPUT: 1) string, tool ID
	   2) object, tools/step.json
--- */
function displayStep($toolID, $stepInfo) {

	// to tool button
	var toolBtn = ($stepInfo.oriTool) ?`<a class="ori-tool" href="${ _tools[$toolID].info[_language].url }" target="_blank">&nbsp${ _mainContent.toolText[_language] }&nbsp</a>` :"";

	// each steps
	var steps = "";
	for (let i = 1; i <= $stepInfo.stepNum; i++) {
		let stepObj = $stepInfo[`step${ i }`];
		let imageText = (stepObj.image !== "none") ?`<img src="${ stepObj.image }">` : "";

		// step text
		steps += `<div class="step">
					  <h3>Step ${ i }</h3>
					  <p>${ stepObj.text }</p>
					  ${ imageText }
				  </div>`;
	}

	// whole menu
	var menuText = `<div id="${ $toolID }-step" class="menu-block">
						<h1>${ _tools[$toolID].info[_language].toolname }</h1>
						<hr>

						<div class="menu-block-content">
							${ toolBtn }
							${ steps }
						</div>
					</div>`;
	$('.menu').append(menuText);
}


// * * * * * * * * * * * * * * * * interaction / button functions * * * * * * * * * * * * * * * * *


/* ---
switch between each tools
INPUT: string, id of selected object
--- */
function switchTool($id) {

	// overview do not need steps
	if ($id === 'overview') toggleStep('close');
	_now = $id;
	
	// header
	$('.headerBtn.target').removeClass('target');
	$(`#${ $id }-tab`).addClass('target');

	// content
	$('.body > div.target').removeClass('target');
	$(`#${ $id }`).addClass('target');

	// explain
	$('.menu-block.target').removeClass('target');
	$(`#${ $id }-step`).addClass('target');
}


/* ---
toggle the cheatsheet
INPUT: string, open or close
--- */
function toggleStep($active) {

	// language switch
	if (_now === 'overview') {
		alert(_mainContent['overviewAlert'][_language]);
		return;
	}

	// start animation
	$('.menu').removeClass('showed');
	$('.menu').addClass($active);
	$('.menu').addClass('animating');

	// stop animation
	setTimeout(function() {
		if ($active == 'open') $('.menu').addClass('showed');
		$('.menu').removeClass($active);
		$('.menu').removeClass('animating');
	}, 600);
}


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