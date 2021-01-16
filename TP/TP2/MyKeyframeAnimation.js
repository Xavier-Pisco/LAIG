class MyKeyframeAnimation extends MyAnimation {
	/**
	 *	Constructor for MyKeyframeAnimation
	 * @param {CGFscene} scene current scene
	 * @param {String} id animation id
	 */
	constructor(scene, id) {
		super(scene, id);
		this.keyframes = [];
	}
	/**
	 * Adds a keyframe to the animation
	 * @param {Keyframe} keyframe
	 */
	addKeyframe(keyframe) {
		this.keyframes.push(keyframe);
	}
	/**
	 * Adds a translation to the keyframe on instant seconds
	 * @param {Float} instant keyframe instant
	 * @param {Float} x translation on x axis
	 * @param {Float} y translation on y axis
	 * @param {Float} z translation on z axis
	 */
	addTranslation(instant, x, y, z) {
		this.keyframes[instant].addTranslation(x, y, z);
	}
	/**
	 * Adds a rotation to the keyframe on instant seconds
	 * @param {Float} instant keyframe instant
	 * @param {Float} x rotation on x axis
	 * @param {Float} y rotation on y axis
	 * @param {Float} z rotation on z axis
	 */
	addRotation(instant, x, y, z) {
		this.keyframes[instant].addRotation(x, y, z);
	}
	/**
	 * Adds a scale to the keyframe on instant seconds
	 * @param {Float} instant keyframe instant
	 * @param {Float} x scale on x
	 * @param {Float} y scale on y
	 * @param {Float} z scale on z
	 */
	addScale(instant, x, y, z) {
		this.keyframes[instant].addScale(x, y, z);
	}
	/**
	 * Calculates the current transformation matrix based on the previous and next keyframes and time passed
	 * @param {Keyframe} oldKeyframe previous keyframe
	 * @param {Keyframe} newKeyframe next keyframe
	 */
	calculateMatrix(oldKeyframe, newKeyframe) {
		if (oldKeyframe == null){
			this.matrix = mat4.create();
			mat4.scale(this.matrix, this.matrix, [0,0,0]);
			return this.matrix;
		}
		if (newKeyframe == null) {
			return this.matrix;
		}
		this.keyframeTime = (this.timePassed - oldKeyframe.instant * 1000) / 1000.0;
		this.matrix = mat4.create();
		// Each line represents the formula X = Xi + Td * V
		// Where X is the current transformation on a given index,
		// Xi is the transformation on the previous keyframe
		// Td is the time passed since the previous keyframe instant
		// V is the transformation per second
		let tx = oldKeyframe.translation[0] + (newKeyframe.translation[0] - oldKeyframe.translation[0]) / (newKeyframe.instant - oldKeyframe.instant) * this.keyframeTime;
		let ty = oldKeyframe.translation[1] + (newKeyframe.translation[1] - oldKeyframe.translation[1]) / (newKeyframe.instant - oldKeyframe.instant) * this.keyframeTime;
		let tz = oldKeyframe.translation[2] + (newKeyframe.translation[2] - oldKeyframe.translation[2]) / (newKeyframe.instant - oldKeyframe.instant) * this.keyframeTime;
		let rx = oldKeyframe.rotationx + (newKeyframe.rotationx - oldKeyframe.rotationx) / (newKeyframe.instant - oldKeyframe.instant) * this.keyframeTime;
		let ry = oldKeyframe.rotationy + (newKeyframe.rotationy - oldKeyframe.rotationy) / (newKeyframe.instant - oldKeyframe.instant) * this.keyframeTime;
		let rz = oldKeyframe.rotationz + (newKeyframe.rotationz - oldKeyframe.rotationz) / (newKeyframe.instant - oldKeyframe.instant) * this.keyframeTime;
		let sx = oldKeyframe.scale[0] + (newKeyframe.scale[0] - oldKeyframe.scale[0]) / (newKeyframe.instant - oldKeyframe.instant) * this.keyframeTime;
		let sy = oldKeyframe.scale[1] + (newKeyframe.scale[1] - oldKeyframe.scale[1]) / (newKeyframe.instant - oldKeyframe.instant) * this.keyframeTime;
		let sz = oldKeyframe.scale[2] + (newKeyframe.scale[2] - oldKeyframe.scale[2]) / (newKeyframe.instant - oldKeyframe.instant) * this.keyframeTime;

		// Apply the calculated transformations to this.matrix
		mat4.translate(this.matrix, this.matrix, [tx, ty, tz]);
		mat4.rotate(this.matrix, this.matrix, rx / 180 * Math.PI, [1, 0, 0]);
		mat4.rotate(this.matrix, this.matrix, ry / 180 * Math.PI, [0, 1, 0]);
		mat4.rotate(this.matrix, this.matrix, rz / 180 * Math.PI, [0, 0, 1]);
		mat4.scale(this.matrix, this.matrix, [sx, sy, sz]);

		return this.matrix;
	}
	/**
	 * Updates the current animation based on time
	 * @param {Int} time
	 */
	update(time) {
		if (this.lastTime == 0) {
			this.lastTime = time;
			return;
		}
		var deltaTime = time - this.lastTime;
		this.lastTime = time;
		this.timePassed += deltaTime;
		let oldKeyframe = null;
		let i;
		// oldkeyframe is the most recent keyframe that has already been completed
		// newkeyframe is the next keyframe to calculate
		for (i = 0; i < this.keyframes.length; i++) {
			if (this.keyframes[i].instant * 1000 < this.timePassed) {
				oldKeyframe = this.keyframes[i];
			}
			if (this.keyframes[i].instant * 1000 > this.timePassed) {
				this.matrix = this.calculateMatrix(oldKeyframe, this.keyframes[i]);
				return;
			}
		}
		// If there is no keyframe with instant < time
		if (i > 0)
			this.matrix = this.keyframes[i - 1].getCompleteMatrix();
	}
	getMatrix() {
		return this.matrix;
	}
}