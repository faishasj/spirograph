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
	numRotations = lcm(R, r) / R;
	speedr = 4 * Math.PI / 180;
	if (!btnHypo.classList.contains("active")) { 
		// Slower speed for drawing epitrochoids
		speedr /= 1.5;
	}
}

// Calculate the lowest common multiple of two numbers
function lcm(x, y) {
  	return x * y / gcd(x, y);
}

// Calculate the greatest common divisor of two numbers
function gcd(x, y) {
  	while(y) {
    	var tmp = y;
    	y = x % y;
    	x = tmp;
  	}
  	return x;
}

// Update position of rotating circle and pen
function updateSpiro() {
	if (btnHypo.classList.contains("active")) { 
		// Hypotrochoid parametric equations
		posr = {x: mainCanvas.width / 2 + (R-r) * Math.cos(t), y: mainCanvas.height / 2 + (R-r) * Math.sin(t)};
		posPen = {x: posr.x + p * Math.cos((R-r) / r * t), y: posr.y - p * Math.sin((R-r) / r * t)};
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
	var red = Math.round(Math.sin(t / numRotations + 0) * 127 + 128);
	var green = Math.round(Math.sin(t / numRotations + 2) * 127 + 128);
	var blue = Math.round(Math.sin(t / numRotations + 4) * 127 + 128);
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
	if (t >= 2 * Math.PI * numRotations) {
		btnStart.classList.remove("active");
		btnStart.disabled = true;
		btnPause.classList.remove("active");
		btnPause.disabled = true;
	}
	
	window.requestAnimationFrame(render);
}