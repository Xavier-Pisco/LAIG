class MyAnimator {
	constructor(scene, gameSequence, playTime) {
		this.scene = scene;
		this.gameSequence = gameSequence;
		this.currentMove = 0; // Next move to execute
		this.ended = false;

		this.states = {
			playing: 0,
			animatingPiece: 1,
			animatingCamera: 2,
			replaying: 3,
			paused: 4
		};
		this.currentState = this.states.playing;

		this.lastTime = 0; // Last current time from update
		this.elapsedTime = 0; // Elapsed time since the beggining of the program
		this.nextMove = 0; // Time of the next move

		this.playTime = playTime; // Time each player has to play
		this.timeSinceLastMove = 0;
		this.text = [new MySpriteText(this.scene, 'Time'), new MySpriteText(this.scene,''+this.playTime)]; // SpriteText with the remaining time
	}
	/**
	 * Resets the animation
	 */
	reset() {
		this.nextMove = 0;
		this.currentMove = 0;
		this.lastTime = 0;
		this.gameSequence.reset();
		this.currentState = this.states.playing;
	}
	/**
	 * Starts the replay
	 */
	replay() {
		this.reset();
		this.currentState = this.states.replaying;
	}
	/**
	 * Pauses current animation
	 */
	pause(type) {
		if (this.currentState === this.states.paused) {
			if (type === 'Play')
				this.currentState = this.states.playing;
			else if (type === 'Replay')
				this.currentState = this.states.replaying;
		}
		else {
			this.currentState = this.states.paused;
		}
	}
	/**
	 * Undoes a move
	 */
	undo() {
		if (this.currentState !== this.states.replaying) {
			if (this.gameSequence.undo()) {
				this.currentMove--;
				this.nextMove = this.elapsedTime / 1000 + 1;
				this.currentState = this.states.animatingCamera;
				return true;
			}
		}
		return false;
	}
	/**
	 * Updates the animation based on elapsed time
	 * Animations occur with, at least, 3 second interval
	 * @param {*} time current time
	 */
	update(time) {
		let deltaTime = time - this.lastTime;
		if (this.lastTime === 0) {
			deltaTime = 1;
		}
		this.elapsedTime += deltaTime;
		this.lastTime = time;

		switch (this.currentState) {
			case this.states.playing:	// If there is a new move start animating it, else don't do anything
				if (this.gameSequence.gameMoves.length > this.currentMove) {
					this.timeSinceLastMove = 0;
					this.gameSequence.displayMove(this.currentMove);
					this.nextMove = this.elapsedTime / 1000 + 3;
					this.currentMove++;
					this.currentState = this.states.animatingPiece;
				} else {
					this.timeSinceLastMove += deltaTime / 1000;
				}

				if (this.timeSinceLastMove > this.playTime) this.scene.gameOrchestrator.timeOver();
				break;
			case this.states.animatingPiece:	// If piece has ended animation change to animatingCamera
				if (this.nextMove - 1 <= this.elapsedTime / 1000) {
					this.currentState = this.states.animatingCamera;
					this.gameSequence.refreshBoard();
				}
				break;
			case this.states.animatingCamera:	// Rotates the camera until 1 second has passed and then fixes camera
				this.scene.rotateCamera(Math.PI / (1100 / deltaTime));
				if (this.nextMove <= this.elapsedTime / 1000) {
					this.scene.setCamera();
					this.currentState = this.states.playing;
				}
				break;
			case this.states.paused:	// If the game is paused elapsedtime doesn't update
				this.elapsedTime -= deltaTime;
				break;
			case this.states.replaying:	// Replays every move and, if game is not over, continues playing after replay
				if (this.gameSequence.gameMoves.length > this.currentMove) {
					if (this.nextMove <= this.elapsedTime / 1000) {
						this.gameSequence.replayMove(this.currentMove);
						this.nextMove = this.elapsedTime / 1000 + 3;
						this.currentMove++;
					}
				} else {
					if (this.nextMove <= this.elapsedTime / 1000 && !this.ended) this.currentState = this.states.playing;
				}
				break;
			default:
				break;
		}
	}
	/**
	 * Updates the text on the remaining time timer
	 */
	updateTimer() {
		if (this.timeSinceLastMove + 9 <= this.playTime) {
			this.text[1].changeText('' + Math.ceil(this.playTime - this.timeSinceLastMove).toString());
		} else if (this.timeSinceLastMove <= this.playTime) {
			this.text[1].changeText('' + Math.ceil(this.playTime - this.timeSinceLastMove).toString());
		} else {
			this.text[1].changeText('0');
		}
	}
	display() {
		this.scene.pushMatrix();

		// Displays the gameSequence, which displays the gameBoard
		this.gameSequence.display();

		this.scene.popMatrix();
		this.scene.pushMatrix();

		// If the players are playing displays the time
		if (this.currentState !== this.states.replaying && this.currentState !== this.states.paused) {
			this.updateTimer();
			this.scene.translate(-2.92, 0.4, 0.5);
			this.scene.scale(0.3, 0.3, 0.3);
			this.scene.rotate(Math.PI / 2, 0, 1, 0);
			this.scene.rotate(-Math.PI / 9, 1, 0, 0);
			this.text[0].display();
			this.scene.translate(0.75, -1.4, 0);
			this.text[1].display();

		}
		this.scene.popMatrix();
	}
}