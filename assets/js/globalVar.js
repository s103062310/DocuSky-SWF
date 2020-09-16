/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
This file defined global variables and window init functions.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


var _language = 'zh';
var _tools;
var _id2text;
var _mainContent;
var _intervalID;


// * * * * * * * * * * * * * * * * initialization * * * * * * * * * * * * * * * * *


/* ---
trigger initialization
--- */
$(document).ready(function() {

	// load tools information
	$.getJSON('assets/json/tools.json', function($result) {
		_tools = $result;
	});

	// load id to text correspond table
	$.getJSON('assets/json/id2text.json', function($result) {
		_id2text = $result;
	});

	// load swf text
	var urlElement = window.location.pathname.split('/');
	var filename = urlElement[urlElement.length - 1].split('.')[0];
	$.getJSON(`assets/json/${ filename }.json`, function($result) {
		_mainContent = $result;
	});

	_intervalID = setInterval(checkGlobalData, 1000);
});


/* ---
initilaze tool after loading global json data
--- */
function checkGlobalData() {
	if (_tools !== undefined && _id2text !== undefined && _mainContent !== undefined) {
		clearInterval(_intervalID);
		initializeTool();
	}
}