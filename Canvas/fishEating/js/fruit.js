// 果实

var fruitObj = function () {
	this.alive = []; //bool
	this.x = [];
	this.y = []; 
	this.l = []; // 大小
	this.speed = [];
	this.origin = new Image();
	this.blue = new Image();
}
fruitObj.prototype.num = 30;

fruitObj.prototype.init = function() {

	for (var i = 0; i < this.num; i++) {
		this.alive[i] = true;
		this.x[i] = 0;
		this.y[i] = 0;
		this.l[i] = 0;
		this.speed[i] = Math.random() * 0.05 + 0.05; // [0.05, 0.1)
		this.born(i);
	}
	this.origin.src = "./src/fruit.png";
	this.blue.src = "./src/blue.png";
}

fruitObj.prototype.draw = function() {
	
	for (var i = 0; i < this.num; i++) {
		if (this.alive[1]) {
			if (this.l[i] <= 14) {
				this.l[i] += this.speed[i] * deltaTime;
			} else {
				this.y[i] -= this.speed[i] * deltaTime;
			}
			ctx2.drawImage(this.origin, this.x[i] - this.l[i] * 0.5 , this.y[i] - this.l[i] * 0.5, this.l[i], this.l[i]);
		}
		
	}
}

fruitObj.prototype.born = function(i) {

	var aneId = Math.floor(Math.random() * ane.num);
	this.x[i] = ane.x[aneId];
	this.y[i] = canHeight - ane.len[aneId];
}