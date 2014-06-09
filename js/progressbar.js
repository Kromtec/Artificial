(function (window) {
    function progressbar(width, height, color) {
        this.initialize(width, height, color);
    }
    progressbar.prototype = new window.createjs.Container();


    // constructor:
    progressbar.prototype.Container_initialize = progressbar.prototype.initialize;

    progressbar.prototype.ptext;
    progressbar.prototype.pbar;
    progressbar.prototype.maxbarwidth = 0;

    progressbar.prototype.initialize = function (width, height, color) {
        this.Container_initialize();
        this.maxbarwidth = width;
        this.ptext = new window.createjs.Text("", "16px Arial", "white");
        this.ptext.lineWidth = this.maxbarwidth;
        this.ptext.textAlign = "left";
        this.ptext.x = 0;
        this.ptext.y = - 25;
        this.pbar = new window.createjs.Shape();
        this.pbar.graphics.beginFill(color).drawRect(0, 0, 1, height).endFill();
        var padding = 3;
        var frame = new window.createjs.Shape();
        frame.graphics.setStrokeStyle(1).beginStroke(color).drawRect(-padding / 2, -padding / 2, this.maxbarwidth + padding, height + padding);
        this.x = Math.round((window.canvas.width / 2) - (this.maxbarwidth / 2));
        this.y = Math.round(window.canvas.height / 2);
        this.addChild(this.pbar, frame);
        this.addChild(this.ptext);
        window.stage.addChild(this);
    };

    progressbar.prototype.update = function (event) {
    };

    progressbar.prototype.text = function (s) {
        this.ptext.text = s;
        window.stage.update();
    };

    progressbar.prototype.progress = function (d) {
        this.pbar.scaleX = d * this.maxbarwidth;
        window.stage.update();
    };

    window.ProgressBar = progressbar;
}(window));

