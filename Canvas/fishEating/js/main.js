var can1,can2;
var ctx1,ctx2;

var canWidth, canHeigth;

var lastTime;
var deltaTime;

var bgPic = new Image();
var ane;
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

	bgPic.src = "./src/background.jpg";

	canWidth = can1.width;
	canHeight = can1.height;

	ane = new aneObj();
	ane.init();

	fruit = new fruitObj();
	fruit.init();
}


function gameLoop() {
	window.requestAnimFrame(gameLoop);
	var now = Date.now();
	deltaTime = now - lastTime;
	lastTime = now;
	
	drawBackground();

	ane.draw();
	fruit.draw();
}