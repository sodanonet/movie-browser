module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true, jest: true },
  extends: ["eslint:recommended", "plugin:react-hooks/recommended"],
  ignorePatterns: [
    "dist",
    ".eslintrc.cjs",
    "node_modules",
    "coverage",
    "cypress",
    "*.config.*",
    "vite.config.ts",
    "cypress.config.ts",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react-refresh", "@typescript-eslint"],
  globals: {
    React: "readonly",
    JSX: "readonly",
    NodeJS: "readonly",
  },
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-console": "off",
    "prefer-const": "error",
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_" },
        ],
      },
    },
    {
      files: ["src/ssr/**/*", "src/test/**/*"],
      rules: {
        "react-refresh/only-export-components": "off",
      },
    },
  ],
};
