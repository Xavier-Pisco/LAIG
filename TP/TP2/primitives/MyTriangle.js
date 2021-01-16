/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */

class MyTriangle extends CGFobject {
    /**
     *
     * @param {XMLscene} scene - XMLscene object
     * @param {float} x1
     * @param {float} y1
     * @param {float} x2
     * @param {float} y2
     * @param {float} x3
     * @param {float} y3
     */
	constructor(scene, x1, y1, x2, y2, x3, y3) {
        super(scene);

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;

		this.initBuffers();
	}

	/**
	 * @method initBuffers
	 */
    initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y2, 0,	//1
			this.x3, this.y3, 0,	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			1, 0, 2
		];

		this.normals = [];
		for (var i = 0; i < 3; i++){
			this.normals.push(0,0,1);
		}

		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0
		]

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
	updateTexCoords(afs,aft){

		let a = Math.sqrt(Math.pow((this.x1 - this.x2),2) + Math.pow((this.y1 - this.y2),2));
		let b = Math.sqrt(Math.pow((this.x2 - this.x3),2) + Math.pow((this.y2 - this.y3),2));
		let c = Math.sqrt(Math.pow((this.x1 - this.x3),2) + Math.pow((this.y1 - this.y3),2));

		let cosalpha = (a*a - b*b + c*c)/(2*a*c);
		let sinalpha = Math.sqrt(1 - cosalpha*cosalpha);

		this.texCoords = [
			0, 0,
			a/afs, 0,
			c*cosalpha/afs, c*sinalpha/aft
		]

		this.updateTexCoordsGLBuffers();
	}
}