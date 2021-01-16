class MyTile extends MyComponent {
	constructor(scene, gameboard, piece = null) {
		super(scene, 'tile');
		this.scene = scene;
		this.gameboard = gameboard;
		this.piece = piece;

		super.addChild(new MyRectangle(scene, 0, 0, 0.395, 0.395));
		super.addTransformation(['translation', 0, 0.151, 0]);
		super.addTransformation(['rotation', 'x', 90]);
	}
	/**
	 * Sets piece on tile
	 * @param {MyPiece} piece
	 */
	setPiece(piece) {
		this.piece = piece;
	}
	/**
	 * Removes piece from tile
	 */
	unsetPiece() {
		let temp = this.piece;
		this.piece = null;
		return temp;
	}
	getPiece() {
		return this.piece;
	}
}