const fs = require("node:fs");

// Chrome y Edge comparten el protocolo que utiliza karma-chrome-launcher.
if (!process.env.CHROME_BIN) {
  const candidates = [
    `${process.env.PROGRAMFILES}/Google/Chrome/Application/chrome.exe`,
    `${process.env["PROGRAMFILES(X86)"]}/Microsoft/Edge/Application/msedge.exe`,
    `${process.env.PROGRAMFILES}/Microsoft/Edge/Application/msedge.exe`,
    `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  ];
  const executable = candidates.find((path) => fs.existsSync(path));
  if (executable) process.env.CHROME_BIN = executable;
}

module.exports = function (config) {
  config.set({
    frameworks: ["jasmine"],
    files: [
      "node_modules/bootstrap/dist/css/bootstrap.min.css",
      "src/styles/styles.css",
      { pattern: "public/img/**/*", included: false, served: true, watched: false },
      ".karma-build/components.js",
    ],
    proxies: { "/img/": "/base/public/img/" },
    browsers: ["ChromeHeadless"],
    reporters: ["progress", "coverage"],
    coverageReporter: {
      dir: "coverage/components",
      subdir: ".",
      reporters: [
        { type: "html" }, { type: "lcovonly" },
        { type: "json-summary" }, { type: "text-summary" },
      ],
    },
    client: { jasmine: { random: false }, clearContext: false },
    singleRun: true,
    autoWatch: false,
    browserNoActivityTimeout: 30000,
    captureTimeout: 60000,
  });
};
