
var KEYCODE_START = 49; // 1
var KEYCODE_RESET = 27; // ESC
var KEYCODE_ENTER = 13;
var KEYCODE_SPACE = 32;

var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var KEYCODE_UP = 38;
var KEYCODE_DOWN = 40;
var KEYCODE_W = 87;
var KEYCODE_A = 65;
var KEYCODE_S = 83;
var KEYCODE_D = 68;

var screen_width;
var screen_height;

var MAPSIZE = 256;
var TILESIZE = 32;

var map_go_left = false;
var map_go_right = false;
var map_go_up = false;
var map_go_down = false;

//allow for WASD and arrow control scheme
function handleKeyDown(event) {
    switch (event.keyCode) {
        case KEYCODE_A:
        case KEYCODE_LEFT:
            map_go_left = true;
            break;
        case KEYCODE_D:
        case KEYCODE_RIGHT:
            map_go_right = true;
            break;
        case KEYCODE_W:
        case KEYCODE_UP:
            map_go_up = true;
            break;
        case KEYCODE_S:
        case KEYCODE_DOWN:
            map_go_down = true;
            break;
        case KEYCODE_START:
            reset();
            init();
            break;
        case KEYCODE_RESET:
            reset();
            break;
    }
}

function handleKeyUp(event) {
    switch (event.keyCode) {
        case KEYCODE_A:
        case KEYCODE_LEFT:
            map_go_left = false;
            break;
        case KEYCODE_D:
        case KEYCODE_RIGHT:
            map_go_right = false;
            break;
        case KEYCODE_W:
        case KEYCODE_UP:
            map_go_up = false;
            break;
        case KEYCODE_S:
        case KEYCODE_DOWN:
            map_go_down = false;
            break;
    }
}

function init() {
    var urlobj = (new Util()).getUrlObject(window.location.href);
    if (urlobj.parameters.seed !== undefined) {
        window.RANDOM_MAP_VALUE = random(urlobj.parameters.seed);
    } else {
        window.RANDOM_MAP_VALUE = random(Math.random());
    }
    window.RANDOM_TREE_VALUE = random("TREE_" + window.RANDOM_MAP_VALUE);

    //find canvas and load images, wait for last image to load
    window.canvas = document.getElementById("html5Canvas");
    window.canvas.width = 1280; //window.innerWidth;
    window.canvas.height = 720; //window.innerHeight;

    // grab canvas width and height for later calculations:
    screen_width = window.canvas.width;
    screen_height = window.canvas.height;

    // create a new stage and point it at our canvas:
    window.stage = new window.createjs.Stage(window.canvas);
    window.stage.enableMouseOver(5);

    window.progressbar = new ProgressBar(200, 20, "#FFFFFF");

    window.contentManager = new ContentManager();
    window.contentManager.SetDownloadCompleted(startGame);
    window.contentManager.StartDownload();
}

function reset() {
    window.stage.removeAllChildren();
    window.createjs.Ticker.removeAllEventListeners();
    window.stage.update();
}

function startGame() {
    window.terrainarray = createArray(MAPSIZE, MAPSIZE);
    window.tilearray = createArray(MAPSIZE, MAPSIZE);
    window.treemaparray = createArray(MAPSIZE, MAPSIZE);
    window.treearray = createArray(MAPSIZE, MAPSIZE);
    window.terrain = new Terrain(MAPSIZE, MAPSIZE);
}

function tick(event) {
    window.position_changed = false;
    window.terrain.update(event);
    window.forest.update(event);
    window.fpsCounter.text = Math.round(window.createjs.Ticker.getMeasuredFPS()) + " FPS";

    // update the stage:
    window.stage.update();
}

function random(seed) {
    if (typeof seed === 'string' || seed instanceof String) {
        String.prototype.hashCode = function () {
            var hash = 0, i, chr, len;
            if (this.length === 0)
            {
                return hash;
            }
            for (i = 0, len = this.length; i < len; i++) {
                chr = this.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        };
        seed = seed.hashCode();
    }
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}