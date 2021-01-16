const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var ANIMATIONS_INDEX = 6;
var SPRITESHEET_INDEX = 7;
var NODES_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <spitesheets>
        if ((index = nodeNames.indexOf("spritesheets")) == -1)
            return "tag <spritesheets> missing";
        else {
            if (index != SPRITESHEET_INDEX)
                this.onXMLMinorError("tag <spritesheets> out of order");

            //Parse animations block
            if ((error = this.parseSpritesheets(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block.
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootsIndex = nodeNames.indexOf("roots");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if (rootsIndex == -1)
            return "No root id defined for scene.";

        this.rootIds = [];
        for (let i = 0; i < children[rootsIndex].children.length; i++){
            this.rootIds[children[rootsIndex].children[i].id] = true;
        }
        this.idRoot = children[rootsIndex].children[0].id;

        // Get axis length
        if (referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        this.cameras = [];
        this.scene.currCamera = this.reader.getString(viewsNode, 'default');

        for (let i = 0; i < viewsNode.children.length; i++) {
            let view = viewsNode.children[i];
            if (view.nodeName == "perspective") {
                // Parses a perspective view

                let id = this.reader.getString(view, 'id');
                let near = this.reader.getFloat(view, 'near');
                let far = this.reader.getFloat(view, 'far');
                let angle = this.reader.getFloat(view, 'angle');

                if (id == null) {
                    this.onXMLError("Id not defined on views");
                    continue;
                } else if (this.scene.cameras[id] != null) {
                    return "ID must be unique for each view (conflict: ID = " + id + ")";
                }
                if (near == null) {
                    this.onXMLMinorError("Near not defined on " + id + ". Using 0.");
                }
                if (far == null) {
                    this.onXMLMinorError("Far not defined on " + id + ". Using 0.");
                }
                if (angle == null) {
                    this.onXMLMinorError("Angle not defined on " + id + ". Using 0.");
                }


                // Parsing perspective children (from and to)
                let names = [];
                for (var j = 0; j < view.children.length; j++) {
                    names.push(view.children[j].nodeName);
                }
                let fromIndex = names.indexOf("from");
                let toIndex = names.indexOf("to");

                let x = 0;
                let y = 0;
                let z = 0;

                if (fromIndex < 0) {
                    this.onXMLError("From not defined on " + id + ". Using values as 0.");
                } else {
                    x = this.reader.getFloat(view.children[fromIndex], 'x');
                    y = this.reader.getFloat(view.children[fromIndex], 'y');
                    z = this.reader.getFloat(view.children[fromIndex], 'z');
                    if (x == null) {
                        this.onXMLMinorError("From x not defined on " + id + ". Using 0.");
                    }
                    if (y == null) {
                        this.onXMLMinorError("From y not defined on " + id + ". Using 0.");
                    }
                    if (z == null) {
                        this.onXMLMinorError("From z not defined on " + id + ". Using 0.");
                    }
                }
                let from = vec3.fromValues(x, y, z);

                x = 0;
                y = 0;
                z = 0;

                if (toIndex < 0) {
                    this.onXMLError("To not defined on " + id + ". Using values as 0.");
                } else {
                    x = this.reader.getFloat(view.children[toIndex], 'x');
                    y = this.reader.getFloat(view.children[toIndex], 'y');
                    z = this.reader.getFloat(view.children[toIndex], 'z');
                    if (x == null) {
                        this.onXMLMinorError("To x not defined on " + id + ". Using 0.");
                    }
                    if (y == null) {
                        this.onXMLMinorError("To y not defined on " + id + ". Using 0.");
                    }
                    if (z == null) {
                        this.onXMLMinorError("To z not defined on " + id + ". Using 0.");
                    }
                }

                let to = vec3.fromValues(x, y, z);

                // Creates a CGFcamera with parsed values and adds it to the cameras array on scene
                let camera = new CGFcamera(angle * DEGREE_TO_RAD, near, far, from, to);
                this.scene.cameras[id] = camera;
                this.cameras[id] = id;
            } else if (view.nodeName == "ortho") {

                let id = this.reader.getString(view, 'id');
                let near = this.reader.getFloat(view, 'near');
                let far = this.reader.getFloat(view, 'far');
                let left = this.reader.getFloat(view, 'left');
                let right = this.reader.getFloat(view, 'right');
                let top = this.reader.getFloat(view, 'top');
                let bottom = this.reader.getFloat(view, 'bottom');

                if (id == null) {
                    this.onXMLError("Id not defined on views");
                    continue;
                } else if (this.scene.cameras[id] != null) {
                    return "ID must be unique for each view (conflict: ID = " + id + ")";
                }
                if (near == null) {
                    this.onXMLMinorError("Near not defined on " + id + ". Using 0.");
                }
                if (far == null) {
                    this.onXMLMinorError("Far not defined on " + id + ". Using 0.");
                }
                if (left == null) {
                    this.onXMLMinorError("Left not defined on " + id + ". Using 0.");
                }
                if (right == null) {
                    this.onXMLMinorError("Right not defined on " + id + ". Using 0.");
                }
                if (top == null) {
                    this.onXMLMinorError("Top not defined on " + id + ". Using 0.");
                }
                if (bottom == null) {
                    this.onXMLMinorError("Bottom not defined on " + id + ". Using 0.");
                }

                // Parsing ortho children (from, to and up)
                let names = [];
                for (var j = 0; j < view.children.length; j++) {
                    names.push(view.children[j].nodeName);
                }
                let fromIndex = names.indexOf("from");
                let toIndex = names.indexOf("to");
                let upIndex = names.indexOf("up");

                let x = 0;
                let y = 0;
                let z = 0;

                if (fromIndex < 0) {
                    this.onXMLError("From not defined on " + id + ". Using values as 0.");
                } else {
                    x = this.reader.getFloat(view.children[fromIndex], 'x');
                    y = this.reader.getFloat(view.children[fromIndex], 'y');
                    z = this.reader.getFloat(view.children[fromIndex], 'z');
                    if (x == null) {
                        this.onXMLMinorError("From x not defined on " + id + ". Using 0.");
                    }
                    if (y == null) {
                        this.onXMLMinorError("From y not defined on " + id + ". Using 0.");
                    }
                    if (z == null) {
                        this.onXMLMinorError("From z not defined on " + id + ". Using 0.");
                    }
                }
                let from = vec3.fromValues(x, y, z);

                x = 0;
                y = 0;
                z = 0;

                if (toIndex < 0) {
                    this.onXMLError("To not defined on " + id + ". Using values as 0.");
                } else {
                    x = this.reader.getFloat(view.children[toIndex], 'x');
                    y = this.reader.getFloat(view.children[toIndex], 'y');
                    z = this.reader.getFloat(view.children[toIndex], 'z');
                    if (x == null) {
                        this.onXMLMinorError("To x not defined on " + id + ". Using 0.");
                    }
                    if (y == null) {
                        this.onXMLMinorError("To y not defined on " + id + ". Using 0.");
                    }
                    if (z == null) {
                        this.onXMLMinorError("To z not defined on " + id + ". Using 0.");
                    }
                }

                let to = vec3.fromValues(x, y, z);

                x = 0;
                y = 1;
                z = 0;

                if (upIndex < 0) {
                    this.onXMLError("Up not defined on " + id + ". Using values as (0,1,0).");
                } else {
                    x = this.reader.getFloat(view.children[upIndex], 'x');
                    y = this.reader.getFloat(view.children[upIndex], 'y');
                    z = this.reader.getFloat(view.children[upIndex], 'z');
                    if (x == null) {
                        this.onXMLMinorError("Up x not defined on " + id + ". Using 0.");
                    }
                    if (y == null) {
                        this.onXMLMinorError("Up y not defined on " + id + ". Using 0.");
                    }
                    if (z == null) {
                        this.onXMLMinorError("Up z not defined on " + id + ". Using 0.");
                    }
                }

                let up = vec3.fromValues(x, y, z);

                // Creates a CGFcameraOrtho with parsed values and adds it to the cameras array on scene
                let camera = new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, up);
                this.scene.cameras[id] = camera;
            } else {
                this.onXMLMinorError("unknown tag <" + texturesNode.children[i].nodeName + "> on lights.");
            }
        }
        this.log("Parsed Views.");
        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean", "position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        for (var i = 0; i < texturesNode.children.length; i++) {
            if (texturesNode.children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + texturesNode.children[i].nodeName + "> on textures.");
                continue;
            }

            var XMLTexture = texturesNode.children[i];
            var textureId = this.reader.getString(XMLTexture, 'id');
            if (textureId == null) {
                return "no ID defined for texture";
            } else if (this.scene.allTextures[textureId] != null) {
                return "ID must be unique for each light (conflict: ID = " + textureId + ")";
            } else {
                var texturePath = this.reader.getString(XMLTexture, "path");
                if (texturePath == null) {
                    this.onXMLError("Texture " + textureId + " has no path.");
                } else {
                    this.scene.allTextures[textureId] = new CGFtexture(
                        this.scene,
                        XMLTexture.attributes[1].nodeValue
                    );
                }
            }
        }

        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.scene.allMaterials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            // Creates an array to let any order on material's children
            var grandChildren = children[i].children;
            var attributesNames = [];
            for (var x = 0; x < grandChildren.length; x++) {
                attributesNames.push(grandChildren[x].nodeName);
            }

            var ambientIndex = attributesNames.indexOf("ambient");
            var specularIndex = attributesNames.indexOf("specular");
            var diffuseIndex = attributesNames.indexOf("diffuse");
            var emissiveIndex = attributesNames.indexOf("emissive");
            var shininessIndex = attributesNames.indexOf("shininess");

            // Creates a new material and sets its values with parsed values
            var material = new CGFappearance(this.scene);

            let r = 0;
            let g = 0;
            let b = 0;
            let a = 0;


            if (ambientIndex < 0) {
                this.onXMLError("Ambient from " + materialID + " not defined. Using all ambient values as 0.");
            } else {
                r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (r == null) {
                    this.onXMLMinorError("r not defined on ambient from " + materialID + ". Using 0.");
                    r = 0;
                }
                if (g == null) {
                    this.onXMLMinorError("g not defined on ambient from " + materialID + ". Using 0.");
                    g = 0;
                }
                if (b == null) {
                    this.onXMLMinorError("b not defined on ambient from " + materialID + ". Using 0.");
                    b = 0;
                }
                if (a == null) {
                    this.onXMLMinorError("a not defined on ambient from " + materialID + ". Using 0.");
                    a = 0;
                }
            }
            material.setAmbient(r, g, b, a);

            r = 0; g = 0; b = 0; a = 0;

            if (diffuseIndex < 0) {
                this.onXMLError("Diffuse from " + materialID + " not defined. Using all diffuse values as 0.");
            } else {
                r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if (r == null) {
                    this.onXMLMinorError("r not defined on diffuse from " + materialID + ". Using 0.");
                    r = 0;
                }
                if (g == null) {
                    this.onXMLMinorError("g not defined on diffuse from " + materialID + ". Using 0.");
                    g = 0;
                }
                if (b == null) {
                    this.onXMLMinorError("b not defined on diffuse from " + materialID + ". Using 0.");
                    b = 0;
                }
                if (a == null) {
                    this.onXMLMinorError("a not defined on diffuse from " + materialID + ". Using 0.");
                    a = 0;
                }
            }
            material.setDiffuse(r, g, b, a);

            r = 0; g = 0; b = 0; a = 0;

            if (specularIndex < 0) {
                this.onXMLError("Specular from " + materialID + " not defined. Using all specular values as 0.");
            } else {
                r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                if (r == null) {
                    this.onXMLMinorError("r not defined on specular from " + materialID + ". Using 0.");
                    r = 0;
                }
                if (g == null) {
                    this.onXMLMinorError("g not defined on specular from " + materialID + ". Using 0.");
                    g = 0;
                }
                if (b == null) {
                    this.onXMLMinorError("b not defined on specular from " + materialID + ". Using 0.");
                    b = 0;
                }
                if (a == null) {
                    this.onXMLMinorError("a not defined on specular from " + materialID + ". Using 0.");
                    a = 0;
                }
            }
            material.setSpecular(r, g, b, a);

            r = 0; g = 0; b = 0; a = 0;

            if (emissiveIndex < 0) {
                this.onXMLError("Emissive from " + materialID + " not defined. Using all emissive values as 0.");
            } else {
                r = this.reader.getFloat(grandChildren[emissiveIndex], 'r');
                g = this.reader.getFloat(grandChildren[emissiveIndex], 'g');
                b = this.reader.getFloat(grandChildren[emissiveIndex], 'b');
                a = this.reader.getFloat(grandChildren[emissiveIndex], 'a');
                if (r == null) {
                    this.onXMLMinorError("r not defined on emissive from " + materialID + ". Using 0.");
                    r = 0;
                }
                if (g == null) {
                    this.onXMLMinorError("g not defined on emissive from " + materialID + ". Using 0.");
                    g = 0;
                }
                if (b == null) {
                    this.onXMLMinorError("b not defined on emissive from " + materialID + ". Using 0.");
                    b = 0;
                }
                if (a == null) {
                    this.onXMLMinorError("a not defined on emissive from " + materialID + ". Using 0.");
                    a = 0;
                }
            }
            material.setEmission(r, g, b, a);

            let shininess = 0;
            if (shininessIndex < 0) {
                this.onXMLError("Emissive from " + materialID + " not defined. Using value as 0.");
            } else {
                shininess = this.reader.getFloat(grandChildren[shininessIndex], 'value');
                if (shininess == null) {
                    this.onXMLMinorError("Shininess value not defined on " + materialID + ". Using 0.");
                    shininess = 0;
                }
            }

            material.setShininess(shininess);

            // Adds the new material to the materials array on scene
            this.scene.allMaterials[this.reader.getString(children[i], 'id')] = material;
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <animations> node.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;

        // Any number of animations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current animation.
            var animationID = this.reader.getString(children[i], 'id');
            if (animationID == null)
                return "no ID defined for animation";

            // Checks for repeated IDs.
            if (this.scene.animations[animationID] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationID + ")";

            let animation = new MyKeyframeAnimation(this.scene, animationID);

            var keyframes = children[i].children;

            for (var j = 0; j < keyframes.length; j++) {
                if (keyframes[j].nodeName != "keyframe") {
                    this.onXMLMinorError("unknown tag <" + keyframes[j].nodeName + ">");
                    continue;
                }
                let instant = this.reader.getFloat(keyframes[j], "instant");
                let keyframe;
                if (instant >= 0) {
                    keyframe = new Keyframe(instant);
                } else {
                    this.onXMLMinorError("no instant on keyframe from " + animationID + "animation");
                    continue;
                }
                var childrenName = [];
                for (let k = 0; k < keyframes[j].children.length; k++) {
                    childrenName.push(keyframes[j].children[k].nodeName);
                }
                var translationIndex = childrenName.indexOf("translation");
                var rotationXIndex = childrenName.indexOf("rotation");
                var rotationYIndex = childrenName.indexOf("rotation", rotationXIndex + 1);
                var rotationZIndex = childrenName.indexOf("rotation", rotationYIndex + 1);
                var scaleIndex = childrenName.indexOf("scale");

                let x = 0;
                let y = 0;
                let z = 0;

                if (translationIndex < 0) {
                    this.onXMLMinorError("No translation index on animation " + animationID + " on instant " + instant);
                    continue;
                } else if (translationIndex != 0) {
                    this.onXMLMinorError("translation out of order on animation " + animationID + " on instant " + instant);
                } else {
                    x = this.reader.getFloat(keyframes[j].children[translationIndex], "x");
                    y = this.reader.getFloat(keyframes[j].children[translationIndex], "y");
                    z = this.reader.getFloat(keyframes[j].children[translationIndex], "z");
                }
                keyframe.addTranslation(x, y, z);

                if (rotationXIndex < 0) {
                    this.onXMLMinorError("No rotation index on animation " + animationID + "on instant" + instant);
                    continue;
                } else if (rotationXIndex != 1) {
                    this.onXMLMinorError("x rotation out of order on animation " + animationID + " on instant " + instant);
                }

                let axis = this.reader.getString(keyframes[j].children[rotationXIndex], "axis");

                if (axis == "x") {
                    x = this.reader.getFloat(keyframes[j].children[rotationXIndex], "angle");
                } else if (axis == "y") {
                    y = this.reader.getFloat(keyframes[j].children[rotationXIndex], "angle");
                    this.onXMLMinorError("y rotation out of order on animation " + animationID + " on instant " + instant);
                } else if (axis == "z") {
                    z = this.reader.getFloat(keyframes[j].children[rotationXIndex], "angle");
                    this.onXMLMinorError("z rotation out of order on animation " + animationID + " on instant " + instant);
                }


                if (rotationYIndex < 0) {
                    this.onXMLMinorError("No rotation index on animation " + animationID + "on instant" + instant);
                    continue;
                } else if (rotationYIndex != 2) {
                    this.onXMLMinorError("y rotation out of order on animation " + animationID + " on instant " + instant);
                }

                axis = this.reader.getString(keyframes[j].children[rotationYIndex], "axis");

                if (axis == "y") {
                    y = this.reader.getFloat(keyframes[j].children[rotationYIndex], "angle");
                } else if (axis == "x") {
                    x = this.reader.getFloat(keyframes[j].children[rotationYIndex], "angle");
                    this.onXMLMinorError("x rotation out of order on animation " + animationID + " on instant " + instant);
                } else if (axis == "z") {
                    z = this.reader.getFloat(keyframes[j].children[rotationYIndex], "angle");
                    this.onXMLMinorError("z rotation out of order on animation " + animationID + " on instant " + instant);
                }


                if (rotationZIndex < 0) {
                    this.onXMLMinorError("No rotation index on animation " + animationID + "on instant" + instant);
                    continue;
                } else if (rotationZIndex != 3) {
                    this.onXMLMinorError("z rotation out of order on animation " + animationID + " on instant " + instant);
                }

                axis = this.reader.getString(keyframes[j].children[rotationZIndex], "axis");

                if (axis == "z") {
                    z = this.reader.getFloat(keyframes[j].children[rotationZIndex], "angle");
                } else if (axis == "x") {
                    x = this.reader.getFloat(keyframes[j].children[rotationZIndex], "angle");
                    this.onXMLMinorError("x rotation out of order on animation " + animationID + " on instant " + instant);
                } else if (axis == "y") {
                    y = this.reader.getFloat(keyframes[j].children[rotationZIndex], "angle");
                    this.onXMLMinorError("y rotation out of order on animation " + animationID + " on instant " + instant);
                }


                keyframe.addRotation(x, y, z);

                if (scaleIndex < 0) {
                    this.onXMLMinorError("No scale index on animation " + animationID + "on instant" + instant);
                    continue;
                } else if (scaleIndex != 4) {
                    this.onXMLMinorError("z rotation out of order on animation " + animationID + " on instant " + instant);
                }

                x = this.reader.getFloat(keyframes[j].children[scaleIndex], "x");
                y = this.reader.getFloat(keyframes[j].children[scaleIndex], "y");
                z = this.reader.getFloat(keyframes[j].children[scaleIndex], "z");

                keyframe.addScale(x, y, z);
                animation.addKeyframe(keyframe);
            }

            this.scene.animations.push(animation);
        }
        this.log("Parsed animations");
    }

    /**
     * Parses the <spritesheet> node.
     * @param {spritesheet block element} spritesheetsNode
     */
    parseSpritesheets(spritesheetNode) {
        var children = spritesheetNode.children;

        // Any number of animations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "spritesheet") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current animation.
            var spritesheetID = this.reader.getString(children[i], 'id');
            if (spritesheetID == null)
                return "no ID defined for spritesheet";

            // Checks for repeated IDs.
            if (this.scene.spritesheets[spritesheetID] != null)
                return "ID must be unique for each spritesheet (conflict: ID = " + spritesheetID + ")";

            let path = this.reader.getString(children[i], 'path');
            if (path == null) {
                this.onXMLError("No path on spritesheet " + spritesheetID);
                continue;
            }

            let sizeM = this.reader.getFloat(children[i], 'sizeM');
            if (sizeM == null) {
                this.onXMLError("No sizeM on spritesheet " + spritesheetID);
                continue;
            }
            let sizeN = this.reader.getFloat(children[i], 'sizeN');
            if (sizeN == null) {
                this.onXMLError("No sizeN on spritesheet " + spritesheetID);
                continue;
            }

            let spritesheet = {
                id : spritesheetID,
                path: path,
                sizeM: sizeM,
                sizeN: sizeN
            }

            this.scene.spritesheets.push(spritesheet);
        }

    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
    parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];
        var error;

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var component = this.scene.getComponent(nodeID);
            if (component != null) {
                component.load();
            }
            else {
                this.scene.components.push(
                    new MyComponent(
                        this.scene,
                        nodeID,
                        true
                    )
                );
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");
            var animationIndex = nodeNames.indexOf("animationref");

            // Transformations
            if (transformationsIndex < 0) {
                this.onXMLMinorError("No transformations on " + nodeID + " node. Using no transformations.")
            } else {
                if ((error = this.parseTransformations(nodeID, grandChildren, transformationsIndex)) != null) return error;
            }

            // Changes material on component with id = nodeId
            if (materialIndex < 0) {
                this.onXMLMinorError("No material on " + nodeID + " node. Using 'null'.");
            } else {
                component = this.scene.getComponent(nodeID);
                var material = this.reader.getString(grandChildren[materialIndex], 'id');
                if (material != "null") {
                    if (this.scene.getMaterial(material) != null)
                        component.material = material;
                    else
                        this.onXMLError("Material on node " + nodeID + " is not defined. Using 'null'");
                }
            }
            // Changes texture on component with id = nodeId
            if (textureIndex < 0) {
                this.onXMLMinorError("No texture on " + nodeID + " node. Using 'null', afs=1 and aft=1.");
            } else {
                component = this.scene.getComponent(nodeID);

                var texture = this.reader.getString(grandChildren[textureIndex], "id");
                if (texture != "null") {
                    if (this.scene.getTexture(texture) != null || texture == "clear")
                        component.texture = texture;
                    else
                        this.onXMLError("Texture on node " + nodeID + " is not defined. Using 'null'");
                }

                var amplifications = grandChildren[textureIndex].children[0];
                let afs = this.reader.getFloat(amplifications, 'afs');
                let aft = this.reader.getFloat(amplifications, 'aft');
                if (afs == null) {
                    this.onXMLMinorError("afs not defined on " + nodeID + ". Using 1.0");
                    component.amplifications.push(1);
                } else
                    component.amplifications.push(afs);
                if (aft == null) {
                    this.onXMLMinorError("aft not defined on " + nodeID + ". Using 1.0");
                    component.amplifications.push(1);
                } else
                    component.amplifications.push(aft);
            }

            // Animation
            if (animationIndex > 0) {
                let animationId = this.reader.getString(grandChildren[animationIndex], 'id');
                if (animationId == null)
                    this.onXMLError(nodeID + " has no animation");
                else {
                    let animation = this.scene.getAnimation(animationId);
                    if (animation == null)
                        this.onXMLError(nodeID + " has an undefined animation");
                    else
                        component.animation = animation;
                }
            }


            // Descendants
            if (descendantsIndex < 0) {
                this.onXMLError(nodeID + " has no descendants");
            } else {
                if ((error = this.parseDescendants(nodeID, grandChildren, descendantsIndex)) != null) return error;
            }


        }

        for (const component of this.scene.components) {
            if (!component.loaded) return ("Node " + component.id + " referenced but not defined.")
        }
        this.log("Parsed nodes");
    }
    /**
     * Parses all transformations from a node
     * @param {String} nodeId - current node's Id
     * @param {*} grandChildren - all  node's children
     * @param {int} transformationsIndex - index from the grandchildren with 'transformations' nodeValue
     */
    parseTransformations(nodeID, grandChildren, transformationsIndex) {
        for (var j = 0; j < grandChildren[transformationsIndex].children.length; j++) {
            var transformation = grandChildren[transformationsIndex].children[j];
            var component = this.scene.getComponent(nodeID);

            var attributes = [];

            let transformationName = transformation.nodeName;
            if (transformationName == "rotation") {
                let axis = this.reader.getString(transformation, "axis");
                let angle = this.reader.getFloat(transformation, "angle");
                if (axis == null || angle == null) {
                    this.onXMLError("Rotation from node " + nodeID + " is not well defined.");
                } else {
                    attributes.push(transformationName);
                    attributes.push(axis);
                    attributes.push(angle);
                }
            } else if (transformationName == "translation") {
                let x = this.reader.getFloat(transformation, "x");
                let y = this.reader.getFloat(transformation, "y");
                let z = this.reader.getFloat(transformation, "z");
                if (x == null || y == null || z == null) {
                    this.onXMLError("Translation from node " + nodeID + " is not well defined.");
                } else {
                    attributes.push(transformationName);
                    attributes.push(x);
                    attributes.push(y);
                    attributes.push(z);
                }
            } else if (transformationName == "scale") {
                let sx = this.reader.getFloat(transformation, "sx");
                let sy = this.reader.getFloat(transformation, "sy");
                let sz = this.reader.getFloat(transformation, "sz");
                if (sx == null || sy == null || sz == null) {
                    this.onXMLError("Scale from node " + nodeID + " is not well defined.");
                } else {
                    attributes.push(transformationName);
                    attributes.push(sx);
                    attributes.push(sy);
                    attributes.push(sz);
                }
            } else {
                this.onXMLError("Unknown tranformation on node " + nodeID);
            }

            component.addTransformation(attributes);
        }
    }

    /**
     * Parses all descendants from a node
     * @param {*} nodeID - current node's Id
     * @param {*} grandChildren - all  node's children
     * @param {*} descendantsIndex - index from the grandchildren with 'descendants' nodeValue
     */
    parseDescendants(nodeID, grandChildren, descendantsIndex) {
        if (grandChildren[descendantsIndex].children.length == 0) {
            this.onXMLMinorError(nodeID + " has no descendants.");
        }
        for (var j = 0; j < grandChildren[descendantsIndex].children.length; j++) {
            var descendant = grandChildren[descendantsIndex].children[j];

            let descendantName = descendant.nodeName;

            if (descendantName == "noderef") {
                // if the descendant its a node, create a MyComponent, add's it to the scene's components and to the component children
                var component = this.scene.getComponent(descendant.id);
                if (component == null) {
                    component = new MyComponent(this.scene, descendant.id, false)
                    this.scene.components.push(component);
                    this.scene.getComponent(nodeID).addChild(component);
                } else {
                    this.scene.getComponent(nodeID).addChild(component);
                }
            }
            // TODO: Parse other types of leafs
            else if (descendantName == "leaf") {
                let descendantType = this.reader.getString(descendant, 'type');
                // cylinder
                if (descendantType == "cylinder") {

                    var component = this.scene.getComponent(nodeID);
                    const height = this.reader.getFloat(descendant, 'height');
                    const topRadius = this.reader.getFloat(descendant, 'topRadius');
                    const bottomRadius = this.reader.getFloat(descendant, 'bottomRadius');
                    const stacks = this.reader.getFloat(descendant, 'stacks');
                    const slices = this.reader.getFloat(descendant, 'slices');
                    if (height == null || topRadius == null || bottomRadius == null || stacks == null || slices == null)
                        this.onXMLError("Cylinder from node " + nodeID + " not well defined.");
                    else {
                        component.addChild(
                            new MyCylinder(
                                this.scene,
                                height,
                                topRadius,
                                bottomRadius,
                                stacks,
                                slices
                            )
                        )
                    }
                    // sphere
                } else if (descendantType == "sphere") {

                    var component = this.scene.getComponent(nodeID);
                    const radius = this.reader.getFloat(descendant, 'radius');
                    const stacks = this.reader.getFloat(descendant, 'stacks');
                    const slices = this.reader.getFloat(descendant, 'slices');

                    if (radius == null || stacks == null || slices == null)
                        this.onXMLError("Sphere from node " + nodeID + " not well defined.");
                    else {
                        component.addChild(
                            new MySphere(
                                this.scene,
                                radius,
                                stacks,
                                slices
                            )
                        )
                    }
                    // rectangle
                } else if (descendantType == "rectangle") {

                    var component = this.scene.getComponent(nodeID);
                    const x1 = this.reader.getFloat(descendant, 'x1');
                    const y1 = this.reader.getFloat(descendant, 'y1');
                    const x2 = this.reader.getFloat(descendant, 'x2');
                    const y2 = this.reader.getFloat(descendant, 'y2');

                    if (x1 == null || x2 == null || y1 == null || y2 == null)
                        this.onXMLError("Rectangle from node " + nodeID + " not well defined.");
                    else {
                        component.addChild(
                            new MyRectangle(
                                this.scene,
                                x1,
                                y1,
                                x2,
                                y2
                            )
                        )
                    }
                    // torus
                } else if (descendantType == "torus") {

                    var component = this.scene.getComponent(nodeID);
                    const inner = this.reader.getFloat(descendant, 'inner');
                    const outer = this.reader.getFloat(descendant, 'outer');
                    const slices = this.reader.getFloat(descendant, 'slices');
                    const loops = this.reader.getFloat(descendant, 'loops');

                    if (inner == null || outer == null || slices == null || loops == null)
                        this.onXMLError("Torus from node " + nodeID + " not well defined.");
                    else {
                        component.addChild(
                            new MyTorus(
                                this.scene,
                                inner,
                                outer,
                                slices,
                                loops
                            )
                        )
                    }
                    // triangle
                } else if (descendantType == "triangle") {

                    var component = this.scene.getComponent(nodeID);
                    const x1 = this.reader.getFloat(descendant, 'x1');
                    const y1 = this.reader.getFloat(descendant, 'y1');
                    const x2 = this.reader.getFloat(descendant, 'x2');
                    const y2 = this.reader.getFloat(descendant, 'y2');
                    const x3 = this.reader.getFloat(descendant, 'x3');
                    const y3 = this.reader.getFloat(descendant, 'y3');

                    if (x1 == null || x2 == null || x3 == null || y1 == null || y2 == null || y3 == null)
                        this.onXMLError("Rectangle from node " + nodeID + " not well defined.");
                    else {
                        component.addChild(
                            new MyTriangle(
                                this.scene,
                                x1,
                                y1,
                                x2,
                                y2,
                                x3,
                                y3,
                            )
                        )
                    }
                } else if (descendantType == "spriteanim") {

                    var component = this.scene.getComponent(nodeID);
                    const spritesheetID = this.reader.getString(descendant, "ssid");
                    const startCell = this.reader.getFloat(descendant, "startCell");
                    const endCell = this.reader.getFloat(descendant, "endCell");
                    const duration = this.reader.getFloat(descendant, "duration");

                    if (spritesheetID == null || startCell == null || endCell == null || duration == null){
                        this.onXMLError("Spriteanim from node " + nodeID + " not well defined.");
                    } else {
                        let spritesheet = this.scene.getSpriteSheet(spritesheetID);
                        let spriteAnim = new MySpriteAnim(
                            this.scene,
                            spritesheetID,
                            spritesheet.path,
                            spritesheet.sizeM,
                            spritesheet.sizeN,
                            startCell,
                            endCell,
                            duration
                        )
                        this.scene.spriteAnims.push(spriteAnim);
                        component.addChild(spriteAnim);
                    }
                } else if (descendantType == "spritetext") {
                    var component = this.scene.getComponent(nodeID);
                    const spritetext = this.reader.getString(descendant, "text");

                    if (spritetext == null){
                        this.onXMLError("No text on spritetext from node " + nodeID);
                    } else {
                        component.addChild(
                            new MySpriteText(
                                this.scene,
                                spritetext
                            )
                        );
                    }
                } else if (descendantType == "plane") {
                    var component = this.scene.getComponent(nodeID);
                    const npartsU = this.reader.getFloat(descendant, "npartsU");
                    const npartsV = this.reader.getFloat(descendant, "npartsV");

                    if (npartsU == null || npartsV == null){
                        this.onXMLError("Plane from node " + nodeID + " not well defined.");
                    } else {
                        component.addChild(
                            new Plane(
                                this.scene,
                                npartsU,
                                npartsV
                            )
                        );
                    }
                }else if (descendantType == "patch") {
                    var component = this.scene.getComponent(nodeID);
                    const npointsU = this.reader.getFloat(descendant, "npointsU");
                    const npointsV = this.reader.getFloat(descendant, "npointsV");
                    const npartsU = this.reader.getFloat(descendant, "npartsU");
                    const npartsV = this.reader.getFloat(descendant, "npartsV");

                    var controlPoints = [];


                    var temp = descendant.children.length;

                    for (let i=0;i<temp;i++){
                        if (descendant.children[i].nodeName == "controlpoint"){
                            var x = this.reader.getFloat(descendant.children[i], 'x');
                            if (!(x != null && !isNaN(x)))
                                return "unable to parse x value for primitive with ID = " + nodeID;

                            var y = this.reader.getFloat(descendant.children[i], 'y');
                            if (!(y != null && !isNaN(y)))
                                return "unable to parse y value for primitive with ID = " + nodeID;

                            var z = this.reader.getFloat(descendant.children[i], 'z');
                            if (!(z != null && !isNaN(z)))
                                return "unable to parse zz value for primitive with ID = " + nodeID;
                        }

                        controlPoints.push([x, y, z, 1]);

                    }
                    if (npartsU == null || npartsV == null || npointsU == null || npointsV== null){
                        this.onXMLError("Patch from node " + nodeID + " not well defined.");
                    } else {
                        component.addChild(
                            new MyPatch(
                                this.scene,
                                npointsU,
                                npointsV,
                                npartsU,
                                npartsV,
                                controlPoints)
                        );
                    }
                }else if (descendantType == "defbarrel") {
                    var component = this.scene.getComponent(nodeID);
                    const base = this.reader.getFloat(descendant, "base");
                    const middle = this.reader.getFloat(descendant, "middle");
                    const height = this.reader.getFloat(descendant, "height");
                    const slices = this.reader.getFloat(descendant, "slices");
                    const stacks = this.reader.getFloat(descendant, "stacks");

                    if (base == null || middle == null || height == null || slices == null || stacks == null){
                        this.onXMLError("Barrel from node " + nodeID + " not well defined.");
                    } else {
                        component.addChild(
                            new MyBarrel(
                                this.scene,
                                base,
                                middle,
                                height,
                                slices,
                                stacks)
                        );
                    }
                }
                else {
                    this.onXMLError("No type attribute on a leaf on " + nodeID + ".");
                }
            } else {
                this.onXMLError("Unknown descendant on " + nodeID + ".");
            }
        }
    }


    parseBoolean(node, name, messageError) {
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

        return boolVal || 0;
    }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.scene.getComponent(this.idRoot).display();
    }
}