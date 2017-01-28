/**
 * 三维,LookAtTriangles, 按左右方向键旋转
 */

// 顶点着色器程序，GLSL ES语言
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ProjMatrix;
    varying vec4 v_Color;
    void main() {
        gl_Position = u_ProjMatrix * a_Position;
        v_Color = a_Color;
    }
`;

// 片元着色器
var FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    varying vec4 v_Color;
    void main() {
        gl_FragColor = v_Color;
    }
`;

function main() {
    var canvas = document.getElementById('webgl');
    var nf = document.getElementById('nearFar');

    var gl = getWebGLContext(canvas);

    // 初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    var n = initVertexBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
    }
    // 设置 canvas 背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 获取u_ProjMatrix和u_ModelMatrix的存储地址
    var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');

    // 设置视点，视线和上方向
    var projMatrix = new Matrix4();

    // 注册键盘事件响应函数
    document.onkeydown = function (ev) {
        keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf);
    }

    draw(gl, n, u_ProjMatrix, projMatrix, nf); // 绘制三角形
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
      // 顶点坐标和颜色
       0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // 绿色在后面
      -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
       0.5, -0.5,  -0.4,  1.0,  0.4,  0.4,

       0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // 黄色三角形在中间
      -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
       0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,

       0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // 蓝色在最前
      -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
       0.5, -0.5,   0.0,  1.0,  0.4,  0.4,
    ]);
    var n = 9; // 点的个数

    // 创建缓冲区对象
    var vertexColorBuffer = gl.createBuffer();
    if (!vertexColorBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // 写入缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color < 0) {
      console.log('Failed to get the storage location of a_Color');
      return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
}

var g_near = 0.0, g_far = 0.5;

function keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf) {
    switch (ev.keyCode) {
        case 39: // 右键
            g_near += 0.01;break;
        case 37: // 左
            g_near -= 0.01;break;
        case 38: // 上
            g_far += 0.01;break;
        case 40: // 下
            g_far -= 0.01;break;
        default:
            return;
    }

    draw(gl, n, u_ProjMatrix, projMatrix, nf);
}

function draw(gl, n, u_ProjMatrix, projMatrix, nf) {
    // 使用矩阵设置可视空间
    projMatrix.setOrtho(-1, 1, -1, 1, g_near, g_far);

    // 将视图矩阵传给u_ProjMatrix变量
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);

    // 显示当前的near和far值
    nf.innerHTML = 'near:' + Math.round(g_near  * 100)/100 + ' ,far: ' + Math.round(g_far * 100) / 100;

    gl.drawArrays(gl.TRIANGLES, 0, n);

}
