class MyGameSequence {
	constructor(gameboard) {
		this.gameMoves = [];
		this.gameboard = gameboard;
	}
	/**
	 * Adds a move to the game sequence
	 * @param {XMLScene} scene
	 * @param {MyPiece} piece Piece that is going to move
	 * @param {MyTile} initialTile Origin tile for the move (null for the stack)
	 * @param {MyTile} finalTile Destination tile for the move (null for the stack)
	 */
	addMove(scene, previous, newTile) {
		this.gameMoves.push([]);
		for (let i = 0; i < previous.length; i++) {
			this.gameMoves[this.gameMoves.length - 1].push(new MyGameMove(scene, previous[i][1], previous[i][0], previous[i][1].getTile(), this.gameboard));
		}
		this.gameMoves[this.gameMoves.length - 1].push(new MyGameMove(scene, null, null, newTile, this.gameboard));
	}
	/**
	 * Get method for the gameboard
	 */
	getBoard() {
		return this.gameboard;
	}
	/**
	 * Animates a move
	 * @param {Number} moveNumber number of the move to animate
	 */
	displayMove(moveNumber) {
		if (moveNumber < this.gameMoves.length) {
			for (let i = 0; i < this.gameMoves[moveNumber].length; i++) {
				this.gameMoves[moveNumber][i].animate();
			}
		}
	}
	replayMove(moveNumber){
		if (moveNumber < this.gameMoves.length) {
			for (let i = 0; i < this.gameMoves[moveNumber].length; i++) {
				this.gameMoves[moveNumber][i].replay();
			}
		}
	}
	/**
	 * Reset the game
	 */
	reset() {
		this.gameboard.reset();
	}
	refreshBoard() {
		this.gameboard.refresh();
	}
	/**
	 * Undoes a move
	 */
	undo() {
		if (this.gameMoves.length > 0) {
			for (let i = 0; i < this.gameMoves[this.gameMoves.length - 1].length; i++)
				this.gameMoves[this.gameMoves.length - 1][i].undo();
			this.gameMoves.pop();
			return true;
		}
		return false;
	}
	display() {
		this.gameboard.display();
	}
}