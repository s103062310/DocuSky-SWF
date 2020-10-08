/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
This file draws the tool map using svg and defines interaction.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


var _svg;
var _mouseDown = false;
var _selectNode = false;
const _r = 10;


/* ---
display tool map
--- */
function displayGraph() {
	var nodes = "";
	var edges = "";

	// title
	$('#toolmap').html(_mainContent.toolmap[_language]);

	// draw
	$.each(_tools, function(key, obj) {
		let [x1, y1] = obj.pos;

		// node
		nodes += `<circle id="circle-${ key }" cx="${ x1 }" cy="${ y1 }" r="${ _r }" data-toggle="tooltip" data-placement="top" title="${ obj.info[_language].toolname }" onclick="toTool('${ key }')"/>
				  <text id="text-${ key }" x="${ x1 - _r }" y="${ y1 - _r * 1.5 }">${ key.toUpperCase() }</text>`;

		// edge
		obj.next.forEach((id) => {
			let [x, y] = calEndPoint(obj.pos, _tools[id].pos);
			let [bx, by] = calBezierPoint(obj.pos, [x, y]);
			edges += `<path id="line-${ key }-${ id }" data-start="${ key }" data-end="${ id }" d="M${x1},${y1} Q${bx},${by} ${x},${y}" marker-end="url(#normalArrow)"/>`;
		});
	});

	// tool map area
	var svg = `<svg viewBox="0 0 640 360">

					<!-- Define Arrow -->
					<defs>
						<marker id="normalArrow" markerUnits="strokeWidth" markerWidth="10" markerHeight="10" viewBox="0 0 10 10" refX="10" refY="5" orient="auto">
							<path d="M5,2 L10,5 L5,8"/>
						</marker>
						<marker id="targetArrow" markerUnits="strokeWidth" markerWidth="10" markerHeight="10" viewBox="0 0 10 10" refX="10" refY="5" orient="auto">
							<path d="M5,2 L10,5 L5,8"/>
						</marker>
					</defs>

					<!-- Regions -->
					<g transform="translate(-100,5)">
						<rect width="100" height="350" class="label" style="opacity: .2;"/>
						<svg width="100" height="30"><text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" class="label">${ _mainContent.label[_language] }</text></svg>
					</g>
					<g transform="translate(5,5)">
						<rect width="110" height="350" class="convert" style="opacity: .2;"/>
						<svg width="110" height="30"><text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" class="convert">${ _mainContent.convert[_language] }</text></svg>
					</g>
					<g transform="translate(130,5)">
						<rect width="100" height="170" class="manage"/>
						<rect width="200" height="180" class="manage" transform="translate(0,170)"/>
						<svg width="100" height="30"><text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" class="manage">${ _mainContent.manage1[_language] }</text></svg>
						<svg width="100" height="60" transform="translate(0,300)"><text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" class="manage">${ _mainContent.manage2[_language] }</text></svg>
					</g>
					<g transform="translate(230,5)">
						<rect width="100" height="170" class="label" style="opacity: .2;"/>
						<svg width="100" height="30"><text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" class="label">${ _mainContent.label[_language] }</text></svg>
					</g>
					<g transform="translate(340,5)">
						<rect width="90" height="350" class="db"/>
						<svg width="90" height="30"><text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" class="db">${ _mainContent.db[_language] }</text></svg>
					</g>
					<g transform="translate(440,5)">
						<rect width="200" height="350" class="app"/>
						<svg width="200" height="30"><text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" class="app">${ _mainContent.app[_language] }</text></svg>
					</g>

					<!-- Edges -->
					${ edges }

					<!-- Nodes -->
					${ nodes }
				</svg>`;
	$('.graph').append(svg);

	// active data-toggle
	$('[data-toggle=tooltip]').tooltip();

	// mouse event - svg
	_svg = document.getElementsByTagName('svg');
	_svg[0].addEventListener('mousemove', dragBox);
	_svg[0].addEventListener('mousedown', mouseDown);
	_svg[0].addEventListener('mouseup', mouseUp);

	// mouse event - circle
	var circleElement = document.getElementsByTagName('circle');
	for (let i = 0; i < circleElement.length; i++) circleElement[i].addEventListener('mousemove', dragNode);
}


// * * * * * * * * * * * * * * * * mouse event * * * * * * * * * * * * * * * * *


/* ---
drag to translate whole map
INPUT: object, mouse event
--- */
function dragBox($event) {

	// not press the mouse
	if (!_mouseDown) return;

	// move node not box
	if (_selectNode) return;

	// update viewbox
	var delta = mouseDrag($event);
	var startViewBox = _svg[0].getAttribute('viewBox').split(' ').map(n => parseFloat(n));
	let moveToViewBox = `${ startViewBox[0] + delta.dx } ${ startViewBox[1] + delta.dy } ${ startViewBox[2] } ${ startViewBox[3] }`;
	_svg[0].setAttribute('viewBox', moveToViewBox)
}


/* ---
drag to translate a tool node
INPUT: object, mouse event
--- */
function dragNode($event) {
	
	// not press the mouse
	if (!_mouseDown) return;

	// select node
	_selectNode = true;

	// update node
	var id = $event.target.id.replace('circle-', '');
	var delta = mouseDrag($event);
	var cx = parseFloat($event.target.getAttribute('cx')) - delta.dx;
	var cy = parseFloat($event.target.getAttribute('cy')) - delta.dy;
	$event.target.setAttribute('cx', cx.toString());
	$event.target.setAttribute('cy', cy.toString());

	// update text
	$(`#text-${ id }`).attr('x', `${ cx - _r }`);
	$(`#text-${ id }`).attr('y', `${ cy - _r * 1.5 }`);

	// update line
	var lines_s = $(`path[data-start=${ id }]`);
	var lines_e = $(`path[data-end=${ id }]`);

	// '0' -> 0
	for (let i = 0; i < lines_s.length; i++) {
		let d = $(lines_s[i]).attr('d').split(' ');
		let x2 = parseFloat(d[2].substring(0, d[2].indexOf(',')));
		let y2 = parseFloat(d[2].substring(d[2].indexOf(',') + 1));
		let [bx, by] = calBezierPoint([cx, cy], [x2, y2]);
		$(lines_s[i]).attr('d', `M${cx},${cy} Q${bx},${by} ${x2},${y2}`);
	}

	// 0 -> '0'
	for (let i = 0; i < lines_e.length; i++) {
		let d = $(lines_e[i]).attr('d').split(' ');
		let x1 = parseFloat(d[0].substring(1, d[0].indexOf(',')));
		let y1 = parseFloat(d[0].substring(d[0].indexOf(',') + 1));
		let [x2, y2] = calEndPoint([x1, y1], [cx, cy]);
		let [bx, by] = calBezierPoint([x1, y1], [x2, y2]);
		$(lines_e[i]).attr('d', `M${x1},${y1} Q${bx},${by} ${x2},${y2}`);
	}
}


/* ---
calculate translation info in svg coordinate when mouse dragging
INPUT: object, mouse event
OUTPUT: object, mouse drag delta in svg coordinate
--- */
function mouseDrag($event) {
	
	// mouse position
	let mousePosStart = {
		x: $event.clientX,
		y: $event.clientY
	}

	let mousePosMoveto = {
		x: $event.clientX + $event.movementX,
		y: $event.clientY + $event.movementY
	}
	
	// calculate position in svg
	var newPoint = _svg[0].createSVGPoint();
	var CTM = _svg[0].getScreenCTM();

	newPoint.x = mousePosStart.x;
	newPoint.y = mousePosStart.y;
	let svgPosStart = newPoint.matrixTransform(CTM.inverse());

	newPoint.x = mousePosMoveto.x;
	newPoint.y = mousePosMoveto.y;
	let svgPosMoveto = newPoint.matrixTransform(CTM.inverse());

	// delta
	let delta = {
		dx: svgPosStart.x - svgPosMoveto.x,
		dy: svgPosStart.y - svgPosMoveto.y
	}

	return delta;
}


/* ---
mouse click down
--- */
function mouseDown() {
	_mouseDown = true;
}


/* ---
mouse click up
--- */
function mouseUp() {
	_mouseDown = false;
	_selectNode = false;
}


// * * * * * * * * * * * * * * * * point calculation * * * * * * * * * * * * * * * * *


/* ---
calculate position of end point (where marker is)
INPUT: 1) array, start point of a path (node center)
	   2) array, end point of a path (node center)
OUTPUT: array, end point of a path (marker)
--- */
function calEndPoint(point1, point2) {
	var [x1, y1] = point1;
	var [x2, y2] = point2;
	var d = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
	var x = (d - _r) * (x2 - x1) / d + x1;
	var y = _r * (y1 - y2) / d + y2;
	return [x, y];
}


/* ---
calculate position of bezier point (on bisection of path, dis=r)
INPUT: 1) array, start point of a path (node center)
	   2) array, end point of a path (marker)
OUTPUT: array, bezier point
--- */
function calBezierPoint(point1, point2) {
	var [x1, y1] = point1;
	var [x2, y2] = point2;
	var cx = (x1 + x2) / 2;
	var cy = (y1 + y2) / 2;
	var d = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
	var deltax = (x2 - x1) * _r / d;
	var deltay = (y2 - y1) * _r / d;
	var k = deltay / deltax;
	var bx = cx - deltay * 2 * k;
	var by = cy + deltax * 2 * k;
	return [bx, by];
}


/* ---
get position of all node in svg coordinate
(for developer, drag node to location and call the function in console, use the info to update tools.json)
(close node onclick function first will more convenient)
--- */
function outputNode() {
	var nodeObj = {};
	var nodes = $('circle');

	for (let i = 0; i < nodes.length; i++) {
		let key = nodes[i].id.replace('circle-', '');
		let cx = $(nodes[i]).attr('cx');
		let cy = $(nodes[i]).attr('cy');
		nodeObj[key] = { x: cx, y: cy};
	}

	return nodeObj;
}