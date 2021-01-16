class MySpriteText extends MySpriteSheet {
	/**
	 * Constructor for class MySpriteText
	 * Initializes this class by extendind MySpriteSheet
	 * @param {CGFScene} scene
	 * @param {String} text
	 */
	constructor(scene, text) {
		super(
			scene,
			null,
			'./scenes/images/fonts/oolite-font.png',
			16,
			16
		)
		this.text = text;
	}
	/**
	 * For every character in text this function gets its ascii value (spritesheet used has letters at ascii position)
	 * activates the cell at that position and displays a rectangle.
	 * Translate to the right to write the next character
	 */
	display() {
		this.scene.pushMatrix();
		this.scene.pushMaterial(this.spritesheetAppearance);
		this.scene.pushTexture(this.texture);

		this.scene.setActiveShaderSimple(this.shader);
		this.spritesheetAppearance.setTexture(this.texture);
		this.spritesheetAppearance.apply();

		let position = 0;

		for (let i = 0; i < this.text.length; i++) {
			position = this.text[i].charCodeAt(0);
			this.activateCellP(position);
			super.display();
			this.scene.translate(1, 0, 0);
		}


		this.scene.popTexture();
		this.scene.popMaterial();
		this.scene.popMatrix();
		this.scene.setActiveShaderSimple(this.scene.defaultShader);
	}
}