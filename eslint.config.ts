import js from "@eslint/js";
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores(["dist", "playwright-report", "test-results"]),
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  comments.recommended,
  {
    rules: {
      "@eslint-community/eslint-comments/require-description": "error",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [reactHooks.configs.flat.recommended, jsxA11y.flatConfigs.strict],
    languageOptions: { globals: globals.browser },
    rules: {
      // The profile is a canvas labelled as one image (ADR 0005); jsx-a11y's recommended preset allows this, its strict one does not.
      "jsx-a11y/no-interactive-element-to-noninteractive-role": [
        "error",
        { canvas: ["img"] },
      ],
    },
  },
);
