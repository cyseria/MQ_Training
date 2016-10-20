var can1,can2;
var ctx1,ctx2;

var canWidth, canHeigth;

var lastTime;
var deltaTime;

var bgPic = new Image();
var ane;
var fruit;
var mom;

var mx; //鼠标x坐标
var my; // 鼠标y坐标

document.body.onload = game;

function game() {
	init();
	lastTime = Date.now();
	deltaTime = 0;
	gameLoop();
}

function init() {
	can1 = document.getElementById("canvas1"); // 小鱼
	ctx1 = can1.getContext("2d");

	can2 = document.getElementById("canvas2"); // 背景，海葵， 果实
	ctx2 = can2.getContext("2d");

	can1.addEventListener('mousemove', onMouseMove, false);

	bgPic.src = "./src/background.jpg";

	canWidth = can1.width;
	canHeight = can1.height;

	ane = new aneObj();
	ane.init();

	fruit = new fruitObj();
	fruit.init();

	mom = new momObj();
	mom.init();

	mx = canWidth * 0.5;
	my = canHeight * 0.5;
}


function gameLoop() {
	window.requestAnimFrame(gameLoop);
	var now = Date.now();
	deltaTime = now - lastTime;
	lastTime = now;
	
	drawBackground();

	ane.draw();

	fruitMonitor();
	fruit.draw();

	ctx1.clearRect(0, 0, canWidth, canHeight);
	mom.draw();
	momFruitCollision();
}

function onMouseMove(e) {
	if (e.offsetX || e.layerX) {
		mx = e.offsetX == undefined ? e.layerX : e.offsetX;
		my = e.offsetY == undefined ? e.layerY : e.offsetY;
		// console.log(mx);
	}
}