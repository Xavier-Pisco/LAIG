/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface
     */
    constructor(myinterface) {
        super();

        // Array of MyCompontent items with all items
        this.components = [];

        // Array of CGFtexture with all textures
        // Index position is the texture name
        this.allTextures = [];

        // Array of CGFappearance with all materials
        // Index position is the material name
        this.allMaterials = [];

        // Stacks for materials and textures
        this.material = [];
        this.texture = [];

        // Array with all aniamtions
        this.animations = [];

        // Array with all spritesheets
        this.spritesheets = [];

        // Array with all cameras
        this.cameras = [];
        // Name of the current camera
        this.currCamera = "";

        this.spriteAnims = [];

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress=0;

        this.defaultAppearance=new CGFappearance(this);

    }
    /**
     * Pushes a material to the material stack from a material name or repeats last material (in case name its null)
     * @param {String} materialName - name from the material to push
     * @returns {CGFappearance} - material that is going to be used
     */
    pushMaterial(materialName){
        if (materialName == "null") {
            var currMaterial = this.material.pop();
            this.material.push(currMaterial);
            this.material.push(currMaterial);
            return currMaterial;
        }
        this.material.push(this.allMaterials[materialName]);
        return this.allMaterials[materialName];
    }

    popMaterial(){
        var material = this.material.pop();
        return material;
    }

    /**
     * Pushes a texture to the texture stack from a texture name or repeats last texture (in case name its null)
     * @param {String} textureName - name from the texture to push
     * @returns {CGFtexture} - texture that is going to be used
     */
    pushTexture(textureName){
        if (textureName == "clear") {
            this.texture.push(null);
            return null;
        } else if (textureName == "null"){
            var currTexture = this.texture.pop();
            this.texture.push(currTexture);
            this.texture.push(currTexture);
            return currTexture;
        }
        this.texture.push(this.allTextures[textureName]);
        return this.allTextures[textureName];
    }

    popTexture(){
        var texture = this.texture.pop();
        return texture;
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }
    /**
     * @param {String} id - Material's id
     * @returns material if it exists and null otherwise.
     */
    getComponent(id){
        for (var i = 0; i < this.components.length; i++){
            if (this.components[i].id == id){
                return this.components[i];
            }
        }
        return null;
    }
    getMaterial(id){
        for (const material in this.allMaterials){
            if (material == id) return material;
        }
        return null;
    }
    getTexture(id){
        for (const texture in this.allTextures){
            if (texture == id) return texture;
        }
        return null;
    }
    getAnimation(id){
        for (var i = 0; i < this.animations.length; i++){
            if (this.animations[i].id == id){
                return this.animations[i];
            }
        }
        return null;
    }
    getSpriteSheet(id){
        for (var i = 0; i < this.spritesheets.length; i++){
            if (this.spritesheets[i].id == id){
                return this.spritesheets[i];
            }
        }
        return null;
    }

    /** Handler called when the graph is finally loaded.
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();

        this.interface.addLightsGUI();
        this.interface.addCamerasGUI();
        this.updateView();

        this.sceneInited = true;
    }
    updateView(){
        this.camera = this.cameras[this.currCamera];
        this.interface.setActiveCamera(this.camera);
    }
    update(time){
        for (let i = 0; i < this.animations.length; i++){
            this.animations[i].update(time);
        }
        for (let i = 0; i < this.spriteAnims.length; i++){
            this.spriteAnims[i].update(time);
        }
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        this.material.pop();
        this.material.push(this.defaultAppearance);
        this.texture.pop();
        this.texture.push(null);

        this.setActiveShader(this.defaultShader);

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].update();
        }

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();


            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else
        {
            // Show some "loading" visuals

            this.rotate(-this.loadingProgress/10.0,0,0,1);

            this.loadingProgressObject.display();
            this.loadingProgress++;
        }


        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}