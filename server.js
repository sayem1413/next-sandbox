"use strict";

const path = require("path");

process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.env.HOSTNAME = process.env.HOST || "0.0.0.0";
process.env.PORT = process.env.PORT || "3000";

const standaloneRoot = path.join(__dirname, ".next", "standalone");

process.chdir(standaloneRoot);

require(path.join(standaloneRoot, "server.js"));