class MyGameOrchestrator {
	constructor(scene) {
		this.scene = scene;
		this.currentPlayer = 'white';
		this.playTime = 15;
		this.gameboard = new MyGameboard(this.scene);
		this.gameSequence = new MyGameSequence(this.gameboard);
		this.animator = new MyAnimator(this.scene, this.gameSequence, this.playTime);
		this.animator.currentState = this.animator.states.paused;
		this.games = [];
		this.currentGame = null;
		this.theme = null;
		this.prolog = new MyPrologInterface(this);

		this.states = {
			menu: 0,
			playing: 1,
			replay: 2
		}
		this.currentState = this.states.menu;

		this.whiteWins = 0;
		this.blackWins = 0;
		this.scoreboard = [new MySpriteText(this.scene, 'White'),new MySpriteText(this.scene, '' + this.whiteWins),new MySpriteText(this.scene, 'Black'), new MySpriteText(this.scene, '' + this.blackWins)];
		this.types = [];
		this.types['P vs P'] = true;
		this.types['P vs C'] = false;
		this.types['C vs C'] = false;
		this.currentType = 'P vs P';

		this.pc = [];
		this.pc['status'] = false;

		this.difficulties = [];
		this.difficulties['easy'] = true;
		this.difficulties['hard'] = false;
		this.currentDifficulty = 'easy';
	}
	update(time) {
		if (this.currentState !== this.states.menu) {
			this.animator.update(time);
		}
		// Computer playing randomly (to delete when prolog bot is implemented)
		if (this.animator !== null && this.animator.currentState === this.animator.states.playing && !this.types['P vs P']) { // Ads random moves for bots
			if (((this.types['P vs C'] && this.currentPlayer === 'black') || (this.types['C vs C'])) && !this.pc['status']) {
				this.pc['status'] = true;
				let player = this.currentPlayer === 'black' ? 1 : 2;
				if (this.difficulties['easy'])
					this.prolog.getPrologRequest('choose_move_easy(' + this.gameboard.toString() + ',' + player + ')', this.parsePCResponse.bind(this));
				else
					this.prolog.getPrologRequest('choose_move_hard(' + this.gameboard.toString() + ',' + player + ')', this.parsePCResponse.bind(this));
			}
		}
	}
	parsePCResponse(data) {
		console.log('Received responde: ' + data.target.response);
		this.prolog.receivedResponse = true;
		let response = data.target.response;
		let row = response[1] - 1;
		let column = response[3] - 1;
		let move = 6 * row + column;
		this.move(move);
	}
	/**
	 * Handles change in type
	 */
	changeType() {
		if (this.currentState !== this.states.playing) {
			if (this.currentType === 'P vs P') {
				this.types['P vs P'] = true;
				this.types['P vs C'] = false;
				this.types['C vs C'] = false;
			} else if (this.currentType === 'P vs C') {
				this.types['P vs P'] = false;
				this.types['P vs C'] = true;
				this.types['C vs C'] = false;
			} else if (this.currentType === 'C vs C') {
				this.types['P vs P'] = false;
				this.types['P vs C'] = false;
				this.types['C vs C'] = true;
			}
		}
	}
	/**
	 * Handles change in difficulty
	 */
	changedifficulty() {
		if (this.currentDifficulty === 'easy') {
			this.difficulties['easy'] = true;
			this.difficulties['hard'] = false;
		} else {
			this.difficulties['easy'] = false;
			this.difficulties['hard'] = true;
		}
	}
	/**
	 * Executes a move based on a selected tile
	 * @param {MyTile} tile tile that was selected
	 */
	move(tileNumber) {
		let tile = this.gameboard.tiles[tileNumber];
		if (this.currentSequence !== null) {
			if (tile.getPiece() === null) {
				const piece = this.gameSequence.getBoard().getFreePiece(this.currentPlayer);
				if (piece !== null) {
					let player = this.currentPlayer === 'black' ? 'Black' : 'Red';
					this.prolog.getPrologRequest('move(' + this.gameboard.toString() + ',' + JSON.stringify([Math.floor(tileNumber / 6) + 1, tileNumber % 6 + 1, player]).replaceAll('"', '\'') + ')', this.waitMoveResponse.bind(this, [tileNumber]));
					return true;
				}
			}
		}
		return false;
	}
	/**
	 * Waits for a prolog response after a move
	 * @param {*} args
	 * @param {*} data
	 */
	waitMoveResponse(args, data) {
		console.log('Received responde: ' + data.target.response);
		this.prolog.receivedResponse = true;
		this.makeMove(data.target.response, args[0]);
	}
	/**
	 * Executes a move based on prolog response and sends a request to prolog to see if there is a winner
	 * @param {String} boardString
	 * @param {Number} tileNumber
	 */
	makeMove(boardString, tileNumber) {
		let previous = this.gameboard.getAllTilesAndPieces();
		this.gameboard.fromString(boardString, tileNumber);
		this.gameSequence.addMove(this.scene, previous, this.gameboard.tiles[tileNumber]);
		this.prolog.getPrologRequest('game_over(' + this.gameboard.toString() + ')', this.checkWinner.bind(this)); // Requests prolog to see if there is a winner
	}
	/**
	 * Checks if there is winner based on prolog response
	 * @param {String} data
	 */
	checkWinner(data) {
		let response = data.target.response;
		if (response == 1)
			this.blackWin();
		else if (response == 2)
			this.whiteWin();
		else
			this.changePlayer();
	}
	/**
	 * Handles Pause/Continue button
	 */
	pause() {
		if (this.currentState === this.states.playing)
			this.animator.pause('Play');
		else if (this.currentState === this.states.replay)
			this.animator.pause('Replay');

	}
	/**
	 * Handles replay button
	 */
	replay() {
		if (this.animator.ended)
			this.currentState = this.states.replay;
		else
			this.currentState = this.states.playing;
		this.animator.replay();
	}
	/**
	 * Undoes a move
	 */
	undo() {
		if (this.animator.undo())
			this.changePlayer();
	}
	/**
	 * Starts a new game while preserving all the older ones
	 */
	start() {
		this.currentState = this.states.menu;
		this.gameboard = new MyGameboard(this.scene);
		this.gameSequence = new MyGameSequence(this.gameboard);
		this.animator = new MyAnimator(this.scene, this.gameSequence, this.playTime);
		this.games.push(this.animator);
		this.currentGame = this.games.length - 1;
		this.animator.reset();
		this.scene.interface.resetPastGamesGUI();
		this.currentPlayer = 'white';
		this.changeType();
		this.changedifficulty();
		this.currentState = this.states.playing;
	}
	/**
	 * Updates the text on the scoreboards
	 */
	updateScoreboard() {
		this.scoreboard[1].changeText(''+this.whiteWins);
		this.scoreboard[3].changeText(''+this.blackWins);
	}
	/**
	 * Handles a black victory
	 */
	blackWin() {
		this.blackWins++;
		this.updateScoreboard();
		this.animator.ended = true;
		this.currentState = this.states.menu;
		this.changeType();
	}
	/**
	 * Handles a white victory
	 */
	whiteWin() {
		this.whiteWins++;
		this.updateScoreboard();
		this.animator.ended = true;
		this.currentState = this.states.menu;
		this.changeType();
	}
	/**
	 * Attributes a win when a player times out
	 */
	timeOver() {
		if (this.currentPlayer === 'white') {
			this.blackWin();
		} else {
			this.whiteWin();
		}
	}
	/**
	 * Changes the current game to this.currentGame
	 */
	changeGame() {
		this.animator = this.games[this.currentGame];
		if (this.animator.ended) {
			this.currentState = this.states.replay;
			this.animator.replay();
		}
		else {
			this.currentState = this.states.playing;
			this.animator.reset();
		}
	}
	/**
	 * Changes the current player
	 */
	changePlayer() {
		if (this.currentPlayer === 'white')
			this.currentPlayer = 'black';
		else if (this.currentPlayer === 'black')
			this.currentPlayer = 'white';
		this.pc['status'] = false;
	}
	logPicking() {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i = 0; i < this.scene.pickResults.length; i++) {
					var obj = this.scene.pickResults[i][0];
					if (obj) {
						var customId = this.scene.pickResults[i][1];
						if (this.currentState === this.states.playing && !this.animator.ended)
							this.move(customId - 1);
					}
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
	}
	display() {
		this.scene.pushMatrix();

		// Displays the animator, which will display the board
		if (this.animator !== null)
			this.animator.display();

		this.scene.popMatrix();
		this.scene.pushMatrix();

		// Displays the scoreboard at the side of the board
		this.scene.translate(-2.78, 0.01, 1.75);
		this.scene.scale(0.3, 0.3, 0.3);
		this.scene.rotate(Math.PI / 2, 0, 1, 0);
		this.scene.rotate(-Math.PI / 9, 1, 0, 0);
		this.scoreboard[0].display();
		this.scene.translate(1.5, 1.5, 0);
		this.scoreboard[1].display();
		this.scene.translate(7.4, 0, 0);
		this.scoreboard[3].display();
		this.scene.translate(-1.5, -1.5, 0);
		this.scoreboard[2].display();

		this.scene.popMatrix();
	}
}