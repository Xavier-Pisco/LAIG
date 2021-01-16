class MyAnimation {
	/**
	 *	MyAnimation constructor
	 * @param {CGFscene} scene current scene
	 * @param {String} id Animation id
	 */
	constructor(scene, id) {
		this.scene = scene;
		this.id = id;

		this.lastTime = 0;
		this.timePassed = 0;

		this.matrix = mat4.create();
	}
}