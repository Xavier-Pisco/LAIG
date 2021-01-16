class MyTorus extends CGFobject {
    constructor(scene, inner, outer, slices, loops){
        /**
         * @method constructor
         * @param  {CGFscene} scene - MyScene object
         * @param {float} inner - Inner radius of the torus
         * @param {float} outer - outer radius of the torus
         * @param  {int} slices - Number of slices
         * @param {int} loops -  Number of loops
         */
        super(scene);
        this.scene = scene;

        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }

    initBuffers(){
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (var slice = 0; slice <= this.slices; slice++) {
            var theta = slice * 2 * Math.PI / this.slices;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var loop = 0; loop <= this.loops; loop++) {
                var phi = loop * 2 * Math.PI / this.loops;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var x = (this.outer + (this.inner * cosTheta)) * cosPhi;
                var y = (this.outer + (this.inner * cosTheta)) * sinPhi
                var z = this.inner * sinTheta;
                var s = 1 - (slice / this.slices);
                var t = 1 - (loop / this.loops);

                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);
                this.texCoords.push(t, s);
            }
        }

        for (var slice = 0; slice < this.slices; slice++) {
            for (var loop = 0; loop < this.loops; loop++) {
                var first = (slice * (this.loops + 1)) + loop;
                var second = first + this.loops + 1;

                this.indices.push(first, second + 1, second);
                this.indices.push(first, first + 1, second + 1);
            }
        }


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}