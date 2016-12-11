// 判断鱼和果实的距离
function momFruitCollision() {
	if(data.gameOver) {
		return;
	}
	for (var i = 0; i < fruit.num; i++) {
		if (fruit.alive[i]) {
			// 计算距离
			var l = calLength2(fruit.x[i], fruit.y[i], mom.x, mom.y);
			if (l < 1000) {
				fruit.dead(i);
				data.fruitNum++;
				mom.momBodyCount++;
				if (mom.momBodyCount > 7) {
					mom.momBodyCount = 7;
				}
				if (fruit.fruitType[i] == 'blue') {
					data.double = 2;
				}
				wave.born(fruit.x[i], fruit.y[i]);
			}
		}
	}
}

// 判断大鱼和小鱼的距离
function momBabyCollision() {
	for (var i = 0; i < fruit.num; i++) {
		if (fruit.alive[i]) {
			if (data.fruitNum > 0 && !data.gameOver) {
				// 计算距离
				var l = calLength2(baby.x, baby.y, mom.x, mom.y);
				if (l < 1000) {
					// 恢复到初始状态
					baby.babyBodyCount = 0;
					// data归零
					mom.momBodyCount = 0;
					// 更新述职
					data.addScore();
					halo.born(baby.x, baby.y);
				}
			}

		}
	}
}
