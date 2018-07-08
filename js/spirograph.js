// Downloads a canvas as an image
function downloadCanvas(a, canvas, filename, format) {
	a.href = canvas.toDataURL("image/" + format);
    a.download = filename + "." + format;
}

// Rotate point by a clockwise angle around a centre point
function rotatePoint(point, centre, angle) {
	var x = (point.x - centre.x) * Math.cos(angle) - (point.y - centre.y) * Math.sin(angle) + centre.x;
	var y = (point.x - centre.x) * Math.sin(angle) + (point.y - centre.y) * Math.cos(angle) + centre.y;
	return {x:x, y:y};
}

// Initialise hypotrochoid setup
function initHypotrochoid() {
	speedr = 2 * Math.PI / 180;
	speedPen = -((R-r)/r) * speedr;
	posr = {x: mainCanvas.width / 2 + R - r, y: mainCanvas.height / 2};	
	posPen = firstPosPen = lastPosPen = {x: mainCanvas.width / 2 + R - r + offset, y: mainCanvas.height / 2};
}

// Initialise epitrochoid setup
function initEpitrochoid() {
	speedr = Math.PI / 180;
	speedPen = ((R+r)/r) * speedr;
	posr = {x: mainCanvas.width / 2 + R + r, y: mainCanvas.height / 2};
	posPen = firstPosPen = lastPosPen = {x: mainCanvas.width / 2 + R + r + offset, y: mainCanvas.height / 2};
}

// Draw circles and pen offset to offscreen canvas
function renderCircles(canvas, ctx) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.lineWidth = 3;
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	ctx.strokeStyle = 'white';
	ctx.fillStyle = 'white';

	// Outer circle
	ctx.beginPath();
	ctx.arc(canvas.width / 2, canvas.height / 2, R, 0, 2*Math.PI);
	ctx.stroke();

	// Inner circle
	ctx.beginPath();
	ctx.arc(posr.x, posr.y, r, 0, 2*Math.PI);
	ctx.stroke();
	
	// Pen offset
	ctx.beginPath();
	ctx.moveTo(posr.x, posr.y);
	ctx.lineTo(posPen.x, posPen.y);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(posPen.x, posPen.y, 2, 0, 2*Math.PI);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
}

// Draw spirograph to offscreen canvas
function renderSpiro(canvas, ctx) {
	ctx.lineWidth = 3;
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	
	// Multi-coloured path
	var red = Math.sin(0.002 * numPoints + 0) * 127 + 128;
	var green = Math.sin(0.002 * numPoints + 2) * 127 + 128;
	var blue = Math.sin(0.002 * numPoints + 4) * 127 + 128;
	ctx.strokeStyle = "rgb(" + red + "," + green + "," + blue + ")";
	
	ctx.beginPath();
	ctx.moveTo(lastPosPen.x, lastPosPen.y);
	ctx.lineTo(posPen.x, posPen.y);
	ctx.stroke();
}

// Draw offscreen canvases to main canvas
function render() {
	ctxMain.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
	if (!(btnPause.disabled)) {
		numPoints++;
		lastPosPen = posPen;
		posr = rotatePoint(posr, {x: mainCanvas.width / 2, y: mainCanvas.height / 2}, speedr);
		posPen = rotatePoint(rotatePoint(posPen, {x: mainCanvas.width / 2, y: mainCanvas.height / 2}, speedr), posr, speedPen);
		renderSpiro(spiroCanvas, ctxSpiro);
	}
	
	ctxMain.drawImage(spiroCanvas, 0, 0);
	renderCircles(circlesCanvas, ctxCircles);
	if (btnCircles.checked) {
		ctxMain.drawImage(circlesCanvas, 0, 0);
	}
	
	// Stop if spirograph is complete
	if (numPoints > 1 && Math.abs(firstPosPen.x - posPen.x) < 0.001 && Math.abs(firstPosPen.y - posPen.y) < 0.001) {
		btnStart.classList.remove("active");
		btnStart.disabled = true;
		btnPause.classList.remove("active");
		btnPause.disabled = true;
	}
	
	window.requestAnimationFrame(render);
}