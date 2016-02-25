"use strict";

window.onload = function init()
{
  // Create the WebGL context.
  // This allows us to use WebGL functions such as bindBuffer.
    var canvas = document.getElementById( "gl-canvas" );
    var gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Create bird vertices array, triangle indices, and normals
    var shape = bird();
    var ftv = birdFaceToVertProperties(shape.verts, shape.tris, shape.norms);
    var verts = ftv.verts;
    var tris = ftv.tris;
    var norms = ftv.norms;

    //  Configure WebGL - (0, 0) specifies the lower left corner of the viewport
    // rectangle, in pixels. canvas.width and canvas.height specifies the width
    // and heigh of viewport
    gl.viewport( 0, 0, canvas.width, canvas.height );
    // Set background to white when cleared
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    // enable hidden-surface removal
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load normals data into the GPU
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(norms), gl.STATIC_DRAW );
    // Link to the attribute "normal" in the shader
    var normalLoc = gl.getAttribLocation( program, "normal" );
    gl.vertexAttribPointer( normalLoc , 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( normalLoc );

    // Load vertex data into GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,
      new Float32Array(flatten(verts)), gl.STATIC_DRAW );
    // Load triangle indices data into GPU
    var bufferId2 = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, bufferId2 );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(flatten(tris)), gl.STATIC_DRAW );
    // Link to the attribute "vPosition" in the shader
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements( gl.TRIANGLES, tris.length, gl.UNSIGNED_SHORT, 0);


};

function birdFaceToVertProperties(verts, tris, norms){
  var new_verts = [
    verts[0], verts[2], verts[1],
    verts[0], verts[3], verts[2],
    verts[4], verts[7], verts[3],
    verts[4], verts[3], verts[0],
    verts[5], verts[4], verts[0],
    verts[5], verts[0], verts[1],
    verts[5], verts[1], verts[2],
    verts[5], verts[2], verts[6],
    verts[6], verts[2], verts[3],
    verts[6], verts[3], verts[7],
    verts[5], verts[6], verts[4],
    verts[4], verts[6], verts[7]
  ];

  var new_tris = [
    0, 1, 2,
    3, 4, 5,
    6, 7, 8,
    9, 10, 11,
    12, 13, 14,
    15, 16, 17,
    18, 19, 20,
    21, 22, 23,
    24, 25, 26,
    27, 28, 29,
    30, 31, 32,
    33, 34, 35
  ];

  var new_norms = [];
  for (var i = 0; i < norms.length; i ++){
    new_norms.push(norms[i]);
    new_norms.push(norms[i]);
    new_norms.push(norms[i]);
  }

  return {
    verts: new_verts,
    tris: new_tris,
    norms: new_norms
  };
}

function bird() {
  var verts = [
    vec4(1, 1, 1, 1),
    vec4(-1, 1, 1, 1),
    vec4(-1, 1, -1, 1),
    vec4(1, 1, -1, 1),
    vec4(1, -1, 1, 1),
    vec4(-1, -1, 1, 1),
    vec4(-1, -1, -1, 1),
    vec4(1, -1, -1, 1)
  ];

  var tris = [
    [0, 2, 1],
    [0, 3, 2],
    [4, 7, 3],
    [4, 3, 0],
    [5, 4, 0],
    [5, 0, 1],
    [5, 1, 2],
    [5, 2, 6],
    [6, 2, 3],
    [6, 3, 7],
    [5, 6, 4],
    [4, 6, 7]];

  var norms = []
  for (var i = 0; i < tris.length; i ++ ){
    var side1 = subtract(verts[tris[i][1]], verts[tris[i][0]]);
    var side2 = subtract(verts[tris[i][2]], verts[tris[i][0]]);
    var normal = vec4(normalize(cross(side1, side2)), 0);
    norms.push(normal);
  }

  tris = flatten(tris);

  return {
    verts: verts,
    tris: tris,
    norms: norms
  };
}
