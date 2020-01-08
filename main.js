let backImg;
let pixelSize = 30;
let pixels = [];
let tempPixels = [];

let clickOrigin;
let isMultiPixelDraw = false;
let isAnimationOn = true;
let isByteScale = true;
let isMousePressedOnCanvas = false;

let zOffset = 0;
let speed = 0.01;
let scale = 0.05;
let drift = 0.02;

// layout of DOM elements
const btnSpacing = 30;
const padding = 16;
let colItems = -1;

let imageScaling = 1;

function preload() {

}

function setup() {
	cnv = createCanvas(windowWidth-220, windowHeight);
	cnv.position(220, 0);
	colorMode(HSB, 1);
	background(0.2);
	// rectMode(CENTER);
	textAlign(CENTER, CENTER);
	imageMode(CENTER);
	textSize(16);

	// mouse events over canvas element
	cnv.mousePressed(canvasMousePresssed);
	cnv.mouseReleased(canvasMouseReleased);	
	cnv.doubleClicked(canvasDoubleClicked);

	// upload image button TODO
	uploadImgBtn = createFileInput(handleFile);
	uploadImgBtn.position(padding, nextUnderPos());

	// let uploadImgBtn = select('uploadImgBtn');
	// console.log({uploadImgBtn})
	// uploadImgBtn.mousePressed(handleFile);
	// uploadImgBtn.class("myButton");
	// remove image button
	removeImgBtn = createButton('Remove image');
	// removeImgBtn.class("myButton");
	removeImgBtn.position(padding, nextUnderPos());
	removeImgBtn.mouseClicked(removeImg);
	// regex input/output
	regexOutField = createInput();
	regexOutField.position(padding, nextUnderPos());
	regexOutField.attribute('text', '/regex/');
	// inputField.class("inputField");
	// load layout button
	// loadLayoutBtn = createButton('Load layout');
	// loadLayoutBtn.position(padding, nextUnderPos());
	// loadLayoutBtn.mouseClicked(loadLayout);
	// save layout button
	saveLayoutBtn = createButton('Save layout');
	saveLayoutBtn.position(padding, nextUnderPos());
	saveLayoutBtn.mouseClicked(saveLayout);	
	// saveLayoutBtn.class("myButton");
	// pixel size slider TODO make name
	lbl3 = createP('Pixel size:');
	lbl3.position(padding,  nextUnderPos());
	pixelSizeSlider = createSlider(2, 150, pixelSize, 0);
	pixelSizeSlider.position(padding, nextUnderPos());
	// pixelSizeSlider.mousePressed(setPixelSize);
	// checkbox for single or multiple pixel drawing
	multiDrawCbox = createCheckbox('Multi pixel draw', isMultiPixelDraw);
	multiDrawCbox.position(padding, nextUnderPos());
	multiDrawCbox.changed(toggleMultiPixelDraw);
	// toggle for animation
	toggleAniCbox = createCheckbox('Noise2Color mapping On', isAnimationOn);
	toggleAniCbox.position(padding, nextUnderPos());
	toggleAniCbox.mouseClicked(toggleAni);	
	// checkbox for single or multiple pixel drawing
	bitScaleCbox = createCheckbox('Scale output to [0, 255]', isByteScale);
	bitScaleCbox.position(padding, nextUnderPos());
	bitScaleCbox.changed(toggleBitScale);
	// label explaining SHIFT for deleting TODO
	lbl1 = createP('Speed:');
	lbl1.position(padding, nextUnderPos());
	// pixel size slider TODO make name
	speedSlider = createSlider(0, 0.05, speed, 0.001);
	speedSlider.position(padding, nextUnderPos());
	// pixel size slider TODO make name
	lbl2 = createP('Noise scale:');
	lbl2.position(padding, nextUnderPos());
	scaleSlider = createSlider(0, 0.1, scale, 0.001);
	scaleSlider.position(padding, nextUnderPos());
	// add set number of leds	
	ledCountField = createInput();
	ledCountField.position(padding, nextUnderPos());
	addLedsBtn = createButton('Add # leds');
	addLedsBtn.position(padding, nextUnderPos());	
	addLedsBtn.mouseClicked(addLedsCount);	
	
	// TODO
	// fill(0);
	// text('The idea here is to \n paint the position of your \n LEDs in ther order and \n then get an custom output \n to copy into your code. \n These can be mapped to 2D or 3D noise values.',
	// -padding, nextUnderPos(), 100, 1000);
	// lbl4.position();
}

function nextUnderPos() {
	colItems++;
	return padding + colItems*btnSpacing;
}

function draw() {
	background(0.2);
	fill(1);
	text('The idea here is to paint the position of your LEDs in thier order and then copy the coordinates into your code from a custom output (printed in the browser\'s console). These can be mapped to 2D or 3D noise values. Click to add an LED, double click to delete. Hold SHIFT for deleting too.',
	padding, padding, 450);

	if (backImg) {
		backImg.resize(0, height);
		image(backImg, width/2, height/2);
	}
	// update pixel Size
	pixelSize = pixelSizeSlider.value();
	speed = speedSlider.value();
	scale = scaleSlider.value();

	// update position of tempPixels
	if (isMousePressedOnCanvas) {
		if (isMultiPixelDraw) {
			tempPixels = [];
			let diff = p5.Vector.sub(createVector(mouseX, mouseY), clickOrigin);
			let dist = diff.mag();
			for (j = 0; j < dist / pixelSize; j++) {
				let pos = p5.Vector.add(clickOrigin, diff.copy().setMag(j*pixelSize));
				tempPixels[j] = new Pixel(pos, pixels.length + j);
			}
		} else if (tempPixels.length > 0) {
			tempPixels[0].pos = createVector(mouseX, mouseY);
		}
	}
	
	// delete mode
	if (mouseIsPressed && keyIsPressed && keyCode == SHIFT) {
		let id = getPixelClicked(createVector(mouseX, mouseY));
		if (id != null) {				
			removePixel(id);
		}
	} 

	// update and show existing pixels
	for (var i = 0; i < pixels.length; i++) {		
		let p = pixels[i];
		if (isAnimationOn) {	
			let color = [((2*noise(p.pos.x * scale / 50 + drift, p.pos.y * scale / 50 - 2*drift, zOffset)+drift)%1), 1, 1]; //HSV
			p.setColor(color);
		}
		p.show();
	}

	// show temp pixels
	for (var i = 0; i < tempPixels.length; i++) {
		tempPixels[i].show();
	}

	zOffset += speed;
	drift += speed / 8;
}

function mouseClicked() {

}

function canvasMousePresssed() {
	isMousePressedOnCanvas = true;
	if (keyIsPressed && keyCode == SHIFT) return;

	clickOrigin = createVector(mouseX, mouseY);
	let pixelClicked = getPixelClicked(clickOrigin); // number within pixels

	if (pixelClicked != null) {
		// put this pixel in tempPixels and remove from pixels
		tempPixels.push(pixels[pixelClicked]);
		pixels.splice(pixelClicked, 1);
	} else {
		tempPixels.push(new Pixel(clickOrigin, pixels.length));
	}
}

function canvasMouseReleased() {
	if (keyIsPressed && keyCode == SHIFT) return;

	clickOrigin = null;
	if (isMultiPixelDraw) {
		pixels = pixels.concat(tempPixels);
	} else {
		// put the pixel back in id position
		pixels.splice(tempPixels[0].id, 0, tempPixels[0]);
	}
	tempPixels = [];
}

function canvasDoubleClicked() {
	if (keyIsPressed && keyCode == SHIFT) return;

	clickOrigin = createVector(mouseX, mouseY);	
	let pixelClicked = getPixelClicked(clickOrigin); // number within pixels

	if (pixelClicked != null) {
		// remove this pixel
		removePixel(pixelClicked);
	} 
}

function removePixel(id) {
	pixels.splice(id, 1);
	// update id of all pixels 
	for (var i = 0; i < pixels.length; i++) {
		pixels[i].id = i;
	}
}

function getPixelClicked(pos) {
	let pixelClicked = null;
	for (var i = 0; i < pixels.length; i++) {
		if (p5.Vector.dist(pos, pixels[i].pos) < pixelSize/2) {
			pixelClicked = i;
		}
	}
	return pixelClicked;
}

function mouseReleased() {
	isMousePressedOnCanvas = false;
}

function loadLayout() {

}

function addLedsCount() {
	let ledCount = ledCountField.text;
	console.log(ledCount);
}

function saveLayout() {
	let out = [];
	let scaleFactor = 1;
	
	let xMin = 0;
	let yMin = 0;

	if (isByteScale) {
		let xMax = 0;
		let yMax = 0;
		xMin = width;
		yMin = height;

		for (var i = 0; i < pixels.length; i++) {
			if (pixels[i].pos.x > xMax) xMax = pixels[i].pos.x;
			if (pixels[i].pos.y > yMax) yMax = pixels[i].pos.y;
			if (pixels[i].pos.x < xMin) xMin = pixels[i].pos.x;
			if (pixels[i].pos.y < yMin) yMin = pixels[i].pos.y;
		}

		scaleFactor = max(xMax-xMin, yMax-yMin) / 255;
	}

	for (var i = 0; i < pixels.length; i++) {
		out.push([
			((pixels[i].pos.x - xMin) / scaleFactor).toFixed(0),
			((pixels[i].pos.y - yMin) / scaleFactor).toFixed(0)
		].join(', '));
	}

	console.log("Here is the generated output:");
	console.log('{{' + out.join('}, {') + '}}');
}

function toggleAni() {
	isAnimationOn = this.checked();
}

function toggleMultiPixelDraw() {
	isMultiPixelDraw = this.checked();
}

function toggleBitScale() {
	isByteScale = this.checked();
}

// function setPixelSize() {
// 	pixelSize = pixelSizeSlider.value();
// }

function handleFile(file) {
	print(file);
	if (file.type === 'image') {
		backImg = loadImage(file.data);
	} else {
		backImg = null;
	}
}

function removeImg() {	
	backImg = null;
}