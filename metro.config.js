const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Excluir las dependencias de testing del bundle
config.resolver.blockList = [
  /.*\/node_modules\/@testing-library\/.*/,
  /.*\/node_modules\/jest.*/,
  /.*\/node_modules\/@types\/jest.*/,
];

module.exports = config; 