// Solution file for HW7: WebGL Rendered, Part 1
// COMP 630 W'16 - Computer Graphics
// Phillips Academy
// 2016-05-19
//
// By Amy Chou

"use strict";
var neheTexture;
var canvas;
var gl;

window.onload = function init()
{
    // Create the WebGL context.
    // This allows us to use WebGL functions such as bindBuffer.
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Vertices of the letter A
    var vertices = [
        vec4( -1, -1, 0, 1 ),
        vec4(  1,  -1, 0, 1 ),
        vec4( 0, 1, 0, 1)
    ];

    // Triangle mesh of the letter A
    var tris = [[0, 1, 2]]

    // Convert tris to a 1-D array in row-major order
    tris = flatten(tris);

    //  Configure WebGL - (0, 0) specifies the lower left corner of the viewport
    // rectangle, in pixels. canvas.width and canvas.height specifies the width
    // and heigh of viewport
    gl.viewport( 0, 0, canvas.width, canvas.height );
    // Set background to white when cleared
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU.
    // To do this, we associate out shader variables with our data buffer
    // (i.e. location on GPU where you send your data to be processed) by
    // binding to the buffer: specifying a location where we're sending
    // data form the OpenGL state machine
    // (1) gl.createBuffer: create and get identifier buffer
    // (2) gl.bindBuffer: pass in the buffer type we wish to bind to
    //    (g1.ARRAY_BUFFER or g1.ELEMENT_ARRAY_BUFFER in this case)
    // (3) gl.bufferData: put data in VBO, pass in gl.STATIC_DRAW to indicate to
    //      send once and display them
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,
      new Float32Array(flatten(vertices)), gl.STATIC_DRAW );

    var bufferId2 = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, bufferId2 );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(flatten(tris)), gl.STATIC_DRAW );

    // Link shader variables:
    // (1) call to gl.getAttribLocation returns the index of attribute vPosition
    // in vertex shader
    // (2) gl.vertexAttribPointer describes form of data
    //      - second and third parameters say that elements in pointsArray
    //        are each two floating-point numbers
    //      - fourth parameter = false: do not want data normalized to [0, 1]
    //      - fifth parameter = 0: values in array are contiguous
    //      - sixth parameter = 0: begin at address 0 in data buffer
    // (3) gl.enableVertexAttribArray enables attribute vPosition
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );



    program.textureCoordAttribute = gl.getAttribLocation(program, "aTextureCoord");
    gl.enableVertexAttribArray(program.textureCoordAttribute);

    program.samplerUniform = gl.getUniformLocation(program, "uSampler");
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, neheTexture);
    gl.uniform1i(program.samplerUniform, 0);

    initTexture();
    var cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    var textureCoords = [
      // Front face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    cubeVertexTextureCoordBuffer.itemSize = 2;
    cubeVertexTextureCoordBuffer.numItems = 3;





    // clear buffer currently enabled for color writing
    gl.clear( gl.COLOR_BUFFER_BIT );
    // draw the image
    gl.drawElements( gl.TRIANGLES, tris.length, gl.UNSIGNED_SHORT, 0);
};

function initTexture() {
    neheTexture = gl.createTexture();
    neheTexture.image = new Image();
    neheTexture.image.onload = function() {
      handleLoadedTexture(neheTexture)
    }

    neheTexture.image.src = "bird1.jpg";
  }
  function handleLoadedTexture(texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }