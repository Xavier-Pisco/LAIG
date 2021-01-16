class MyPieceWhite extends MyPiece {
	constructor(scene, id) {
		super(scene, id);
		super.material = 'whiteMaterial';
		super.texture = 'clear';
	}
}