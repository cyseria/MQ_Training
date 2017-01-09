// 顶点着色器程序，GLSL ES语言
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;

    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
    }
`;

// 片元着色器
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
`;


function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);

    // 初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    // 顶点变量
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');


    canvas.onmousedown = function (e) {
        click(e, gl, canvas, a_Position, u_FragColor);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT); // 用背景色填充

}

var g_points = [];
var g_colors = [];
function click(e, gl, canvas, a_Position, u_FragColor) {
    var x = e.clientX;
    var y = e.clientY;
    var rect = e.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.height/2) / (canvas.height/2);
    y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);
    // 将坐标存储到g_points函数中
    g_points.push([x,y]);

    if (x >= 0.0 && y >= 0.0) { // 第一象限红色
        g_colors.push([1.0, 0.0, 0.0, 1.0]);
    } else if (x < 0.0 && y < 0.0) { // 第三象限绿色
        g_colors.push([0.0, 1.0, 0.0, 1.0]);
    } else {
        g_colors.push([1.0, 1.0, 1.0, 1.0]); // 二四象限白色
    }

    // 清除canvas
    gl.clear(gl.COLOR_BUFFER_BIT); // 用背景色填充

    var len = g_points.length;
    for (var i = 0; i < len; i++) {
        var xy = g_points[i];
        var rgba = g_colors[i];
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3])
        gl.drawArrays(gl.POINTS, 0, 1);
    }

}
