let backImg;
let pixelSize = 30;
let pixels = [];
let tempPixels = [];

let clickOrigin;
let isMultiPixelDraw = false;
let isAnimationOn = true;
let isBitScale = true;

// layout of DOM elements
const btnSpacing = 25;
const padding = 16;

function preload() {

}

function setup() {
	cnv = createCanvas(windowWidth, windowHeight);
	background(40);
	colorMode(HSB, 100);
	rectMode(CENTER);
	textAlign(CENTER, CENTER);
	textSize(16);

	// mouse events over canvas element
	cnv.mousePressed(canvasMousePresssed);
	cnv.mouseReleased(canvasMouseReleased);	
	cnv.doubleClicked(canvasDoubleClicked);

	// upload image button
	uploadImgBtn = createFileInput(handleFile);
	uploadImgBtn.position(padding, padding);
	// remove image button
	removeImgBtn = createButton('Remove image');
	removeImgBtn.position(padding, padding + btnSpacing);
	removeImgBtn.mouseClicked(removeImg);
	// regex input/output
	inputField = createInput();
	inputField.position(padding, padding + btnSpacing*2);
	inputField.attribute('text', '/regex/')
	// load layout button
	loadLayoutBtn = createButton('Load layout');
	loadLayoutBtn.position(padding, padding + btnSpacing*3);
	loadLayoutBtn.mouseClicked(loadLayout);
	// save layout button
	saveLayoutBtn = createButton('Save layout');
	saveLayoutBtn.position(padding, padding + btnSpacing*4);
	saveLayoutBtn.mouseClicked(saveLayout);	
	// pixel size slider
	pixelSizeSlider = createSlider(2, 150, pixelSize, 0);
	pixelSizeSlider.position(padding, padding + btnSpacing*5);
	// pixelSizeSlider.mousePressed(setPixelSize);
	// checkbox for single or multiple pixel drawing
	multiDrawCbox = createCheckbox('Multi pixel draw', isMultiPixelDraw);
	multiDrawCbox.position(padding, padding + btnSpacing*6);
	multiDrawCbox.changed(toggleMultiPixelDraw);
	// toggle for animation
	toggleAniCbox = createCheckbox('Animation On');
	toggleAniCbox.position(padding, padding + btnSpacing*7);
	toggleAniCbox.mouseClicked(toggleAni);	
	// checkbox for single or multiple pixel drawing
	bitScaleCbox = createCheckbox('Scale output to [0, 255]', isBitScale);
	bitScaleCbox.position(padding, padding + btnSpacing*8);
	bitScaleCbox.changed(toggleBitScale);
}

function draw() {
	background(40);

	if (backImg) {
		image(backImg, 0, 0, width, height);
	}
	// update pixel Size
	pixelSize = pixelSizeSlider.value();

	// update position of tempPixels
	if (mouseIsPressed && tempPixels.length > 0) {
		if (isMultiPixelDraw) {
			// TODO
		} else {
			tempPixels[0].pos = createVector(mouseX, mouseY);
		}
	}

	// show existing pixels
	for (var i = 0; i < pixels.length; i++) {
		pixels[i].show();
	}

	// show temp pixels
	for (var i = 0; i < tempPixels.length; i++) {
		tempPixels[i].show();
	}
}

function mouseClicked() {

}

function canvasMousePresssed() {
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
	clickOrigin = null;
	if (isMultiPixelDraw) {
		pixels = pixels.concat(tempPixels);
	} else {
		pixels.splice(tempPixels[0].id, 0, tempPixels[0]);
	}
	tempPixels = [];
}

function canvasDoubleClicked() {
	clickOrigin = createVector(mouseX, mouseY);	
	let pixelClicked = getPixelClicked(clickOrigin); // number within pixels

	if (pixelClicked != null) {
		// remove this pixel
		pixels.splice(pixelClicked, 1);
	} 
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

function loadLayout() {

}

function saveLayout() {

}

function toggleAni() {
	isAnimationOn = this.checked();
}

function toggleMultiPixelDraw() {
	isMultiPixelDraw = this.checked();
}

function toggleBitScale() {
	isBitScale = this.checked();
}

// function setPixelSize() {
// 	pixelSize = pixelSizeSlider.value();
// }

function handleFile(file) {
	print(file);
	if (file.type === 'image') {
		backImg = createImg(file.data, '');
		backImg.hide();
	} else {
		backImg = null;
	}
}

function removeImg() {	
	backImg = null;
}