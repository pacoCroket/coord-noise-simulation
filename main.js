let backImg;
let pixelSize = 30;
let pixels = [];
let tempPixels = [];

let clickOrigin;
let isMultiPixelDraw = false;
let isAnimationOn = true;
let isBitScale = true;
let isMousePressedOnCanvas = false;

let zOffset = 0;
let speed = 0.01;
let scale = 0.05;

// layout of DOM elements
const btnSpacing = 25;
const padding = 16;

function preload() {

}

function setup() {
	cnv = createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 1);
	background(0.2);
	rectMode(CENTER);
	textAlign(CENTER, CENTER);
	imageMode(CENTER);
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
	// pixel size slider TODO make name
	pixelSizeSlider = createSlider(2, 150, pixelSize, 0);
	pixelSizeSlider.position(padding, padding + btnSpacing*5);
	// pixelSizeSlider.mousePressed(setPixelSize);
	// checkbox for single or multiple pixel drawing
	multiDrawCbox = createCheckbox('Multi pixel draw', isMultiPixelDraw);
	multiDrawCbox.position(padding, padding + btnSpacing*6);
	multiDrawCbox.changed(toggleMultiPixelDraw);
	// toggle for animation
	toggleAniCbox = createCheckbox('Animation On', isAnimationOn);
	toggleAniCbox.position(padding, padding + btnSpacing*7);
	toggleAniCbox.mouseClicked(toggleAni);	
	// checkbox for single or multiple pixel drawing
	bitScaleCbox = createCheckbox('Scale output to [0, 255]', isBitScale);
	bitScaleCbox.position(padding, padding + btnSpacing*8);
	bitScaleCbox.changed(toggleBitScale);
	// label explaining SHIFT for deleting TODO
	// pixel size slider TODO make name
	speedSlider = createSlider(0, 0.05, speed, 0.001);
	speedSlider.position(padding, padding + btnSpacing*9);
	// pixel size slider TODO make name
	scaleSlider = createSlider(0, 0.1, scale, 0.001);
	scaleSlider.position(padding, padding + btnSpacing*10);
}

function draw() {
	background(0.2);

	if (backImg) {
		image(backImg, width/2, height/2, width, height);
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
				let pos = p5.Vector.add(clickOrigin, diff.copy().setMag(dist*j/pixelSize*2));
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
			let color = [noise(p.pos.x * scale, p.pos.y * scale, zOffset), 1, 1]; //HSV
			p.setColor(color);
		}
		p.show();
	}

	// show temp pixels
	for (var i = 0; i < tempPixels.length; i++) {
		tempPixels[i].show();
	}

	zOffset += speed;
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