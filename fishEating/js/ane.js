// 海葵

var aneObj = function () {
	// 开始点，结束点， 控制点
	this.rootx = [];
	this.headx = [];
	this.heady = [];
	this.amp = [];
	this.alpha = 0;
}
aneObj.prototype.num = 50;

aneObj.prototype.init = function() {
	for (var i = 0; i < this.num; i++) {
		this.rootx[i] = i * 16 + Math.random() * 20;
		this.headx[i] = this.rootx[i];
		this.heady[i] = canHeight - 300 + Math.random() * 50;
		this.amp[i] = Math.random() * 50 + 100;
	}
}

aneObj.prototype.draw = function() {
	this.alpha += deltaTime * 0.001;
	var l = Math.sin(this.alpha); //[-1,1]
	ctx2.save();
	ctx2.globalAlpha = 0.6;
	ctx2.lineWidth = 20;
	ctx2.lineCap = "round";
	ctx2.strokeStyle = "#3b1541";
	ctx2.globalAlpha = 0.6;
	for (var i = 0; i < this.num; i++) {
		ctx2.beginPath();
		ctx2.moveTo(this.rootx[i], canHeight);
		this.headx[i] = this.rootx[i] + l * this.amp[i]
		// console.log(this.rootx[i] + "," + this.headx[i] + "," + l);
		ctx2.quadraticCurveTo(this.rootx[i], canHeight - 100, this.headx[i], this.heady[i]);
		ctx2.stroke();
	}
	ctx2.restore();
}
