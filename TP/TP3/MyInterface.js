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
        this.cameraLock = true;

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }
    processMouseMove(event) {
        if (!this.cameraLock)
            super.processMouseMove(event);
    } // Stops all mouse movements (click and drag doesn't change camera position)

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
    addLightsGUI() {
        var keyNames = Object.keys(this.scene.graph.lights);
        var lightsFolder = this.gui.addFolder('Lights');

        for (let i = 0; i < keyNames.length; i++) {
            lightsFolder.add(this.scene.lights[i], 'enabled').name(keyNames[i]);
        }
    }
    addCamerasGUI() {
        this.gui.add(this.scene, "currCamera", Object.keys(this.scene.cameras)).name('View Points').onChange(this.scene.updateView.bind(this.scene));
    }
    addScenesGUI() {
        this.gui.add(this.scene.graph, "idRoot", Object.keys(this.scene.graph.rootIds)).name('Scenes').onChange(null);
    }
    /**
     * Adds the buttons in the interface
     */
    addButtonsGUI() {
        this.gui.add(this.scene.gameOrchestrator, 'start').name('Start new game');
        this.gui.add(this.scene.gameOrchestrator, 'undo').name('Undo');
        this.gui.add(this.scene.gameOrchestrator, 'pause').name('Pause/Continue');
        this.gui.add(this.scene.gameOrchestrator, 'replay').name('Replay');
        this.gui.add(this, 'cameraLock').name('Lock camera');
        this.gui.add(this.scene.gameOrchestrator, 'playTime', 5, 60, 1).name('Time').onChange(null).step(1);
    }
    /**
     * Adds the type and difficulty to the interface
     */
    addGameTypeGUI() {
        this.gui.add(this.scene.gameOrchestrator, 'currentType', Object.keys(this.scene.gameOrchestrator.types)).name('Type').onChange(this.scene.gameOrchestrator.changeType.bind(this.scene.gameOrchestrator));
        this.gui.add(this.scene.gameOrchestrator, 'currentDifficulty', Object.keys(this.scene.gameOrchestrator.difficulties)).name('Difficulty').onChange(this.scene.gameOrchestrator.changeType.bind(this.scene.gameOrchestrator));
    }
    /**
     * Add possibility to chose past games
     */
    addPastGamesGUI() {
        this.pastGames = this.gui.add(this.scene.gameOrchestrator, "currentGame", Object.keys(this.scene.gameOrchestrator.games)).name('Current Game').onChange(this.scene.gameOrchestrator.changeGame.bind(this.scene.gameOrchestrator));
    }
    /**
     * Resets the list in the past games list
     */
    resetPastGamesGUI() {
        this.gui.remove(this.pastGames);
        this.pastGames = this.gui.add(this.scene.gameOrchestrator, "currentGame", Object.keys(this.scene.gameOrchestrator.games)).name('Current Game').onChange(this.scene.gameOrchestrator.changeGame.bind(this.scene.gameOrchestrator));
    }
}() => {console.log(this.scene.gameOrchestrator.animator.playTime)}