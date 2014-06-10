(function (window) {
    function forest() {
        this.initialize();
    }
    forest.prototype = new window.createjs.Container();

    // constructor:
    forest.prototype.Container_initialize = forest.prototype.initialize;
    forest.prototype.navspeed = 512;

    forest.prototype.initialize = function () {
        this.Container_initialize();
        window.current_column = 0;
        window.noise.seed(window.RANDOM_TREE_VALUE);
        setTimeout(generate_treemap, 10);
    };

    forest.prototype.update = function (event) {
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
            for (var x = window.terrain.current_min_tile_x ; x < window.terrain.current_max_tile_x ; x++) {
                for (var y = window.terrain.current_min_tile_y ; y < window.terrain.current_max_tile_y ; y++) {
                    // TREES
                    var tree = window.treearray[x][y];
                    if (tree !== undefined) {
                        if (this.contains(tree) === false && isInVisibleArea(tree) === true) {
                            if (map_go_up) {
                                this.addChildAt(tree, 0);
                            } else {
                                this.addChild(tree);
                            }
                        }
                    }
                }
            }
        }
    };

    function generate_treemap() {
        var x = window.current_column;
        for (var y = 0; y < window.treemaparray[x].length; y++) {
            var value = window.noise.simplex2(x / window.roughness, y / window.roughness);
            value = Math.round((value + 1) * 128);
            var treeinfo = {};
            treeinfo.height = value;
            window.treemaparray[x][y] = treeinfo;
        }
        if (window.current_column < window.treemaparray.length - 1) {
            if (window.current_column % (window.treemaparray.length / 4) === 0) {
                window.progressbar.progress((window.current_column / (window.treemaparray.length / 4)) / 20 + 0.5);
                window.progressbar.text("Generating tree map...");
            }
            window.current_column += 1;
            setTimeout(generate_treemap, 10);
        } else {
            window.current_column = 0;
            setTimeout(plant_trees, 10);
        }
    };

    function plant_trees() {
        var x = window.current_column;
        for (var y = 0 ; y < window.treemaparray[x].length; y += (5 + Math.round(random("TREESTART_Y_" + x * y) * 3))) {
            var jitter = Math.round(random("TREESTART_X_" + x * y) * 4 - 2)
            if (x + jitter > 0 && x + jitter < window.terrainarray.length) {
                x = x + jitter;
            }
            var tileinfo = window.terrainarray[x][y];
            if (tileinfo.type === 'grass' && tileinfo.height < 180 && (window.treemaparray[x][y].height < 64 || window.treemaparray[x][y].height > 160)) {
                var tree = new Tree(x, y);

                window.treearray[x][y] = tree;
                if (isInVisibleArea(tree) === true) {
                    window.forest.addChild(tree);
                }
            }
        }
        window.current_column += 5;
        if (window.current_column < window.treemaparray.length - 1) {
            if (window.current_column % (window.treemaparray.length / 4) === 0) {
                window.progressbar.progress((window.current_column / (window.treemaparray.length / 4)) / 20 + 0.7);
                window.progressbar.text("Planting trees...");
            }
            setTimeout(plant_trees, 10);
        } else {
            window.progressbar.progress(1);
            window.progressbar.text("Click to start!");
            window.canvas.addEventListener("click", finilize_map);
        }
    };

    function finilize_map() {
        window.canvas.removeEventListener("click", finilize_map);
        stage.addChild(window.terrain);
        stage.addChild(window.forest);
        window.terrain.current_min_tile_x = getMinXTileNumber(0);
        window.terrain.current_max_tile_x = getMaxXTileNumber(0);
        window.terrain.current_min_tile_y = getMinYTileNumber(0);
        window.terrain.current_max_tile_y = getMaxYTileNumber(0);

        window.fpsCounter = new window.createjs.Text("", "22px Audiowide", "white");
        fpsCounter.lineWidth = 100;
        fpsCounter.textAlign = "right";
        fpsCounter.x = window.canvas.width;
        window.stage.addChild(fpsCounter);

        window.createjs.Ticker.addEventListener('tick', tick);
        window.createjs.Ticker.setFPS(60);

        //register key functions
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;
    };

    window.Forest = forest;
}(window));

