
var TETRIS_ROWS = 20; // ��������
var TETRIS_COLS = 14; // ��������
var CELL_SIZE = 24; // ���Ӵ�С

var NO_BLOCK = false;  // û������0

var tetris_canvas; 
var tetris_ctx;

var curScore = 0; // ��ǰ����
var curSpeed = 1; // ��ǰ
var maxScore = 0; // ��߻���
var curScoreEle , curSpeedEle , maxScoreEle;
var curTimer;

var isPlaying = true; // ��ǰ�Ƿ���Ϸ�е����

var curFall; // �����µ����ĸ�����

// ��ά���飬��¼�����״̬���Ƿ��з��飩
var tetris_status = []; 
for (var i = 0; i < TETRIS_ROWS ; i++ )
{
	tetris_status[i] = [];
	for (var j = 0; j < TETRIS_COLS ; j++ )
	{
		tetris_status[i][j] = NO_BLOCK;
	}
}

// ���巽�����ɫ
var colors = ["#1abc9c", "#3498db", "#9b59b6", "#34495e", "#f1c40f", "#e74c3c", "#e67e22", "#95a5a6"];

// ���弸�ֿ��ܳ��ֵķ������
var blockArr = [
	// Z
	[
		{x: TETRIS_COLS / 2 - 1 , y:0 , color:1},
		{x: TETRIS_COLS / 2 , y:0 ,color:1},
		{x: TETRIS_COLS / 2 , y:1 ,color:1},
		{x: TETRIS_COLS / 2 + 1 , y:1 , color:1}
	],
	// ��Z
	[
		{x: TETRIS_COLS / 2 + 1 , y:0 , color:2},
		{x: TETRIS_COLS / 2 , y:0 , color:2},
		{x: TETRIS_COLS / 2 , y:1 , color:2},
		{x: TETRIS_COLS / 2 - 1 , y:1 , color:2}
	],
	// ��
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
	// ��L
	[
		{x: TETRIS_COLS / 2  , y:0 , color:5},
		{x: TETRIS_COLS / 2 , y:1, color:5},
		{x: TETRIS_COLS / 2  , y:2, color:5},
		{x: TETRIS_COLS / 2 - 1, y:2, color:5}
	],
	// ����
	[
		{x: TETRIS_COLS / 2 , y:0 , color:6},
		{x: TETRIS_COLS / 2 , y:1 , color:6},
		{x: TETRIS_COLS / 2 , y:2 , color:6},
		{x: TETRIS_COLS / 2 , y:3 , color:6}
	],
	// ��
	[
		{x: TETRIS_COLS / 2 , y:0 , color:7},
		{x: TETRIS_COLS / 2 - 1 , y:1 , color:7},
		{x: TETRIS_COLS / 2 , y:1 , color:7},
		{x: TETRIS_COLS / 2 + 1, y:1 , color:7}
	]
];

// ��ʼ�������µ��ķ���
var initBlock = function()
{
	var rand = Math.floor(Math.random() * blockArr.length);
	// ������������µ��ķ���
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

// ����canvas����ĺ���
var createCanvas = function(rows , cols , cellWidth, cellHeight)
{
	tetris_canvas = document.createElement("canvas");
	tetris_canvas.width = cols * cellWidth;
	tetris_canvas.height = rows * cellHeight;
	tetris_canvas.style.border = "1px solid black";
	tetris_ctx = tetris_canvas.getContext('2d');
	tetris_ctx.beginPath();

	// ��������
	for (var i = 1 ; i < TETRIS_ROWS ; i++) // ����
	{
		tetris_ctx.moveTo(0 , i * CELL_SIZE);
		tetris_ctx.lineTo(TETRIS_COLS * CELL_SIZE , i * CELL_SIZE);
	}
	for (var i = 1 ; i < TETRIS_COLS ; i++) //����
	{
		tetris_ctx.moveTo(i * CELL_SIZE , 0);
		tetris_ctx.lineTo(i * CELL_SIZE , TETRIS_ROWS * CELL_SIZE);
	}

	tetris_ctx.closePath(); 
	// ��������
	tetris_ctx.strokeStyle = "#aaa";
	tetris_ctx.lineWidth = 0.3;
	tetris_ctx.stroke();
}

// ���ƶ���˹�����״̬
var drawBlock = function()
{
	for (var i = 0; i < TETRIS_ROWS ; i++ )
	{
		for (var j = 0; j < TETRIS_COLS ; j++ )
		{
			// �з���ĵط�������ɫ
			if(tetris_status[i][j])
			{
				// ���������ɫ
				tetris_ctx.fillStyle = colors[tetris_status[i][j]];
				// ���ƾ���
				tetris_ctx.fillRect(j * CELL_SIZE + 1 
					, i * CELL_SIZE + 1, CELL_SIZE - 2 , CELL_SIZE - 2);
			}
			// û�з���ĵط����ư�ɫ
			else
			{
				// ���������ɫ
				tetris_ctx.fillStyle = 'white';
				// ���ƾ���
				tetris_ctx.fillRect(j * CELL_SIZE + 1 
					, i * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
			}
		}
	}
}



// �ж��Ƿ���һ������
var lineFull = function()
{
	// ���α���ÿһ��
	for (var i = 0; i < TETRIS_ROWS ; i++ )
	{
		var flag = true;
		// ������ǰ�е�ÿ����Ԫ��
		for (var j = 0 ; j < TETRIS_COLS ; j++ )
		{
			if(!tetris_status[i][j])
			{
				flag = false;
				break;
			}
		}
		// �����ǰ����ȫ���з�����,��������100,ʹ��localstorage��¼����
		if(flag)
		{
			curScoreEle.innerHTML = curScore+= 100;
			localStorage.setItem("curScore" , curScore);
			// �����ǰ���ִﵽ�������ޡ�
			if( curScore >= curSpeed * curSpeed * 500)
			{
				curSpeedEle.innerHTML = curSpeed += 1;
				// ʹ��Local Storage��¼curSpeed��
				localStorage.setItem("curSpeed" , curSpeed);
				clearInterval(curTimer);
				curTimer = setInterval("moveDown();" ,  500 / curSpeed);
			}
			// �ѵ�ǰ�е����з�������һ�С�
			for (var k = i ; k > 0 ; k--)
			{
				for (var l = 0; l < TETRIS_COLS ; l++ )
				{
					tetris_status[k][l] =tetris_status[k-1][l];
				}
			}
			// ������������»���һ�鷽��
			drawBlock();    
		}
	}
}
// ���Ʒ������µ���
var moveDown = function()
{
	// �����ܷ��µ������
	var canDown = true;    //��
	// ����ÿ�����飬�ж��Ƿ������µ�
	for (var i = 0 ; i < curFall.length ; i++)
	{
		// �ж��Ƿ��Ѿ���������¡�
		if(curFall[i].y >= TETRIS_ROWS - 1)
		{
			canDown = false;
			break;
		}
		// �ж���һ���Ƿ��з��顱, �����һ���з��飬�������µ�
		if(tetris_status[curFall[i].y + 1][curFall[i].x])
		{
			canDown = false;
			break;
		}
	}
	// ��������¡�����
	if(canDown)
	{
		// ������ǰ��ÿ������ı���ɫͿ�ɰ�ɫ
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// ���������ɫ
			tetris_ctx.fillStyle = 'white';
			// ���ƾ���
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
		}
		// ����ÿ������, ����ÿ�������y�����1��
		// Ҳ���ǿ��Ʒ��鶼�µ�һ��
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			cur.y ++;
		}
		// �����ƺ��ÿ������ı���ɫͿ�ɸ÷������ɫֵ
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// ���������ɫ
			tetris_ctx.fillStyle = colors[cur.color];
			// ���ƾ���
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
		}
	}
	// �������µ�
	else
	{
		// ����ÿ������, ��ÿ�������ֵ��¼��tetris_status������
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// ����з����Ѿ����������ˣ���������
			if(cur.y < 2)
			{
				// ���Local Storage�еĵ�ǰ����ֵ����Ϸ״̬����ǰ�ٶ�
				localStorage.removeItem("curScore");
				localStorage.removeItem("tetris_status");
				localStorage.removeItem("curSpeed");
				if(confirm("���Ѿ����ˣ��Ƿ����������"))
				{
					// ��ȡLocal Storage���maxScore��¼
					maxScore = localStorage.getItem("maxScore");
					maxScore = maxScore == null ? 0 : maxScore ;
					// �����ǰ���ִ���localStorage�м�¼����߻���
					if(curScore >= maxScore)
					{
						// ��¼��߻���
						localStorage.setItem("maxScore" , curScore);
					}
				}
				// ��Ϸ����
				isPlaying = false;
				// �����ʱ��
				clearInterval(curTimer);
				return;
			}
			// ��ÿ�����鵱ǰ����λ�ø�Ϊ��ǰ�������ɫֵ
			tetris_status[cur.y][cur.x] = cur.color;
		}
		// �ж��Ƿ��С�������������
		lineFull();
		// ʹ��Local Storage��¼����˹�������Ϸ״̬
		localStorage.setItem("tetris_status" , JSON.stringify(tetris_status));
		// ��ʼһ���µķ��顣
		initBlock();
	}
}
// �������Ʒ���ĺ���
var moveLeft = function()
{
	// �����ܷ����Ƶ����
	var canLeft = true;
	for (var i = 0 ; i < curFall.length ; i++)
	{
		// ����Ѿ���������ߣ���������
		if(curFall[i].x <= 0)
		{
			canLeft = false;
			break;
		}
		// ����ߵ�λ�����з��飬��������
		if (tetris_status[curFall[i].y][curFall[i].x - 1])
		{
			canLeft = false;
			break;
		}
	}
	// ���������
	if(canLeft)
	{
		// ������ǰ��ÿ������ı���ɫͿ�ɰ�ɫ
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// ���������ɫ
			tetris_ctx.fillStyle = 'white';
			// ���ƾ���
			tetris_ctx.fillRect(cur.x * CELL_SIZE +1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2, CELL_SIZE - 2);
		}
		// �������������µ��ķ���
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			cur.x --;
		}
		// �����ƺ��ÿ������ı���ɫͿ�ɷ����Ӧ����ɫ
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// ���������ɫ
			tetris_ctx.fillStyle = colors[cur.color];
			// ���ƾ���
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1  
				, cur.y * CELL_SIZE + 1, CELL_SIZE - 2 , CELL_SIZE - 2);
		}
	}
}
// �������Ʒ���ĺ���
var moveRight = function()
{
	// �����ܷ����Ƶ����
	var canRight = true;
	for (var i = 0 ; i < curFall.length ; i++)
	{
		// ����ѵ������ұߣ���������
		if(curFall[i].x >= TETRIS_COLS - 1)
		{
			canRight = false;
			break;
		}
		// ����ұߵ�λ�����з��飬��������
		if (tetris_status[curFall[i].y][curFall[i].x + 1])
		{
			canRight = false;
			break;
		}
	}
	// ���������
	if(canRight)
	{		
		// ������ǰ��ÿ������ı���ɫͿ�ɰ�ɫ
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// ���������ɫ
			tetris_ctx.fillStyle = 'white';
			// ���ƾ���
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1  
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2 , CELL_SIZE - 2);
		}
		// �������������µ��ķ���
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			cur.x ++;
		}
		// �����ƺ��ÿ������ı���ɫͿ�ɸ������Ӧ����ɫ
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// ���������ɫ
			tetris_ctx.fillStyle = colors[cur.color];
			// ���ƾ���
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2, CELL_SIZE -2);
		}
	}
}
// ������ת����ĺ���
var rotate = function()
{
	// �����¼�ܷ���ת�����
	var canRotate = true;
	for (var i = 0 ; i < curFall.length ; i++)
	{
		var preX = curFall[i].x;
		var preY = curFall[i].y;
		// ʼ���Ե�����������Ϊ��ת������,
		// i == 2ʱ��˵������ת������
		if(i != 2)
		{
			// ���㷽����ת���x��y����
			var afterRotateX = curFall[2].x + preY - curFall[2].y;
			var afterRotateY = curFall[2].y + curFall[2].x - preX;
			// �����ת������λ�����з��飬����������ת
			if(tetris_status[afterRotateY][afterRotateX + 1])
			{
				canRotate = false;
				break;
			}
			// �����ת��������Ѿ�����������߽߱�
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
			// �����ת��������Ѿ����������ұ߽߱�
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
	// �������ת
	if(canRotate)
	{
		// ����ת��ǰ��ÿ������ı���ɫͿ�ɰ�ɫ
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// ���������ɫ
			tetris_ctx.fillStyle = 'white';
			// ���ƾ���
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1  
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2, CELL_SIZE - 2);
		}
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var preX = curFall[i].x;
			var preY = curFall[i].y;
			// ʼ���Ե�����������Ϊ��ת������,
			// i == 2ʱ��˵������ת������
			if(i != 2)
			{
				curFall[i].x = curFall[2].x + 
					preY - curFall[2].y;
				curFall[i].y = curFall[2].y + 
					curFall[2].x - preX;
			}
		}
		// ����ת���ÿ������ı���ɫͿ�ɸ������Ӧ����ɫ
		for (var i = 0 ; i < curFall.length ; i++)
		{
			var cur = curFall[i];
			// ���������ɫ
			tetris_ctx.fillStyle = colors[cur.color];
			// ���ƾ���
			tetris_ctx.fillRect(cur.x * CELL_SIZE + 1 
				, cur.y * CELL_SIZE + 1 , CELL_SIZE - 2, CELL_SIZE - 2);
		}
	}
}

// �����¼�
window.onkeydown = function(evt)
{
	switch(evt.keyCode)
	{
		// ��
		case 40:
			if(!isPlaying)
				return;
			moveDown();
			break;
		// ��
		case 37:
			if(!isPlaying)
				return;
			moveLeft();
			break;
		// ��
		case 39:
			if(!isPlaying)
				return;
			moveRight();
			break;
		// ��
		case 38:
			if(!isPlaying)
				return;
			rotate();
			break;
	}
}


window.onload = function()
{
	// ����canvas���
	createCanvas(TETRIS_ROWS , TETRIS_COLS , CELL_SIZE , CELL_SIZE);
	document.body.appendChild(tetris_canvas);
	curScoreEle = document.getElementById("curScoreEle");
	curSpeedEle = document.getElementById("curSpeedEle");
	maxScoreEle = document.getElementById("maxScoreEle");
	// ��ȡLocal Storage���tetris_status��¼
	var tmpStatus = localStorage.getItem("tetris_status");
	tetris_status = tmpStatus == null ? tetris_status : JSON.parse(tmpStatus);
	// �ѷ���״̬���Ƴ���
	drawBlock();
	// ��ȡLocal Storage���curScore��¼
	curScore = localStorage.getItem("curScore");
	curScore = curScore == null ? 0 : parseInt(curScore);
	curScoreEle.innerHTML = curScore;
	// ��ȡLocal Storage���maxScore��¼
	maxScore = localStorage.getItem("maxScore");
	maxScore = maxScore == null ? 0 : parseInt(maxScore);
	maxScoreEle.innerHTML = maxScore;
	// ��ȡLocal Storage���curSpeed��¼
	curSpeed = localStorage.getItem("curSpeed");
	curSpeed = curSpeed == null ? 1 : parseInt(curSpeed);
	curSpeedEle.innerHTML = curSpeed;
	// ��ʼ�������µ��ķ���
	initBlock();
	// ����ÿ���̶�ʱ��ִ��һ�����¡�����
	curTimer = setInterval("moveDown();" ,  500 / curSpeed);
}