module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  "setupTestFrameworkScriptFile": "<rootDir>/jest.run.js",
  "testResultsProcessor": "./node_modules/luis/dist/bridges/jest/reporter",
  "watchPathIgnorePatterns": ['<rootDir>/src/summary.json', '<rootDir>/src/snapshots.js'],
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
}