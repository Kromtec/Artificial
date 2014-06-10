// Used to download all needed resources from our
// webserver
function ContentManager() {
    // Method called back once all elements have been downloaded
    var ondownloadcompleted;

    // setting the callback method
    this.SetDownloadCompleted = function (callbackMethod) {
        ondownloadcompleted = callbackMethod;
    };

    // public method to launch the download process
    this.StartDownload = function () {

        window.preload = new window.createjs.LoadQueue(false);
        window.preload.addEventListener("complete", handleComplete);
        window.preload.addEventListener("progress", handleProgress);

        window.preload.loadManifest([
            { id: "terrain_atlas", src: "img/terrain_atlas.png" },
            { id: "broadleaf_small", src: "img/trees/broadleaf_small.png" },
            { id: "broadleaf_big", src: "img/trees/broadleaf_big.png" },
            { id: "broadleaf_very_big", src: "img/trees/broadleaf_very_big.png" },
            { id: "broadleaf_cone", src: "img/trees/broadleaf_cone.png" },
            { id: "conifer_big", src: "img/trees/conifer_big.png" },
            { id: "conifer_medium", src: "img/trees/conifer_medium.png" },
            { id: "conifer_slim", src: "img/trees/conifer_slim.png" },
        ]);

        window.progressbar.text("Loading images...");
    };

    function handleProgress() {
        window.progressbar.progress(window.preload.progress / 10);
    }

    function handleComplete() {
        window.progressbar.progress(window.preload.progress / 10);
        window.progressbar.text("Generating terrain...");
        setTimeout(ondownloadcompleted, 20);
    }
}