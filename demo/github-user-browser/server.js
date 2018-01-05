var liveServer = require("live-server");

var params = {
    host: "0.0.0.0",
    open: false, 
    file: "index.html",
	root: "./demo/github-user-browser/", // Set root directory that's being served. Defaults to cwd.
};

liveServer.start(params);