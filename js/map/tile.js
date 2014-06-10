(function (window) {
    function tile(x, y) {
        this.initialize(x, y);
    }
    tile.prototype = new window.createjs.Container();
    tile.prototype.coordX = 0;
    tile.prototype.coordY = 0;
    tile.prototype.info = {};

    // constructor:
    tile.prototype.Container_initialize = tile.prototype.initialize;

    tile.prototype.initialize = function (x, y) {
        this.Container_initialize();
        //var tileimage = new window.createjs.Shape();
        //tileimage.graphics.beginFill("rgba(64, " + tileinfo + ", 64, " + tileinfo / 128 + ")").drawRect(0, 0, TILESIZE, TILESIZE);
        //this.addChild(tileimage);
        var ground = new createjs.BitmapAnimation(window.terrain_spritesheet);
        var overlay = new createjs.BitmapAnimation(window.terrain_spritesheet);
        var tileinfo = window.terrainarray[x][y];
        this.info.height = tileinfo.height;
        var tilecurve;
        if (this.info.height < window.boundaries.water) {
            tileinfo.type = 'water';
            tilecurve = getTileCurve(x, y);
            if (tilecurve !== 'center') {
                ground.gotoAndStop("dirt_center");
                this.addChild(ground);
            } else {
                var rand = window.random(tileinfo.type + "_" + this.info.height + x + y);
                if (rand > 0.98) {
                    tilecurve = "anomaly_1";
                } else if (rand > 0.96) {
                    tilecurve = "anomaly_2";
                } else if (rand > 0.94) {
                    tilecurve = "anomaly_3";
                } 
            }

            overlay.gotoAndStop(tileinfo.type + "_" + tilecurve);
            this.addChild(overlay);
        } else if (this.info.height < window.boundaries.dirt) {
            tileinfo.type = 'dirt';
            var rand = window.random(tileinfo.type + "_" + this.info.height + x + y);
            if (rand > 0.98) {
                ground.gotoAndStop("dirt_anomaly_1");
            } else if (rand > 0.95) {
                ground.gotoAndStop("dirt_anomaly_2");
            } else if (rand > 0.85) {
                ground.gotoAndStop("dirt_anomaly_3");
            } else {
                ground.gotoAndStop("dirt_center");
            }
            this.addChild(ground);
        } else if (this.info.height < window.boundaries.grass) {
            tileinfo.type = 'grass';
            tilecurve = getTileCurve(x, y);
            if (tilecurve !== 'center') {
                ground.gotoAndStop("dirt_center");
                this.addChild(ground);
            } else {
                var rand = window.random(tileinfo.type + "_" + this.info.height + x + y);
                if (rand > 0.98) {
                    tilecurve = "anomaly_1";
                } else if (rand > 0.92) {
                    tilecurve = "anomaly_2";
                } else if (rand > 0.85) {
                    tilecurve = "anomaly_3";
                }
            }
            overlay.gotoAndStop(tileinfo.type + "_" + tilecurve);
            this.addChild(overlay);
            if (tileinfo.mountain_solid !== undefined) {
                var mountain_solid_image = new createjs.BitmapAnimation(window.terrain_spritesheet);
                if (tileinfo.mountain_foot !== undefined) {
                    var mountain_foot_image = new createjs.BitmapAnimation(window.terrain_spritesheet);
                    mountain_foot_image.gotoAndStop('mountain_foot_middle');
                    this.addChild(mountain_foot_image);
                } 
                mountain_solid_image.gotoAndStop(tileinfo.mountain_solid);
                this.addChild(mountain_solid_image);
            } else if (tileinfo.mountain_foot !== undefined) {
                var mountain_foot_image = new createjs.BitmapAnimation(window.terrain_spritesheet);
                mountain_foot_image.gotoAndStop(tileinfo.mountain_foot);
                this.addChild(mountain_foot_image);
            }
        } else {
            tileinfo.type = 'mountain';
            tilecurve = getTileCurve(x, y);
            if (tilecurve !== 'center') {
                ground.gotoAndStop("grass_center");
                this.addChild(ground);
            }
            var paintoverlay = false;
            if (tileinfo.mountain_solid !== undefined) {
                var mountain_solid_image = new createjs.BitmapAnimation(window.terrain_spritesheet);
                if (tilecurve === 'left' && tileinfo === 'right') {
                    mountain_solid_image.gotoAndStop(tileinfo.mountain_solid);
                } else {
                    mountain_solid_image.gotoAndStop('mountain_solid_middle');
                    paintoverlay = true;
                }
                this.addChild(mountain_solid_image);
            }
            if (tileinfo.mountain_foot !== undefined) {
                var mountain_foot_image = new createjs.BitmapAnimation(window.terrain_spritesheet);
                if (tilecurve === 'left' && tileinfo === 'right') {
                    mountain_foot_image.gotoAndStop(tileinfo.mountain_foot);
                } else {
                    mountain_foot_image.gotoAndStop('mountain_foot_middle');
                    paintoverlay = true;
                }
                this.addChild(mountain_foot_image);
            } else {
                paintoverlay = true;
            }
            if (paintoverlay === true) {
                overlay.gotoAndStop(tileinfo.type + "_" + tilecurve);
                this.addChild(overlay);
            }
            if (y + 1 < MAPSIZE) {
                switch (tilecurve) {
                    case 'bottomleft':
                        window.terrainarray[x][y + 1].mountain_solid = 'mountain_solid_left';
                        break;
                    case 'bottom':
                        window.terrainarray[x][y + 1].mountain_solid = 'mountain_solid_middle';
                        break;
                    case 'bottomright':
                        window.terrainarray[x][y + 1].mountain_solid = 'mountain_solid_right';
                        break;
                    case 'notbottomleft':
                        window.terrainarray[x][y + 1].mountain_solid = 'mountain_solid_middle_left';
                        break;
                    case 'notbottomright':
                        window.terrainarray[x][y + 1].mountain_solid = 'mountain_solid_middle_right';
                        break;
                    case 'narrow':
                        var type = getTypeNumber(this.info.height);
                        if (getAdjacentDifference(type, x, y + 1) === 1) {
                            window.terrainarray[x][y + 1].mountain_solid = 'mountain_foot_narrow';
                        } else {
                            var mountain_narrow_image = new createjs.BitmapAnimation(window.terrain_spritesheet);
                            mountain_narrow_image.gotoAndStop('mountain_single');
                            this.addChild(mountain_narrow_image);
                        }
                        break;
                }
                if (y + 2 < MAPSIZE) {
                    switch (tilecurve) {
                        case 'bottomleft':
                            window.terrainarray[x][y + 2].mountain_foot = 'mountain_foot_left';
                            break;
                        case 'bottom':
                            window.terrainarray[x][y + 2].mountain_foot = 'mountain_foot_middle';
                            break;
                        case 'bottomright':
                            window.terrainarray[x][y + 2].mountain_foot = 'mountain_foot_right';
                            break;
                        case 'notbottomleft':
                            window.terrainarray[x][y + 2].mountain_foot = 'mountain_foot_middle_left';
                            break;
                        case 'notbottomright':
                            window.terrainarray[x][y + 2].mountain_foot = 'mountain_foot_middle_right';
                            break;
                    }
                }
            }
        }
        this.coordX = x;
        this.coordY = y;
        this.x = x * TILESIZE;
        this.y = y * TILESIZE;
    };

    tile.prototype.update = function (event) {
    };

    window.Tile = tile;
}(window));

function getAdjacentDifference(type, ax, ay) {
    var adjacenttileinfo = window.terrainarray[ax][ay];
    var adjacenttype;
    if (adjacenttileinfo.height < window.boundaries.water) {
        adjacenttype = 1; //'Water';
    } else if (adjacenttileinfo.height < window.boundaries.dirt) {
        adjacenttype = 0; //'Dirt';
    } else if (adjacenttileinfo.height < window.boundaries.grass) {
        adjacenttype = 2; //'Grass';
    } else {
        adjacenttype = 3; //'Moutain';
    }
    return adjacenttype < type ? 0 : 1;
};

function getTypeNumber(tileinfo) {
    if (tileinfo.height < window.boundaries.water) {
        return 1; //'Water';
    } else if (tileinfo.height >= window.boundaries.dirt && tileinfo.height < window.boundaries.grass) {
        return 2; //'Grass';
    } else if (tileinfo.height >= window.boundaries.grass) {
        return 3; //'Moutain';
    } else {
        return 0; //'Water';
    }
}

function getTileCurve(x, y) {
    var tileinfo = window.terrainarray[x][y];
    function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    };
    var type = getTypeNumber(tileinfo);
    var matrix = [
        y - 1 < 0 ? 1 : getAdjacentDifference(type, x, y - 1),
        x + 1 > MAPSIZE - 1 ? 1 : getAdjacentDifference(type, x + 1, y),
        y + 1 > MAPSIZE - 1 ? 1 : getAdjacentDifference(type, x, y + 1),
        x - 1 < 0 ? 1 : getAdjacentDifference(type, x - 1, y)];
    if (arraysEqual(matrix, [1, 1, 1, 1])) {
        matrix = [
        x - 1 < 0 || y - 1 < 0 ? 1 : getAdjacentDifference(type, x - 1, y - 1),
        x + 1 > MAPSIZE - 1 || y - 1 < 0 ? 1 : getAdjacentDifference(type, x + 1, y - 1),
        x + 1 > MAPSIZE - 1 || y + 1 > MAPSIZE - 1 ? 1 : getAdjacentDifference(type, x + 1, y + 1),
        x - 1 < 0 || y + 1 > MAPSIZE - 1 ? 1 : getAdjacentDifference(type, x - 1, y + 1)];
        if (arraysEqual(matrix, [0, 1, 1, 1])) {
            return 'nottopleft';
        } else if (arraysEqual(matrix, [1, 0, 1, 1])) {
            return 'nottopright';
        } else if (arraysEqual(matrix, [1, 1, 1, 0])) {
            return 'notbottomleft';
        } else if (arraysEqual(matrix, [1, 1, 0, 1])) {
            return 'notbottomright';
        } else if (arraysEqual(matrix, [0, 0, 1, 1])) {
            return 'top';
        } else if (arraysEqual(matrix, [1, 0, 0, 1])) {
            return 'right';
        } else if (arraysEqual(matrix, [1, 1, 0, 0])) {
            return 'bottom';
        } else if (arraysEqual(matrix, [0, 1, 1, 0])) {
            return 'left';
        } else if (arraysEqual(matrix, [0, 0, 1, 0])) {
            return 'topleft';
        } else if (arraysEqual(matrix, [0, 0, 0, 1])) {
            return 'topright';
        } else if (arraysEqual(matrix, [1, 0, 0, 0])) {
            return 'bottomright';
        } else if (arraysEqual(matrix, [0, 1, 0, 0])) {
            return 'bottomleft';
        } else {
            return 'center';
        }
    } else if (arraysEqual(matrix, [0, 1, 1, 1])) {
        return 'top';
    } else if (arraysEqual(matrix, [1, 0, 1, 1])) {
        return 'right';
    } else if (arraysEqual(matrix, [1, 1, 0, 1])) {
        return 'bottom';
    } else if (arraysEqual(matrix, [1, 1, 1, 0])) {
        return 'left';
    } else if (arraysEqual(matrix, [0, 1, 1, 0])) {
        return 'topleft';
    } else if (arraysEqual(matrix, [0, 0, 1, 1])) {
        return 'topright';
    } else if (arraysEqual(matrix, [1, 1, 0, 0])) {
        return 'bottomleft';
    } else if (arraysEqual(matrix, [1, 0, 0, 1])) {
        return 'bottomright';
    } else if (arraysEqual(matrix, [0, 0, 0, 0])) {
        return 'single';
    } else {
        return 'narrow';
    }
};

