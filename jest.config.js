const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // ← add this first
    "^.+\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js",
    "^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$":
      "<rootDir>/__mocks__/fileMock.js",
  },
};

module.exports = createJestConfig(customJestConfig);
