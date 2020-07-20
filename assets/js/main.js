/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
This file defined interaction of simple work flow tool.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


var _now = 'overview';
var _swf = "empty";
var _language = 'zh';


/* ---
trigger initialization until finishing initialization
--- */
$(document).ready(function() {

	// parse url
	var url = new URL(window.location.href);

	// language choose - default chinese
	if (url.searchParams.has('language')) _language = url.searchParams.get('language');

	// load simple work flow
	if (url.searchParams.has('swf')) {
		_swf = url.searchParams.get('swf');

		// language switch
		if (_language === 'zh') {
			$('#l-steps').append('步驟');
			$('#l-language').append('語言');
		} else if (_language === 'en') {
			$('#l-steps').append('Steps');
			$('#l-language').append('Language');
		}

		// language list
		$.getJSON(_swf + '/json/language.json', function($result) {
			$('.language-list').append(generateLanguateList($result));
		});

		// load basic.json
		$.getJSON(_swf + '/json/basic_' + _language + '.json', function($result) {
			displaySWF($result);

			for (let i = 1; i <= $result['stageNum']; i++) {
				let stageObj = $result['stage' + i.toString()];
				$.getJSON(stageObj['step'], function($$result) {
					$('#' + stageObj['id'] + '-step').append(generateStep($$result, stageObj['url']));
				});
			}
		});

	// don't choose flow
	} else {
		alert('請在網址加上 simple work flow 代碼，例如：....../DocuSky-SWF/index.html?swf=multiread。');
		return false;
	}
});


/* ---
display all UI
--- */
function displaySWF($basic) {

	// title and overview
	$('head title').append('Simple Work Flow - ' + $basic['title']);
	$('#overview').append(generateOverview($basic));
	let css = "calc(1600 * 6vh / 550 + 2vh) 50px";

	// stages
	for (let i = $basic['stageNum']; i > 0; i--) {
		let stageObj = $basic['stage' + i.toString()];
		css += " 150px";

		// header
		let id = stageObj['id'];
		let name = stageObj['name'];
		let header = "<div id=\"" + id + "-tab\" class=\"headerBtn\" onclick=\"switchTool('" + id + "')\">" + name + "</div>";
		$('.header .target').after(header);

		// explain
		let explain = "<div id=\"" + id + "-step\" class=\"menu-block\"></div>";
		$('.menu').append(explain);

		// tool
		let tool = "<div id=\"" + id + "\" class=\"tool-frame\"><iframe src=\"" + stageObj['url'] + "\"></iframe></div>";
		$('.body').append(tool);
	}

	// header css
	css += " auto 100px 100px";
	$('.header').css('grid-template-columns', css);
}


/* ---
generate language choice list html
INPUT: object, language list
--- */
function generateLanguateList($languageList) {
	var languageList = "";
	for (let index in $languageList[_language]) languageList += "<a href=\"index.html?swf=" + _swf + "&language=" + Object.keys($languageList)[index] + "\">" + $languageList[_language][index] + "</a>";
	return languageList;
}


/* ---
generate overview html
INPUT: object, basic.json
--- */
function generateOverview($info) {

	// language switch
	var procedure;
	if (_language === 'zh') procedure = '流程';
	else if (_language === 'en') procedure = 'Procedure';

	// intro
	var intro = "<div class=\"title\">" + $info['title'] + "&nbsp<span>Simple Work Flow</span></div><hr><p>" + $info['intro'] + "</p><h1>" + procedure + "</h1>";
	
	// stages
	var flow = "<div class=\"flow\">";
	for (let i = 1; i <= $info['stageNum']; i++) {

		// block
		let stageObj = $info['stage' + i.toString()];
		flow += "<div class=\"step-block\" onclick=\"switchTool('" + stageObj['id'] + "')\"><h3>" + stageObj['name'] + "</h3><img src=\"" + stageObj['image'] + "\"><p>" + stageObj['description'] + "</p></div>";

		// arrow
		if (stageObj['arrow'] === 'right') {
			flow += "<div class=\"dir\"><span class=\"glyphicon glyphicon-chevron-right\"></span></div>";
		}
	}
	flow += "</div>";

	return intro + flow;
}


/* ---
generate step html
INPUT: object, step.json
--- */
function generateStep($info, $url) {
	var title = "<h1>" + $info['title'] + "</h1><hr>";

	// language switch
	var toolText;
	if (_language === 'zh') toolText = '點我回到原工具';
	else if (_language === 'en') toolText = 'Click me to return to origin tool';

	// steps
	var steps = "<div class=\"menu-block-content\">";
	if ($info['oriTool']) steps += "<a class=\"ori-tool\" href=\"" + $url + "\" target=\"_blank\">&nbsp" + toolText + "&nbsp</a>";
	for (let i = 1; i <= $info['stepNum']; i++) {
		let stepObj = $info['step' + i.toString()];
		steps += "<div class=\"step\"><h3>Step " + i + "</h3><p>" + stepObj['text'] + "</p>";
		if (stepObj['image'] !== "none") steps += "<img src=\"" + stepObj['image'] + "\">";
		steps += "</div>";
	}
	steps += "</div>";

	return title + steps;
}


/* ---
switch between each tools
INPUT: string, id of selected object
--- */
function switchTool($id) {

	if ($id === 'overview') toggleMenu('close');
	_now = $id;
	
	// header
	$('.headerBtn.target').removeClass('target');
	$('#' + $id + '-tab').addClass('target');

	// content
	$('.body > div.target').removeClass('target');
	$('#' + $id).addClass('target');

	// explain
	$('.menu-block.target').removeClass('target');
	$('#' + $id + '-step').addClass('target');
}


/* ---
toggle the cheatsheet
INPUT: string, open or close
--- */
function toggleMenu($active) {

	if (_now === 'overview') {
		if (_language === 'zh') alert("本頁面無操作步驟，請先進入任一工具。");
		else if (_language === 'en') alert("There are no steps in this stage. Please enter a tool first.");
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
	if ($('.language-list').css('display') === 'none') {
		$('.language-list').css('display', 'grid');
		$('#l-language').addClass('target');
	} else {
		$('.language-list').css('display', 'none');
		$('#l-language').removeClass('target');
	}
}