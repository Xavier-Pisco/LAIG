class Keyframe {
	/**
	 * Data class used to store keyframe info
	 * @param {Float} instant
	 */
	constructor(instant) {
		this.instant = instant;
		this.translation = [];
		this.rotationx;
		this.rotationy;
		this.rotationz;
		this.scale = [];
	}
	addTranslation(x, y, z) {
		this.translation.push(x, y, z);
	}
	addRotation(x, y, z) {
		this.rotationx = x;
		this.rotationy = y;
		this.rotationz = z;
	}
	addScale(x, y, z) {
		this.scale.push(x, y, z);
	}
	/**
	 * @returns matrix with the tranlsation, rotation and scale of the completed keyframe
	 */
	getCompleteMatrix() {
		this.matrix = mat4.create();
		mat4.translate(this.matrix, this.matrix, this.translation);
		mat4.rotate(this.matrix, this.matrix, this.rotationx / 180 * Math.PI, [1, 0, 0]);
		mat4.rotate(this.matrix, this.matrix, this.rotationy / 180 * Math.PI, [0, 1, 0]);
		mat4.rotate(this.matrix, this.matrix, this.rotationz / 180 * Math.PI, [0, 0, 1]);
		mat4.scale(this.matrix, this.matrix, this.scale);
		return this.matrix;
	}
}