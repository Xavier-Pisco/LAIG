class MyCylinder extends CGFobject {
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param {float} height - Height of the cilinder
     * @param  {float} topRadius - Top radius of the cilinder
     * @param  {float} bottomRadius - Bottom radius of the cilinder
     * @param {int} stacks  Number of stacs
     * @param {int} slices  Number of slices
     */
    constructor(scene, height, topRadius, bottomRadius, stacks, slices) {
        super(scene);
        this.height = height;
        this.topRadius = topRadius;
        this.bottomRadius = bottomRadius;
        this.stacks = stacks;
        this.slices = slices;
        this.topCircle = new MyCircle(scene, topRadius, slices);
        this.bottomCircle = new MyCircle(scene, bottomRadius, slices);
        this.initBuffers();
    }
  
    initBuffers() {
        
    var angle = (2*Math.PI)/this.slices;
    var last = 0;
    var indice = 0;

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];
    var radius = this.bottomRadius;
    var radDelta = (this.topRadius - this.bottomRadius) / this.stacks;
    

    for(var s = 0; s <= this.stacks; s++)
    {
        for(var i = 0; i <= this.slices; i++)
        {
            last += angle;
            this.vertices.push((radius+s*radDelta)*Math.cos(last), (radius+s*radDelta)*Math.sin(last), this.height*s/this.stacks);
            this.normals.push(Math.cos(last), Math.sin(last), 0);
            this.texCoords.push(i / this.slices, s / this.stacks);
            indice++;

            if(s > 0 && i > 0)
            {
                this.indices.push(indice-1, indice-2, indice-this.slices-2);
                this.indices.push(indice-this.slices-3, indice-this.slices-2, indice-2);
            }
        }
        last = 0;
    }
    
    this.vertices.push(0, 0, 0);
    this.vertices.push(0, 0, this.height);

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
        
    }
    display(){
        this.scene.pushMatrix();

        super.display();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.bottomCircle.display();
        this.scene.popMatrix();
        this.scene.translate(0, 0, this.height);
        this.topCircle.display();

        this.scene.popMatrix();
    }
}