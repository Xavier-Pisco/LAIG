
#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;

uniform float sizeM;
uniform float sizeN;
uniform float N;
uniform float M;

void main() {
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

	float horizontalRatio = 1. / sizeM;
	float verticalRatio = 1. / sizeN;

	//vTextureCoord = aTextureCoord;

	vTextureCoord = vec2(aTextureCoord.s * horizontalRatio + horizontalRatio * M, aTextureCoord.t * verticalRatio + verticalRatio * N);
}