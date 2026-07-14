module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/\\.claude/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
