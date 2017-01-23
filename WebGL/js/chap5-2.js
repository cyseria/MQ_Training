/**
 * 纹理
 */

// 顶点着色器程序，GLSL ES语言
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    void main() {
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
    }
`;

// 片元着色器
var FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    varying vec2 v_TexCoord;
    void main() {
        vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
        vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
        gl_FragColor = color0 * color1;
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

    var n = initVertexBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
    }

    // 设置 canvas 背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 配置纹理
    if (!initTextures(gl, n)) {
        console.log('Failed to intialize the texture.');
        return;
    }
}


function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array([
        // 顶点坐标, 纹理坐标
        -0.5,  0.5,  0.5, 1.0,
        -0.5, -0.5,  0.0, 0.0,
         0.5,  0.5,  1.0, 1.0,
         0.5, -0.5,  1.0, 0.0,
    ]);
    var n = 4; // 点的个数

    // 创建缓冲区对象
    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }


    // 写入缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    // 将 verticesColors 数组中每个元素的大小（字节数）存储到FSIZE中
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

function initTextures(gl, n) {
    var texture0 =  gl.createTexture(); // 创建纹理对象
    var texture1 =  gl.createTexture(); // 创建纹理对象

    // 获取 u_Sampler 的存储位置
    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');

    var image0 = new Image(); // 创建一个image对象
    var image1 = new Image(); // 创建一个image对象

    image0.onload = function() {
        loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
    }
    image1.onload = function() {
        loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
    }

    image0.src = '../resources/sky.jpg';
    image1.src = '../resources/circle.gif';


    return true;
}

// 标记纹理单元是否已经就绪
var g_texUnit0 = false, g_texUnit1 = false;

function loadTexture(gl, n, texture, u_Sampler, image, texUint) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // 对纹理进行y轴反转

    if (texUint == 0) {
        // 开启0号纹理单元
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    } else {
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1 = true;
    }


    // 向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // 配置纹理图案
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // 将0号纹理传给着色器
    gl.uniform1i(u_Sampler, texUint);



    gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

    if (g_texUnit0 && g_texUnit1) {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
}
