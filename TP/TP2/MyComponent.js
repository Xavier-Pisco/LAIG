class MyComponent extends CGFobject {
    /**
     * Constructor for a node
     * @param {CGFscene} scene
     * @param {String} id - Node's id
     * @param {bool} loaded - True if node is beying parsed or was already parsed and false otherwise
     */
    constructor(scene, id, loaded){
        super(scene);

        this.id = id;

        this.material = "null";
        this.texture = "null";

        this.loaded = loaded;

        this.children = [];
        this.transformations = [];
        this.amplifications = [];
        this.animation = null;
    }
    load(){
        this.loaded = true;
    }
    addChild(child){
        this.children.push(child);
    }
    addTransformation(attributes){
        this.transformations.push(attributes);
    }
    /**
     * This function returns a matrix of size 4x4 that represents this node's transformations
     */
    getTransformations(){
        let matrix = mat4.create();
        for (let i = 0 ; i < this.transformations.length; i++){
            let transformation = this.transformations[i];
            if (transformation[0] == "translation"){
                mat4.translate(matrix, matrix, [parseFloat(transformation[1]), parseFloat(transformation[2]), parseFloat(transformation[3])]);
            } else if (transformation[0] == "rotation"){
                if (transformation[1] == 'x')
                    matrix = mat4.rotate(matrix, matrix, parseFloat(transformation[2]) / 180 * Math.PI, [1, 0, 0]);
                else if (transformation[1] == 'y')
                    matrix = mat4.rotate(matrix, matrix, parseFloat(transformation[2]) / 180 * Math.PI, [0, 1, 0]);
                else if (transformation[1] == 'z')
                    matrix = mat4.rotate(matrix, matrix, parseFloat(transformation[2]) / 180 * Math.PI, [0, 0, 1]);
            } else if (transformation[0] == "scale"){
                matrix = mat4.scale(matrix, matrix, [transformation[1], transformation[2], transformation[3]]);
            }
        }
        return matrix;
    }
    display(){
        this.scene.pushMatrix();
        var currMaterial = this.scene.pushMaterial(this.material);
        var currTexture = this.scene.pushTexture(this.texture);

        var matrix = this.getTransformations();
        this.scene.multMatrix(matrix);

        if (this.animation != null){
            matrix = this.animation.getMatrix();
            this.scene.multMatrix(matrix);
        }

        currMaterial.setTexture(currTexture);
        currMaterial.setTextureWrap('REPEAT', 'REPEAT');

        currMaterial.apply();

        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i] instanceof MyRectangle) {
                this.children[i].updateTexCoords(this.amplifications[0], this.amplifications[1]);
            } else if (this.children[i] instanceof MyTriangle) {
                this.children[i].updateTexCoords(this.amplifications[0], this.amplifications[1]);
            }
            this.children[i].display();
        }

        this.scene.popTexture();
        this.scene.popMaterial();
        this.scene.popMatrix();
    }

}