class MyGameMove {
	constructor(scene, piece, initialTile, finalTile, gameboard) {
		this.scene = scene;
		this.piece = piece === null ? finalTile.getPiece() : piece;
		this.initialTile = initialTile;
		this.finalTile = finalTile;
		this.gameboard = gameboard;
	}
	calculatePosition(xscale, yscale, zscale) {
		let finalPosition;
		let position;
		if (this.finalTile !== null)
			finalPosition = this.gameboard.getPosition(this.finalTile);
		else {
			if (this.piece instanceof MyPieceBlack)
				finalPosition = [2, 0, -1];
			else
				finalPosition = [2, 0, 1];
		}
		finalPosition[0] /= xscale;
		finalPosition[1] /= yscale;
		finalPosition[2] /= zscale;
		if (this.initialTile !== null) {
			position = this.gameboard.getPosition(this.initialTile);
			position[0] = position[0] / xscale - finalPosition[0];
			position[1] = position[1] / yscale - finalPosition[1];
			position[2] = position[2] / zscale - finalPosition[2];
		} else {
			if (this.piece instanceof MyPieceBlack)
				position = [2 / xscale - finalPosition[0], 0.15 / yscale - finalPosition[1], - 1 / zscale - finalPosition[2]];
			else
				position = [2 / xscale - finalPosition[0], 0.15 / yscale - finalPosition[1], 1 / zscale - finalPosition[2]];
		}
		return position;
	}
	animate() {
		let animation = new MyKeyframeAnimation(this.scene, 'id');


		let xscale = 0.1;
		let yscale = 0.01;
		let zscale = 0.25;
		if (this.initialTile !== this.finalTile) {
			let position = this.calculatePosition(xscale, yscale, zscale);
			let initial = new Keyframe(0);
			initial.addTranslation(position[0], 0, position[2]);
			initial.addRotation(0, 0, 0);
			initial.addScale(1, 1, 1);
			animation.addKeyframe(initial);

			let middle = new Keyframe(1);
			middle.addTranslation(position[0], position[1] + 0.5 / yscale, position[2]);
			middle.addRotation(0, 0, 0);
			middle.addScale(1, 1, 1);
			animation.addKeyframe(middle);

			let final = new Keyframe(2);
			final.addTranslation(0, 0, 0);
			final.addRotation(0, 0, 0);
			final.addScale(1, 1, 1);
			animation.addKeyframe(final);

			this.piece.animation = animation;
			this.scene.animations.push(animation);
		}
	}
	replay() {
		if (this.initialTile !== null) {
			if (this.finalTile !== null)
				this.gameboard.movePiece(this.initialTile, this.finalTile);
			else
				this.gameboard.unsetPiece(this.initialTile);
		} else
			this.gameboard.setPiece(this.finalTile, this.piece);
		this.animate();
	}
	undo() {
		if (this.initialTile !== null) {
			if (this.finalTile !== null)
				this.gameboard.movePiece(this.finalTile, this.initialTile);
			else
				this.gameboard.setPiece(this.initialTile, this.piece);
		} else
			this.gameboard.unsetPiece(this.finalTile);
		this.piece.animation = null;
	}
}