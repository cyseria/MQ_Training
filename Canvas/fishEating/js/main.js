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

var babyTail = [];
var babyEye = [];
var babyBody = [];

var momTail = [];
var momEye = [];
var momBody = [];

document.body.onload = game;

function game() {
	init();
	lastTime = Date.now();
	deltaTime = 0;
	gameLoop();
}

function init() {
	can1 = document.getElementById("canvas1"); // 大鱼，小鱼
	ctx1 = can1.getContext("2d");

	can2 = document.getElementById("canvas2"); // 背景，海葵，果实
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

	baby = new babyObj();
	baby.init();

	mx = canWidth * 0.5;
	my = canHeight * 0.5;

	// 小鱼的眼睛尾巴身体
	for (var i = 0; i < 8; i++) {
		babyTail[i] = new Image();
		babyTail[i].src = "./src/babyTail" + i + ".png";
	}
	for (var i = 0; i < 2; i++) {
		babyEye[i] = new Image();
		babyEye[i].src = "./src/babyEye" + i + ".png";
	}
	for (var i = 0; i < 20; i++) {
		babyBody[i] = new Image();
		babyBody[i].src = "./src/babyFade" + i + ".png";
	}

	// 大鱼的眼睛尾巴身体
	for (var i = 0; i < 8; i++) {
		momTail[i] = new Image();
		momTail[i].src = "./src/bigTail" + i + ".png";
	}

	for (var i = 0; i < 2; i++) {
		momEye[i] = new Image();
		momEye[i].src = "./src/bigEye" + i + ".png";
	}

	// for (var i = 0; i < 20; i++) {
	// 	babyBody[i] = new Image();
	// 	babyBody[i].src = "./src/babyFade" + i + ".png";
	// }
}

// 每一帧需要绘制的
function gameLoop() {
	window.requestAnimFrame(gameLoop);

	// 记录相邻量帧之间的时间间隔，让动画更加自然
	var now = Date.now();
	deltaTime = now - lastTime;
	lastTime = now;
	if (deltaTime > 40) {
		deltaTime = 40;
	}

	drawBackground();

	ane.draw();

	fruitMonitor();
	fruit.draw();

	ctx1.clearRect(0, 0, canWidth, canHeight);
	mom.draw();
	baby.draw();

	momFruitCollision();
	momBabyCollision();
	
}

function onMouseMove(e) {
	if (e.offsetX || e.layerX) {
		mx = e.offsetX == undefined ? e.layerX : e.offsetX;
		my = e.offsetY == undefined ? e.layerY : e.offsetY;
		// console.log(mx);
	}
}