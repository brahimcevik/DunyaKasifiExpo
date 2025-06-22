const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('obj', 'mtl', 'jpg', 'jpeg', 'png', 'glb');
 
module.exports = config; 