class MySpriteAnim extends MySpriteSheet {
	/**
	 *	Constructor for the class MySrpiteAnim that extends MySpriteSheet
	 * @param {CGFscene} scene	Current scene
	 * @param {String} spritesheetID SpriteSheet id
	 * @param {String} texturePath Path to the texture
	 * @param {Int} sizeM Number of horizontal images
	 * @param {Int} sizeN Number of vertical images
	 * @param {Int} startCell Startin Cell for the animation
	 * @param {Int} endCell Ending cell for the animation
	 * @param {Float} duration duration of the animation
	 */
	constructor(scene, spritesheetID, texturePath, sizeM, sizeN, startCell, endCell, duration) {
		super(scene, spritesheetID, texturePath, sizeM, sizeN);
		this.startCell = startCell;
		this.endCell = endCell;
		this.duration = duration;
		this.position = startCell; // Position of the cell that will be displayed
		this.elapsedTime = 0; // elapsed time since the begining of the program
		this.previousTime = 0; // time from previous update
	}
	/**
	 *	calculates the position of the cell that will be displayed based on time
	 * @param {Int} time Time since the begining of the program
	 */
	update(time) {
			this.elapsedTime = (time / 1000) % this.duration;
			this.position = this.startCell + Math.floor((this.endCell - this.startCell) / this.duration * this.elapsedTime);
	}
	/**
	 * Activates the cell at this.position and display it
	 */
	display() {
		this.scene.pushMatrix();
		this.scene.pushMaterial(this.spritesheetAppearance);
		this.scene.pushTexture(this.texture);

		this.spritesheetAppearance.setTexture(this.texture);
		this.spritesheetAppearance.apply();

		this.scene.setActiveShader(this.shader);

		this.activateCellP(this.position);
		super.display();

		this.scene.setActiveShader(this.scene.defaultShader);

		this.scene.popTexture();
		this.scene.popMaterial();
		this.scene.popMatrix();
	}
}