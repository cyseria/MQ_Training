// 判断鱼和果实的距离
function momFruitCollision() {
	for (var i = 0; i < fruit.num; i++) {
		if (fruit.alive[i]) {
			// 计算距离
			var l = calLength2(fruit.x[i], fruit.y[i], mom.x, mom.y);
			if (l < 900) {
				fruit.dead(i);
			}
		}
	}
}

// 判断大鱼和小鱼的距离
function momBabyCollision() {
	for (var i = 0; i < fruit.num; i++) {
		if (fruit.alive[i]) {
			// 计算距离
			var l = calLength2(baby.x, baby.y, mom.x, mom.y);
			if (l < 900) {
				// 恢复到初始状态
				baby.babyBodyCount = 0;
			}
		}
	}
}