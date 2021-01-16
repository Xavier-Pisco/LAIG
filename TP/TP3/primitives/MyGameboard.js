class MyGameboard extends CGFobject {
	constructor(scene, material = 'greyMaterial', texture = 'clear') {
		super(scene);
		this.scene = scene;
		this.tiles = [];

		this.whitePieces = [];
		this.blackPieces = [];

		this.material = material;
		this.texture = texture;

		this.createBoard();
	}
	/**
	 * Creates the gameboard with 36 tiles and 8 pieces of each color
	 */
	createBoard() {
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 6; j++) {
				let tile = new MyTile(this.scene, this);
				let pieceSize = 0.395 + 0.005;
				tile.addTransformation(['translation', -3 * pieceSize + pieceSize * j, -3 * pieceSize + pieceSize * i, 0]);
				this.tiles.push(tile);
			}
		}
		for (let i = 0; i < 8; i++) {
			this.whitePieces.push(new MyPieceWhite(this.scene, 'whitePiece'));
			this.blackPieces.push(new MyPieceBlack(this.scene, 'blackPiece'));
		}
	}
	/**
	 * Returns a unused piece from a color's pieces
	 * @param {*} color Color of the player
	 */
	getFreePiece(color) {
		if (color === 'white') {
			for (let i = this.whitePieces.length - 1; i >= 0; i--) {
				if (this.whitePieces[i].getTile() === null)
					return this.whitePieces[i];
			}
		} else if (color === 'black') {
			for (let i = this.blackPieces.length - 1; i >= 0; i--) {
				if (this.blackPieces[i].getTile() === null)
					return this.blackPieces[i];
			}
		}
		return null;
	}
	/**
	 * Sets a piece on a tile
	 * @param {MyTile} tile Tile to set piece on
	 * @param {MyPiece} piece Piece to set on tile
	 */
	setPiece(tile, piece) {
		tile.setPiece(piece);
		piece.setTile(tile);
		return true;
	}
	/**
	 * Removes a piece from a tile and places it on stack
	 * @param {MyTile} tile Tile to remove from
	 */
	unsetPiece(tile) {
		let piece = tile.unsetPiece();
		if (piece !== null)
			piece.unsetTile();
		return piece;
	}
	/**
	 * Returns the piece on the tile
	 * @param {MyTile} tile Tile to get piece from
	 */
	getPiece(tile) {
		return tile.getPiece();
	}
	/**
	 * Return the tile where the piece is
	 * @param {MyPiece} piece Piece on the tile
	 */
	getTile(piece) {
		for (let tile of tiles) {
			if (tile.getPiece() === piece)
				return tile;
		}
		return null;
	}
	/**
	 * Returns the tile on position (x, y)
	 * @param {Number} x
	 * @param {Number} y
	 */
	getTile(x, y) {
		let p = y * 6 + x;
		return p < this.tiles.length ? this.tiles[p] : null;
	}
	getAllTilesAndPieces() {
		let result = [];
		for (let i = 0; i < this.tiles.length; i++) {
			if (this.tiles[i].getPiece() !== null) {
				result.push([this.tiles[i], this.tiles[i].getPiece()]);
			}
		}
		return result;
	}
	/**
	 * Returns the on screen position from the tile
	 * @param {MyTile} tile Tile to get position from
	 */
	getPosition(tile) {
		for (let i = 0; i < this.tiles.length; i++) {
			if (this.tiles[i] === tile) {
				let pieceSize = 0.395 + 0.005;
				return [(-3 + i % 6) * pieceSize, 0, (-3 + Math.floor(i / 6)) * pieceSize];
			}
		}
	}
	getNumber(tile) {
		for (let i = 0; i < this.tiles.length; i++) {
			if (this === tile) {
				return i;
			}
		}
	}
	/**
	 * Resets all pieces and tiles on the board
	 */
	reset() {
		for (let i = 0; i < this.tiles.length; i++) {
			this.tiles[i].unsetPiece();
		}
		for (let i = 0; i < this.whitePieces.length; i++) {
			this.whitePieces[i].unsetTile();
			this.whitePieces[i].animation = null;
			this.blackPieces[i].unsetTile();
			this.blackPieces[i].animation = null;
		}
	}
	/**
	 * Moves a piece from initialTile to finalTile
	 * @param {MyTile} initialTile Origin tile
	 * @param {MyTile} finalTile Destination tile
	 */
	movePiece(initialTile, finalTile) {
		let piece = initialTile.unsetPiece();
		if (piece !== null) {
			finalTile.setPiece(piece);
			piece.setTile(finalTile);
			return true;
		}
		return false;
	}
	toString() {
		let board = [[], [], [], [], [], []];
		for (let i = 0; i < this.tiles.length; i++) {
			let piece = this.tiles[i].getPiece();
			if (piece === null)
				board[Math.floor(i / 6)].push('empty');
			else {
				if (piece instanceof MyPieceBlack)
					board[Math.floor(i / 6)].push('Black');
				else
					board[Math.floor(i / 6)].push('Red');
			}
		}
		for (let i = 0; i < 6; i++) {
			board[i] = JSON.stringify(board[i]).replaceAll('"', '\'');
		}
		return JSON.stringify(board).replaceAll('"', '');
	}
	fromString(boardString, newTile) {
		let board = boardString.split(',').map((a) => a.replaceAll('[', '')).map((a) => a.replaceAll(']', ''));
		let whitePiece = 7;
		let blackPiece = 7;
		this.reset();
		for (let i = 0; i < board.length; i++) {
			if (i === newTile) {
			}
			else if (board[i] === 'Red') {
				this.setPiece(this.tiles[i], this.whitePieces[whitePiece--]);
			} else if (board[i] === 'Black') {
				this.setPiece(this.tiles[i], this.blackPieces[blackPiece--]);
			}
		}
		if (board[newTile] === 'Red')
			this.setPiece(this.tiles[newTile], this.whitePieces[whitePiece--]);
		else if (board[newTile] === 'Black')
			this.setPiece(this.tiles[newTile], this.blackPieces[blackPiece--]);
	}
	refresh() {
		for (let i = 0; i < this.whitePieces.length; i++) {
			this.whitePieces[i].animation = null;
			this.blackPieces[i].animation = null;
		}
	}
	/**
	 * Displays all the tiles and pieces
	 */
	display() {
		this.scene.pushMatrix();
		var currMaterial = this.scene.pushMaterial(this.material);
		var currTexture = this.scene.pushTexture(this.texture);

		currMaterial.setTexture(currTexture);
		currMaterial.setTextureWrap('REPEAT', 'REPEAT');
		currMaterial.apply();

		this.scene.gameOrchestrator.logPicking();
		for (let i = 0; i < this.tiles.length; i++) {
			if (this.scene.gameOrchestrator.animator.currentState === this.scene.gameOrchestrator.animator.states.playing)
				this.scene.registerForPick(i + 1, this.tiles[i]);
			this.tiles[i].display();
		}
		this.scene.clearPickRegistration();


		let pieceXscale = 0.1;
		let pieceYscale = 0.01;
		let pieceZscale = 0.25;

		let unusedPieces = 0;
		for (let i = 0; i < this.whitePieces.length; i++) {
			this.scene.pushMatrix();
			if (this.whitePieces[i].getTile() === null) {
				this.scene.translate(2, pieceYscale / 2 + (pieceYscale + 0.001) * unusedPieces, 1);
				unusedPieces++;
			}
			this.whitePieces[i].display();
			this.scene.popMatrix();
		}
		unusedPieces = 0;
		for (let i = 0; i < this.blackPieces.length; i++) {
			this.scene.pushMatrix();
			if (this.blackPieces[i].getTile() === null) {
				this.scene.translate(2, pieceYscale / 2 + (pieceYscale + 0.001) * unusedPieces, -1);
				unusedPieces++;
			}
			this.blackPieces[i].display();
			this.scene.popMatrix();
		}

		this.scene.popTexture();
		this.scene.popMaterial();
		this.scene.popMatrix();
	}
}