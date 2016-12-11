// 果实

var fruitObj = function () {
	this.alive = []; //bool
	this.x = [];
	this.y = [];
	this.l = []; // 大小
	this.aneNo = [];
	this.fruitType = [];
	this.speed = [];
	this.origin = new Image();
	this.blue = new Image();
}
fruitObj.prototype.num = 30;

fruitObj.prototype.init = function() {

	for (var i = 0; i < this.num; i++) {
		this.alive[i] = false;
		this.x[i] = 0;
		this.y[i] = 0;
		this.l[i] = 0;
		this.aneNo[i] = 0;
		this.speed[i] = Math.random() * 0.17 + 0.03;
	}
	this.origin.src = "./src/fruit.png";
	this.blue.src = "./src/blue.png";

}

fruitObj.prototype.draw = function() {

	for (var i = 0; i < this.num; i++) {
		if (this.alive[i]) {
			var pic;
			if (this.fruitType[i] === 'origin') {
				pic = this.origin;
			} else {
				pic = this.blue;
			}

			if (this.l[i] <= 14) { //grow
				var NO = this.aneNo[i];
				this.x[i] = ane.headx[NO];
				this.y[i] = ane.heady[NO];
				this.l[i] += this.speed[i] * deltaTime;
			} else {
				this.y[i] -= this.speed[i] * deltaTime;
			}
			ctx2.drawImage(pic, this.x[i] - this.l[i] * 0.5 , this.y[i] - this.l[i] * 0.5, this.l[i], this.l[i]);

			if (this.y[i] < 10) {
				this.alive[i] = false;
			}
		}

	}
}

fruitObj.prototype.born = function(i) {
	this.aneNo[i] = Math.floor(Math.random() * ane.num);
	// this.x[i] = ane.headx[aneId];
	// this.y[i] = ane.heady[aneId];
	this.l[i] = 0;
	this.alive[i] = true;
	var ran = Math.random();
	if (ran < 0.2) {
		this.fruitType[i] = 'blue';
	} else {
		this.fruitType[i] = 'origin';

	}
}
fruitObj.prototype.dead = function(i) {
	this.alive[i] = false;
}

function fruitMonitor() {
	var num = 0;
	for (var i = 0; i < fruit.num; i++) {
		if (fruit.alive[i]) {
			num ++;
		}
	}
	if (num < 15) {
		sendFruit();
		return;
	}

}
function sendFruit() {
	for (var i = 0; i < fruit.num; i++) {
		if (!fruit.alive[i]) {
			fruit.born(i);
			return;
		}
	}
}
