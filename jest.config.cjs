/** @type {import('jest').Config} */

module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@/services/(.*)$": "<rootDir>/src/services/$1",
    "^@/store/(.*)$": "<rootDir>/src/store/$1",
    "^@/types/(.*)$": "<rootDir>/src/types/$1",
    "^@/styles/(.*)$": "<rootDir>/src/styles/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  setupFiles: ["<rootDir>/src/test/jest-setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          moduleResolution: "node",
        },
      },
    ],
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.(ts|tsx)",
    "<rootDir>/src/**/*.(test|spec).(ts|tsx)",
  ],
  collectCoverageFrom: [
    "src/**/*.(ts|tsx)",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};
