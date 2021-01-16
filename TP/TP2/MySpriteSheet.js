class MySpriteSheet extends CGFobject {
	/**
	 * Constructor for MySpriteSheet class
	 * This function initializes the Rectangle, the Appearence, the Texture and the Shader
	 * @param {CGFscene} scene current scene
	 * @param {String} id SpriteSheet id
	 * @param {String} texture Path to texture
	 * @param {Int} sizeM Number of horizontal images
	 * @param {Int} sizeN Number of vertical images
	 */
	constructor(scene, id, texture, sizeM, sizeN) {
		super(scene);
		this.scene = scene;
		this.id = id;
		this.sizeM = sizeM;
		this.sizeN = sizeN;

		this.rectangle = new MyRectangle(this.scene, 0, 0, 1, 1);

		this.spritesheetAppearance = new CGFappearance(this.scene);
		this.texture = new CGFtexture(this.scene, texture);

		this.shader = new CGFshader(this.scene.gl, "./shaders/sprite.vert", "./shaders/sprite.frag");
		this.shader.setUniformsValues({
			sizeM: sizeM,
			sizeN: sizeN
		});
	}
	/**
	 * Activates the cell at position (m, n)
	 * @param {Int} m Horizontal position of the cell
	 * @param {Int} n Vertical position of the cell
	 */
	activateCellMN(m, n) {
		this.shader.setUniformsValues({
			M: m,
			N: n
		});
	}
	/**
	 * Activates the cell at position p
	 * @param {Int} p Position of the cell
	 */
	activateCellP(p) {
		if (p >= this.sizeM * this.sizeN)
			return null;
		let n = Math.floor(p / this.sizeM);
		let m = p % this.sizeM;
		this.activateCellMN(m, n);
	}
	display() {
		this.rectangle.display();
	}
}