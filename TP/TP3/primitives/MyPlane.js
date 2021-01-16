class Plane extends CGFobject {
  /**
   * Constructor for Plane class
   * This function initializes the Rectangle, the Appearence, the Texture and the Shader
   * @param {CGFscene} scene current scene
   * @param {Float} u divisions
   * @param {Float} v divisions
   */

  constructor(scene, uDivs, vDivs) {
    super(scene);
    this.uDivs = uDivs;
    this.vDivs = vDivs;
    this.controlPoints = [
      [
        [0.5, 0.0, -0.5, 1],
        [0.5, 0.0, 0.5, 1],
      ],
      [
        [-0.5, 0.0, -0.5, 1],
        [-0.5, 0.0, 0.5, 1],
      ]

    ];

    var nurbSurface = new CGFnurbsSurface(1, 1, this.controlPoints);

    this.nurb = new CGFnurbsObject(this.scene, this.uDivs, this.vDivs, nurbSurface);

  }

  display() {
    this.nurb.display();
  }
}