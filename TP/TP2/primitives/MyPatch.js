class MyPatch extends CGFobject {
    /**
       * Constructor for MyPatch class
       * This function initializes the Rectangle, the Appearence, the Texture and the Shader
       * @param {CGFscene} scene current scene
       * @param {Float} points in u
       * @param {Float} points in v
       * @param {Float} u divisions
       * @param {Float} v divisions
       * @param {Array} points that form the surface
       */

    constructor(scene, nPointsU, nPointsV, uDiv, vDiv, controlPoints) {
        super(scene);
        this.nPointsU = nPointsU;
        this.nPointsV = nPointsV;
        this.uDiv = uDiv;
        this.vDiv = vDiv;
        this.controlPoints = [];

        let i = 0;
        for (let u = 0; u < nPointsU; u++) {
            let uArray = [];
            for (let v = 0; v < nPointsV; v++) {
                uArray.push(controlPoints[i]);
                i++
            }
            this.controlPoints.push(uArray);
        }

        let nurbsSurface = new CGFnurbsSurface(this.nPointsU - 1, this.nPointsV - 1, this.controlPoints);
        this.obj = new CGFnurbsObject(this.scene, this.uDiv, this.vDiv, nurbsSurface);
    };

    display() {
        this.obj.display();
    }

    updateTexCoords(s, t) { }
};