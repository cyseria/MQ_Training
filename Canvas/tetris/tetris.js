
var TETRIS_ROWS = 20; // 画板行数
var TETRIS_COLS = 14; // 画板列数
var CELL_SIZE = 24; // 格子大小

var NO_BLOCK = false;  // 没方块是0

var tetris_canvas; 
var tetris_ctx;

var curScore = 0; // 当前积分
var curSpeed = 1; // 当前
var maxScore = 0; // 最高积分
var curScoreEle , curSpeedEle , maxScoreEle;
var curTimer;

var isPlaying = true; // 当前是否游戏中的旗标

var curFall; // 正在下掉的四个方块

// 二维数组，记录方块的状态（是否有方块）
var tetris_status = []; 
for (var i = 0; i < TETRIS_ROWS ; i++ )
{
	tetris_status[i] = [];
	for (var j = 0; j < TETRIS_COLS ; j++ )
	{
		tetris_status[i][j] = NO_BLOCK;
	}
}

// 定义方块的颜色
var colors = ["#1abc9c", "#3498db", "#9b59b6", "#34495e", "#f1c40f", "#e74c3c", "#e67e22", "#95a5a6"];

// 定义几种可能出现的方块组合
var blockArr = [
	// Z
	[
		{x: TETRIS_COLS / 2 - 1 , y:0 , color:1},
		{x: TETRIS_COLS / 2 , y:0 ,color:1},
		{x: TETRIS_COLS / 2 , y:1 ,color:1},
		{x: TETRIS_COLS / 2 + 1 , y:1 , color:1}
	],
	// 反Z
	[
		{x: TETRIS_COLS / 2 + 1 , y:0 , color:2},
		{x: TETRIS_COLS / 2 , y:0 , color:2},
		{x: TETRIS_COLS / 2 , y:1 , color:2},
		{x: TETRIS_COLS / 2 - 1 , y:1 , color:2}
	],
	// 田
	[
		{x: TETRIS_COLS / 2 - 1 , y:0 , color:3},
		{x: TETRIS_COLS / 2 , y:0 ,  color:3},
		{x: TETRIS_COLS / 2 - 1 , y:1 , color:3},
		{x: TETRIS_COLS / 2 , y:1 , color:3}
	],
	// L
	[
		{x: TETRIS_COLS / 2 - 1 , y:0 , color:4},
		{x: TETRIS_COLS / 2 - 1, y:1 , color:4},
		{x: TETRIS_COLS / 2 - 1 , y:2 , color:4},
		{x: TETRIS_COLS / 2 , y:2 , color:4}
	],
	// 反L
	[
		{x: TETRIS_COLS / 2  , y:0 , color:5},
		{x: TETRIS_COLS / 2 , y:1, color:5},
		{x: TETRIS_COLS / 2  , y:2, color:5},
		{x: TETRIS_COLS / 2 - 1, y:2, color:5}
	],
	// 竖条
	[
		{x: TETRIS_COLS / 2 , y:0 , color:6},
		{x: TETRIS_COLS / 2 , y:1 , color:6},
		{x: TETRIS_COLS / 2 , y:2 , color:6},
		{x: TETRIS_COLS / 2 , y:3 , color:6}
	],
	// ┵
	[
		{x: TETRIS_COLS / 2 , y:0 , color:7},
		{x: TETRIS_COLS / 2 - 1 , y:1 , color:7},
		{x: TETRIS_COLS / 2 , y:1 , color:7},
		{x: TETRIS_COLS / 2 + 1, y:1 , color:7}
	]
];

// 初始化正在下掉的方块
var initBlock = function()
{
	var rand = Math.floor(Math.random() * blockArr.length);
	// 随机生成正在下掉的方块
	curFall = [
		{x: blockArr[rand][0].x , y: blockArr[rand][0].y
			, color: blockArr[rand][0].color},
		{x: blockArr[rand][1].x , y: blockArr[rand][1].y
			, color: blockArr[rand][1].color},
		{x: blockArr[rand][2].x , y: blockArr[rand][2].y
			, color: blockArr[rand][2].color},
		{x: blockArr[rand][3].x , y: blockArr[rand][3].y 
			, color: blockArr[rand][3].color}
	];
};

// 创建canvas组件的函数
var createCanvas = function(rows , cols , cellWidth, cellHeight)
{
	tetris_canvas = document.createElement("canvas");
	tetris_canvas.width = cols * cellWidth;
	tetris_canvas.height = rows * cellHeight;
	tetris_canvas.style.border = "1px solid black";
	tetris_ctx = tetris_canvas.getContext('2d');
	tetris_ctx.beginPath();

	// 绘制网格
	for (var i = 1 ; i < TETRIS_ROWS ; i++) // 横向
	{
		tetris_ctx.moveTo(0 , i * CELL_SIZE);
		tetris_ctx.lineTo(TETRIS_COLS * CELL_SIZE , i * CELL_SIZE);
	}
	for (var i = 1 ; i < TETRIS_COLS ; i++) //纵向
	{
		tetris_ctx.moveTo(i * CELL_SIZE , 0);
		tetris_ctx.lineTo(i * CELL_SIZE , TETRIS_ROWS * CELL_SIZE);
	}

	tetris_ctx.closePath(); 
	// 绘制线条
	tetris_ctx.strokeStyle = "#aaa";
	tetris_ctx.lineWidth = 0.3;
	tetris_ctx.stroke();
}

// 绘制俄罗斯方块的状态
var drawBlock = function()
{
	for (var i = 0; i < TETRIS_ROWS ; i++ )
	{
		for (var j = 0; j < TETRIS_COLS ; j++ )
		{
			// 有方块的地方绘制颜色
			if(tetris_status[i][j])
			{
				// 设置填充颜色
				tetris_ctx.fillStyle = colors[tetris_status[i][j]];
				// 绘制矩形
				tetris_ctx.fillRect(j * CELL_SIZE + 1 
					, i * CELL_SIZE + 1, CELL_SIZE - 2 , CELL_SIZE - 2);
			}
			// 没有方块的地方绘制白色
			else
			{
				// 设置填充颜色
				tetris_ctx.fillStyle = 'white';
				// 绘制矩形
				tetris_ctx.fillRect(j * CELL_SIZE + 1 
					, i * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
			}
		}
	}
}



// 判断是否有一行已满
var lineFull = function()
{
	// 依次遍历每一行
	for (var i = 0; i < TETRIS_ROWS ; i++ )
	{
		var flag = true;
		// 遍历当前行的每个单元格
		for (var j = 0 ; j < TETRIS_COLS ; j++ )
		{
			if(!tetris_status[i][j])
			{
				flag = false;
				break;
			}
		}
		// 如果当前行已全部有方块了,积分增加100,使用localstorage记录积分
		if(flag)
		{
			curScoreEle.innerHTML = curScore+= 100;
			localStorage.setItem("curScore" , curScore);
			// 如果当前积分达到升级极限。
			if( curScore >= curSpeed * curSpeed * 500)
			{
				curSpeedEle.innerHTML = curSpeed += 1;
				// 使用Local Storage记录curSpeed。
				localStorage.setItem("curSpeed" , curSpeed);
				clearInterval(curTimer);
				curTimer = setInterval("moveDown();" ,  500 / curSpeed);
			}
			// 把当前行的所有方块下移一行。
			for (var k = i ; k > 0 ; k--)
			{
				for (var l = 0; l < TETRIS_COLS ; l++ )
				{
					tetris_status[k][l] =tetris_status[k-1][l];
				}
			}
			// 消除方块后，重新绘制一遍方块
			drawBlock();    
		}
	}
}
// 控制方块向下掉。
var moveDown = function()
{
	// 定义能否下掉的旗标
	var canDown = true;    //①
	// 遍历每个方块，判断是否能向下掉
	for (var i = 0 ; i < curFall.length ; i++)
	{
		// 判断是否已经到“最底下”
		if(curFall[i].y >= TETRIS_ROWS - 1)
		{
			canDown = false;
			break;
		}
		// 判断下一格是否“有方块”, 如果下一格有方块，不能向下掉
		if(tetris_status[curFall[i].y + 1][curFall[i].x])
		{
			canDown = false;
			break;
		}
	}
	// 如果能向下“掉”
	if(canDown)
	{
		// 将下移前的每个方块的背景色涂成白色
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// 设置填充颜色
			tetris_ctx.fillStyle = 'white';
			// 绘制矩形
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
		}
		// 遍历每个方块, 控制每个方块的y坐标加1。
		// 也就是控制方块都下掉一格
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			cur.y ++;
		}
		// 将下移后的每个方块的背景色涂成该方块的颜色值
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// 设置填充颜色
			tetris_ctx.fillStyle = colors[cur.color];
			// 绘制矩形
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
		}
	}
	// 不能向下掉
	else
	{
		// 遍历每个方块, 把每个方块的值记录到tetris_status数组中
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// 如果有方块已经到最上面了，表明输了
			if(cur.y < 2)
			{
				// 清空Local Storage中的当前积分值、游戏状态、当前速度
				localStorage.removeItem("curScore");
				localStorage.removeItem("tetris_status");
				localStorage.removeItem("curSpeed");
				if(confirm("您已经输了！是否参数排名？"))
				{
					// 读取Local Storage里的maxScore记录
					maxScore = localStorage.getItem("maxScore");
					maxScore = maxScore == null ? 0 : maxScore ;
					// 如果当前积分大于localStorage中记录的最高积分
					if(curScore >= maxScore)
					{
						// 记录最高积分
						localStorage.setItem("maxScore" , curScore);
					}
				}
				// 游戏结束
				isPlaying = false;
				// 清除计时器
				clearInterval(curTimer);
				return;
			}
			// 把每个方块当前所在位置赋为当前方块的颜色值
			tetris_status[cur.y][cur.x] = cur.color;
		}
		// 判断是否有“可消除”的行
		lineFull();
		// 使用Local Storage记录俄罗斯方块的游戏状态
		localStorage.setItem("tetris_status" , JSON.stringify(tetris_status));
		// 开始一组新的方块。
		initBlock();
	}
}
// 定义左移方块的函数
var moveLeft = function()
{
	// 定义能否左移的旗标
	var canLeft = true;
	for (var i = 0 ; i < curFall.length ; i++)
	{
		// 如果已经到了最左边，不能左移
		if(curFall[i].x <= 0)
		{
			canLeft = false;
			break;
		}
		// 或左边的位置已有方块，不能左移
		if (tetris_status[curFall[i].y][curFall[i].x - 1])
		{
			canLeft = false;
			break;
		}
	}
	// 如果能左移
	if(canLeft)
	{
		// 将左移前的每个方块的背景色涂成白色
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// 设置填充颜色
			tetris_ctx.fillStyle = 'white';
			// 绘制矩形
			tetris_ctx.fillRect(cur.x * CELL_SIZE +1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2, CELL_SIZE - 2);
		}
		// 左移所有正在下掉的方块
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			cur.x --;
		}
		// 将左移后的每个方块的背景色涂成方块对应的颜色
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// 设置填充颜色
			tetris_ctx.fillStyle = colors[cur.color];
			// 绘制矩形
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1  
				, cur.y * CELL_SIZE + 1, CELL_SIZE - 2 , CELL_SIZE - 2);
		}
	}
}
// 定义右移方块的函数
var moveRight = function()
{
	// 定义能否右移的旗标
	var canRight = true;
	for (var i = 0 ; i < curFall.length ; i++)
	{
		// 如果已到了最右边，不能右移
		if(curFall[i].x >= TETRIS_COLS - 1)
		{
			canRight = false;
			break;
		}
		// 如果右边的位置已有方块，不能右移
		if (tetris_status[curFall[i].y][curFall[i].x + 1])
		{
			canRight = false;
			break;
		}
	}
	// 如果能右移
	if(canRight)
	{		
		// 将右移前的每个方块的背景色涂成白色
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// 设置填充颜色
			tetris_ctx.fillStyle = 'white';
			// 绘制矩形
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1  
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
		}
		// 右移所有正在下掉的方块
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			cur.x ++;
		}
		// 将右移后的每个方块的背景色涂成各方块对应的颜色
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// 设置填充颜色
			tetris_ctx.fillStyle = colors[cur.color];
			// 绘制矩形
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2, CELL_SIZE -2);
		}
	}
}
// 定义旋转方块的函数
var rotate = function()
{
	// 定义记录能否旋转的旗标
	var canRotate = true;
	for (var i = 0 ; i < curFall.length ; i++)
	{
		var preX = curFall[i].x;
		var preY = curFall[i].y;
		// 始终以第三个方块作为旋转的中心,
		// i == 2时，说明是旋转的中心
		if(i != 2)
		{
			// 计算方块旋转后的x、y坐标
			var afterRotateX = curFall[2].x + preY - curFall[2].y;
			var afterRotateY = curFall[2].y + curFall[2].x - preX;
			// 如果旋转后所在位置已有方块，表明不能旋转
			if(tetris_status[afterRotateY][afterRotateX + 1])
			{
				canRotate = false;
				break;
			}
			// 如果旋转后的坐标已经超出了最左边边界
			if(afterRotateX < 0 || tetris_status[afterRotateY - 1][afterRotateX])
			{
				moveRight();
				afterRotateX = curFall[2].x + preY - curFall[2].y;
				afterRotateY = curFall[2].y + curFall[2].x - preX;
				break;
			}
			if(afterRotateX < 0 || tetris_status[afterRotateY-1][afterRotateX])
			{
				moveRight();
				break;
			}
			// 如果旋转后的坐标已经超出了最右边边界
			if(afterRotateX >= TETRIS_COLS - 1 || 
				tetris_status[afterRotateY][afterRotateX+1])
			{
				moveLeft();
				afterRotateX = curFall[2].x + preY - curFall[2].y;
				afterRotateY = curFall[2].y + curFall[2].x - preX;
				break;
			}
			if(afterRotateX >= TETRIS_COLS - 1 || 
				tetris_status[afterRotateY][afterRotateX+1])
			{
				moveLeft();
				break;
			}
		}
	}
	// 如果能旋转
	if(canRotate)
	{
		// 将旋转移前的每个方块的背景色涂成白色
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// 设置填充颜色
			tetris_ctx.fillStyle = 'white';
			// 绘制矩形
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1  
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2, CELL_SIZE - 2);
		}
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var preX = curFall[i].x;
			var preY = curFall[i].y;
			// 始终以第三个方块作为旋转的中心,
			// i == 2时，说明是旋转的中心
			if(i != 2)
			{
				curFall[i].x = curFall[2].x + 
					preY - curFall[2].y;
				curFall[i].y = curFall[2].y + 
					curFall[2].x - preX;
			}
		}
		// 将旋转后的每个方块的背景色涂成各方块对应的颜色
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// 设置填充颜色
			tetris_ctx.fillStyle = colors[cur.color];
			// 绘制矩形
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2, CELL_SIZE - 2);
		}
	}
}

// 按键事件
window.onkeydown = function(evt)
{
	switch(evt.keyCode)
	{
		// 下
		case 40:
			if(!isPlaying)
				return;
			moveDown();
			break;
		// 左
		case 37:
			if(!isPlaying)
				return;
			moveLeft();
			break;
		// 右
		case 39:
			if(!isPlaying)
				return;
			moveRight();
			break;
		// 上
		case 38:
			if(!isPlaying)
				return;
			rotate();
			break;
	}
}


window.onload = function()
{
	// 创建canvas组件
	createCanvas(TETRIS_ROWS , TETRIS_COLS , CELL_SIZE , CELL_SIZE);
	document.body.appendChild(tetris_canvas);
	curScoreEle = document.getElementById("curScoreEle");
	curSpeedEle = document.getElementById("curSpeedEle");
	maxScoreEle = document.getElementById("maxScoreEle");
	// 读取Local Storage里的tetris_status记录
	var tmpStatus = localStorage.getItem("tetris_status");
	tetris_status = tmpStatus == null ? tetris_status : JSON.parse(tmpStatus);
	// 把方块状态绘制出来
	drawBlock();
	// 读取Local Storage里的curScore记录
	curScore = localStorage.getItem("curScore");
	curScore = curScore == null ? 0 : parseInt(curScore);
	curScoreEle.innerHTML = curScore;
	// 读取Local Storage里的maxScore记录
	maxScore = localStorage.getItem("maxScore");
	maxScore = maxScore == null ? 0 : parseInt(maxScore);
	maxScoreEle.innerHTML = maxScore;
	// 读取Local Storage里的curSpeed记录
	curSpeed = localStorage.getItem("curSpeed");
	curSpeed = curSpeed == null ? 1 : parseInt(curSpeed);
	curSpeedEle.innerHTML = curSpeed;
	// 初始化正在下掉的方块
	initBlock();
	// 控制每隔固定时间执行一次向下”掉“
	curTimer = setInterval("moveDown();" ,  500 / curSpeed);
}