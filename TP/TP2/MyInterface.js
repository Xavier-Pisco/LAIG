/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
    addLightsGUI(){
        var keyNames = Object.keys(this.scene.graph.lights);
        var lightsFolder = this.gui.addFolder('Lights');

        for (let i = 0; i < keyNames.length; i++){
            lightsFolder.add(this.scene.lights[i], 'enabled').name(keyNames[i]);
        }
    }
    addCamerasGUI(){
        this.gui.add(this.scene, "currCamera" , Object.keys(this.scene.cameras)).name('View Points').onChange(this.scene.updateView.bind(this.scene));
    }
}