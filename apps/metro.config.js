// const { getDefaultConfig } = require('expo/metro-config')
// const { withNativeWind } = require('nativewind/metro')

// const config = getDefaultConfig(__dirname, {
//   projectRoot: __dirname,
//   watchFolders: ['./src'], // Add the `src` folder to the watch list
// })

// module.exports = withNativeWind(config, { input: './global.css' })
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Tắt package exports resolution để tránh lỗi import.meta trên web
config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, {
  input: "./global.css",
});