module.exports = {
  forceExit: true,
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest'],
  },
  collectCoverageFrom: ['src/**/*.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transformIgnorePatterns: [`<rootDir>/node_modules/.pnpm/(?!(d3-*))`],
  testRegex: '(/__tests__/.*(test|spec))\\.(ts|tsx|js)$',
};
