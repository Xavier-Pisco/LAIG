class MyPiece extends MyComponent {
	constructor(scene, id) {
		super(scene, id);
		super.addChild(this.scene.getComponent('cube'));
		super.addTransformation(['scale', 0.1, 0.01, 0.25]);
		this.tile = null;
	}
	getTile() {
		return this.tile;
	}
	setTile(tile) {
		this.tile = tile;
	}
	unsetTile() {
		this.tile = null;
	}
	display(){
		if (this.tile != null) {
			this.scene.pushMatrix();
			var matrix = this.tile.getTransformations();
			this.scene.multMatrix(matrix);
			this.scene.rotate(-Math.PI / 2, 1, 0, 0);
			this.scene.translate(0.2, 0.01, 0.2);
			super.display();

			this.scene.popMatrix();
		} else {
			this.scene.pushMatrix();
			this.scene.translate(0.2, 0.01, 0.2);
			super.display();

			this.scene.popMatrix();
		}
	}
}