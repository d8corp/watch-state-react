module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['core-js'],
  testPathIgnorePatterns: ['.*\.speed\.test\.ts$'],
  coverageDirectory: 'docs/coverage',
}
