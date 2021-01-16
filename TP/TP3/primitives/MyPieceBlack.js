class MyPieceBlack extends MyPiece {
	constructor(scene, id) {
		super(scene, id);
		super.material = 'blackMaterial';
		super.texture = 'clear';
	}
}