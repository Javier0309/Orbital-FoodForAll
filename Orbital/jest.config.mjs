export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  extensionsToTreatAsEsm: [".jsx"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.cjs"
  },
  testMatch: [
    "<rootDir>/src/tests/frontend/**/*.test.jsx",
    "<rootDir>/tests/**/*.test.jsx"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.cjs"
  ]
}