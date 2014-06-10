(function (window) {
    function terrain(sizex, sizey) {
        this.initialize(sizex, sizey);
    }
    terrain.prototype = new window.createjs.Container();
    terrain.prototype.tilearray = [];
    terrain.prototype.navspeed = 512;

    terrain.prototype.current_min_tile_x = 0;
    terrain.prototype.current_max_tile_x = 0;
    terrain.prototype.current_min_tile_y = 0;
    terrain.prototype.current_max_tile_y = 0;

    // constructor:
    terrain.prototype.Container_initialize = terrain.prototype.initialize;

    terrain.prototype.initialize = function (sizex, sizey) {
        this.Container_initialize();

        window.boundaries = {
            water: 64,
            dirt: 80,
            grass: 192,
            mountain: 256,
        };

        window.terrain_spritesheet = new window.createjs.SpriteSheet({
            framerate: 10,
            images: [window.preload.getResult("terrain_atlas")],
            frames: { width: TILESIZE, height: TILESIZE },
            animations: {
                dirt_center: [115],
                dirt_top: [83],
                dirt_right: [116],
                dirt_bottom: [147],
                dirt_left: [114],
                dirt_topleft: [82],
                dirt_topright: [84],
                dirt_bottomleft: [146],
                dirt_bottomright: [148],
                dirt_nottopleft: [52],
                dirt_nottopright: [51],
                dirt_notbottomleft: [20],
                dirt_notbottomright: [19],
                dirt_single: [50],
                dirt_narrow: [18],
                dirt_anomaly_1: [178],
                dirt_anomaly_2: [179],
                dirt_anomaly_3: [180],
                water_center: [394],
                water_top: [362],
                water_right: [395],
                water_bottom: [426],
                water_left: [393],
                water_topleft: [361],
                water_topright: [363],
                water_bottomleft: [425],
                water_bottomright: [427],
                water_nottopleft: [331],
                water_nottopright: [330],
                water_notbottomleft: [299],
                water_notbottomright: [298],
                water_single: [329],
                water_narrow: [297],
                water_anomaly_1: [565],
                water_anomaly_2: [566],
                water_anomaly_3: [567],
                grass_center: [118],
                grass_top: [86],
                grass_right: [119],
                grass_bottom: [150],
                grass_left: [117],
                grass_topleft: [85],
                grass_topright: [87],
                grass_bottomleft: [149],
                grass_bottomright: [151],
                grass_nottopleft: [55],
                grass_nottopright: [54],
                grass_notbottomleft: [23],
                grass_notbottomright: [22],
                grass_single: [53],
                grass_narrow: [21],
                grass_anomaly_1: [181],
                grass_anomaly_2: [182],
                grass_anomaly_3: [183],
                mountain_center: [33],
                mountain_top: [1],
                mountain_right: [34],
                mountain_bottom: [65],
                mountain_left: [32],
                mountain_topleft: [0],
                mountain_topright: [2],
                mountain_bottomleft: [64],
                mountain_bottomright: [66],
                mountain_nottopleft: [3],
                mountain_nottopright: [4],
                mountain_notbottomleft: [35],
                mountain_notbottomright: [36],
                mountain_single: [234],
                mountain_narrow: [702],
                mountain_solid_left: [96],
                mountain_solid_middle: [97],
                mountain_solid_right: [98],
                mountain_solid_middle_left: [67],
                mountain_solid_middle_right: [68],
                mountain_foot_left: [128],
                mountain_foot_middle: [129],
                mountain_foot_right: [130],
                mountain_foot_middle_left: [99],
                mountain_foot_middle_right: [100],
                mountain_foot_narrow: [734],
            }
        });

        window.noise.seed(window.RANDOM_MAP_VALUE);
        window.roughness = TILESIZE * 1.8;

        window.current_column = 0;
        setTimeout(generate_heightmap, 10);
    };

    terrain.prototype.update = function (event) {
        var delta = Math.floor(this.navspeed * (event.delta / 1000));
        if (map_go_left) {
            this.x += delta;
            if (this.x > 0) {
                this.x = 0;
            }
        }
        if (map_go_right) {
            this.x -= delta;
            if (this.x < -MAPSIZE * TILESIZE + screen_width) {
                this.x = -MAPSIZE * TILESIZE + screen_width;
            }
        }
        if (map_go_up) {
            this.y += delta;
            if (this.y > 0) {
                this.y = 0;
            }
        }
        if (map_go_down) {
            this.y -= delta;
            if (this.y < -MAPSIZE * TILESIZE + screen_height) {
                this.y = -MAPSIZE * TILESIZE + screen_height;
            }
        }
        if (map_go_left || map_go_right) {
            var new_min_tile_x = getMinXTileNumber(this.x);
            if (this.current_min_tile_x !== new_min_tile_x) {
                this.current_min_tile_x = new_min_tile_x;
                window.position_changed = true;
            }
            var new_max_tile_x = getMaxXTileNumber(this.x);
            if (this.current_max_tile_x !== new_max_tile_x) {
                this.current_max_tile_x = new_max_tile_x;
                window.position_changed = true;
            }
        }
        if (map_go_up || map_go_down) {
            var new_min_tile_y = getMinYTileNumber(this.y);
            if (this.current_min_tile_y !== new_min_tile_y) {
                this.current_min_tile_y = new_min_tile_y;
                window.position_changed = true;
            }
            var new_max_tile_y = getMaxYTileNumber(this.y);
            if (this.current_max_tile_y !== new_max_tile_y) {
                this.current_max_tile_y = new_max_tile_y;
                window.position_changed = true;
            }
        }
        if (window.position_changed === true) {
            var childsToRemove = [];
            var shape_count = this.getNumChildren() - 1;
            for (var i = 0; i <= shape_count; i++) {
                var shape = this.getChildAt(i);

                if (isInVisibleArea(shape) === false) {
                    childsToRemove.push(shape);
                }
            }
            for (var j = 0; j < childsToRemove.length; j++) {
                this.removeChild(childsToRemove[j]);
            }
            for (var x = this.current_min_tile_x ; x < this.current_max_tile_x ; x++) {
                for (var y = this.current_min_tile_y ; y < this.current_max_tile_y ; y++) {
                    // TILES
                    var tile = window.tilearray[x][y];
                    if (tile !== undefined) {
                        if (this.contains(tile) === false && isInVisibleArea(tile) === true) {
                            this.addChildAt(tile, 0);
                        }
                    }
                }
            }
        }
    };

    function generate_heightmap() {
        var x = window.current_column;
        for (var y = 0; y < window.terrainarray[x].length; y++) {
            var value = window.noise.simplex2(x / window.roughness, y / window.roughness);
            value = Math.round((value + 1) * 128);
            var tileinfo = {};
            tileinfo.height = value;
            window.terrainarray[x][y] = tileinfo;
        }
        if (window.current_column < window.terrainarray.length - 1) {
            if (window.current_column % (window.terrainarray.length / 4) === 0) {
                window.progressbar.progress((window.current_column / (window.terrainarray.length / 4)) / 20 + 0.1);
                window.progressbar.text("Generating height map...");
            }
            window.current_column += 1;
            setTimeout(generate_heightmap, 10);
        } else {
            window.current_column = 0;
            setTimeout(generate_tiles, 10);
        }
    };

    function generate_tiles() {
        var x = window.current_column;
        for (var y = 0; y < window.terrainarray[x].length; y++) {
            var tile = new window.Tile(x, y);

            window.tilearray[x][y] = tile;
            if (isInVisibleArea(tile) === true) {
                window.terrain.addChild(tile);
            }
        }
        if (window.current_column < window.terrainarray.length - 1) {
            if (window.current_column % (window.terrainarray.length / 4) === 0) {
                window.progressbar.progress((window.current_column / (window.terrainarray.length / 4)) / 20 + 0.3);
                window.progressbar.text("Building tiles...");
            }
            window.current_column += 1;
            setTimeout(generate_tiles, 10);
        } else {
            window.forest = new Forest();
        }
    };

    window.Terrain = terrain;
}(window));

function getMinXTileNumber(offset) {
    return Math.max(0, Math.round((-offset - TILESIZE) / TILESIZE));
}

function getMaxXTileNumber(offset) {
    return Math.min(MAPSIZE, Math.round((-offset + screen_width + TILESIZE) / TILESIZE));
}

function getMinYTileNumber(offset) {
    return Math.max(0, Math.round((-offset - TILESIZE) / TILESIZE));
}

function getMaxYTileNumber(offset) {
    return Math.min(MAPSIZE, Math.round((-offset + screen_height + TILESIZE) / TILESIZE));
}

function isInVisibleArea(element) {
    var minX = -window.terrain.x - TILESIZE;
    var maxX = -window.terrain.x + screen_width + TILESIZE;
    var minY = -window.terrain.y - TILESIZE;
    var maxY = -window.terrain.y + screen_height + TILESIZE;
    if (element.x < minX || element.x > maxX) {
        return false;
    } else if (element.y < minY || element.y > maxY) {
        return false;
    }
    return true;
};

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }

    return arr;
}