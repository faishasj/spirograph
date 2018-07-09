// Downloads spirograph canvas as an image
function downloadSpiro(a, filename, format) {
	a.href = spiroCanvas.toDataURL("image/" + format);
    a.download = filename + "." + format;
}

// Initialise spirograph setup
function initSpiro() {
	t = 0;
	updateSpiro();
	firstPosPen = lastPosPen = posPen; 
}

// Update position of rotating circle and pen
function updateSpiro() {
	if (btnHypo.classList.contains("active")) { 
		// Hypotrochoid parametric equations
		posr = {x: mainCanvas.width / 2 + (R-r) * Math.cos(t), y: mainCanvas.height / 2 - (R-r) * Math.sin(t)};
		posPen = {x: posr.x + p * Math.cos((R-r) / r * t), y: posr.y + p * Math.sin((R-r) / r * t)};
	} else {
		// Epitrochoid parametric equations
		posr = {x: mainCanvas.width / 2 + (R+r) * Math.cos(t), y: mainCanvas.height / 2 + (R+r) * Math.sin(t)};
		posPen = {x: posr.x - p * Math.cos((R+r) / r * t), y: posr.y - p * Math.sin((R+r) / r * t)};
	}
}

// Draw circles and pen offset to offscreen canvas
function renderCircles() {
	ctxCircles.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
	ctxCircles.lineWidth = 3;
	ctxCircles.lineJoin = 'round';
	ctxCircles.lineCap = 'round';
	ctxCircles.strokeStyle = 'white';
	ctxCircles.fillStyle = 'white';

	// Outer circle
	ctxCircles.beginPath();
	ctxCircles.arc(mainCanvas.width / 2, mainCanvas.height / 2, R, 0, 2*Math.PI);
	ctxCircles.stroke();

	// Inner circle
	ctxCircles.beginPath();
	ctxCircles.arc(posr.x, posr.y, r, 0, 2*Math.PI);
	ctxCircles.stroke();
	
	// Pen offset
	ctxCircles.beginPath();
	ctxCircles.moveTo(posr.x, posr.y);
	ctxCircles.lineTo(posPen.x, posPen.y);
	ctxCircles.stroke();
	
	ctxCircles.beginPath();
	ctxCircles.arc(posPen.x, posPen.y, 2, 0, 2*Math.PI);
	ctxCircles.closePath();
	ctxCircles.stroke();
	ctxCircles.fill();
}

// Draw spirograph to offscreen canvas
function renderSpiro() {
	ctxSpiro.lineWidth = 3;
	ctxSpiro.lineJoin = 'round';
	ctxSpiro.lineCap = 'round';
	
	// Multi-coloured path
	var red = Math.sin(0.003 * numPoints + 0) * 127 + 128;
	var green = Math.sin(0.003 * numPoints + 2) * 127 + 128;
	var blue = Math.sin(0.003 * numPoints + 4) * 127 + 128;
	ctxSpiro.strokeStyle = "rgb(" + red + "," + green + "," + blue + ")";
	
	ctxSpiro.beginPath();
	ctxSpiro.moveTo(lastPosPen.x, lastPosPen.y);
	ctxSpiro.lineTo(posPen.x, posPen.y);
	ctxSpiro.stroke();
}

// Update and render spirograph and circles
function render() {
	ctxMain.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
	
	// Update spirograph
	if (!(btnPause.disabled)) {
		numPoints++;
		t += speedr;
		lastPosPen = posPen;
		updateSpiro();
		renderSpiro();
	}
	
	// Draw offscreen canvases to main canvas
	ctxMain.drawImage(spiroCanvas, 0, 0);
	renderCircles();
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