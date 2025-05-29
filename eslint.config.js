
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import { FlatConfig } from "eslint/config"; // optional, no need to declare @type manually

const config = [
  {
    ignores: ["**/node_modules/**", "dist/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,cjs,mjs,ts,cts,mts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: globals.node,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];

export default config;
