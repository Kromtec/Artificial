(function (window) {
    function tree(x, y) {
        this.initialize(x, y);
    }
    tree.prototype = new window.createjs.Container();
    tree.prototype.coordX = 0;
    tree.prototype.coordY = 0;
    tree.prototype.info = {};

    // constructor:
    tree.prototype.Container_initialize = tree.prototype.initialize;

    tree.prototype.initialize = function (x, y) {
        this.Container_initialize();
        var offsetX;
        var offsetY;
        var height = window.treemaparray[x][y].height;
        var tree;
        if (height < 64) {
            if (height < 24) {
                tree = new createjs.Bitmap(window.preload.getResult("broadleaf_very_big"));
                tree.x = -TILESIZE;
                tree.y = -TILESIZE * 4;
                this.addChild(tree);
            } else if (height < 48) {
                if (random(x + " " + y) > 0.5) {
                    tree = new createjs.Bitmap(window.preload.getResult("broadleaf_big"));
                } else {
                    tree = new createjs.Bitmap(window.preload.getResult("broadleaf_cone"));
                }
                tree.x = -TILESIZE;
                tree.y = -TILESIZE * 3;
                this.addChild(tree);
            } else {
                tree = new createjs.Bitmap(window.preload.getResult("broadleaf_small"));
                tree.x = -TILESIZE / 2;
                tree.y = -TILESIZE * 2;
                this.addChild(tree);
            }
        } else {
            if (height > 232) {
                tree = new createjs.Bitmap(window.preload.getResult("conifer_slim"));
                tree.x = -TILESIZE;
                tree.y = -TILESIZE * 4;
                this.addChild(tree);
            } else if (height > 192) {
                tree = new createjs.Bitmap(window.preload.getResult("conifer_big"));
                tree.x = -TILESIZE;
                tree.y = -TILESIZE * 3;
                this.addChild(tree);
            } else {
                tree = new createjs.Bitmap(window.preload.getResult("conifer_medium"));
                tree.x = -TILESIZE;
                tree.y = -TILESIZE * 3;
                this.addChild(tree);
            }
        }
        this.coordX = x;
        this.coordY = y;
        this.x = x * TILESIZE;
        this.y = y * TILESIZE;
    };

    tree.prototype.update = function (event) {
    };

    window.Tree = tree;
}(window));

