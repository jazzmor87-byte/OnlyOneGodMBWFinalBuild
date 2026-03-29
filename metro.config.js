const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Block any nested project / extra node_modules that Metro keeps touching
const block = [
  new RegExp(path.resolve(projectRoot, "frontend/mbw").replace(/[/\\]/g, "[/\\\\]") + ".*"),
];

config.resolver.blockList = block;

// Keep Metro focused only on this app root
config.watchFolders = [projectRoot];

module.exports = config;
