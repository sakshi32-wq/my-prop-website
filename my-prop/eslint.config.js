//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config"

export default [
  ...tanstackConfig,
  {
    rules: {
      "import/no-cycle": "off",
      "import/order": "off",
      "import/consistent-type-specifier-style": "off",
      "sort-imports": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/require-await": "off",
      "pnpm/json-enforce-catalog": "off",
    },
  },
  {
    // shadcn source files: keep them as the CLI generates them
    files: ["src/components/ui/**"],
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "no-shadow": "off",
    },
  },
  {
    ignores: [
      "eslint.config.js",
      ".prettierrc",
      "reference/**",
      // Orval output: regenerate with `yarn api:generate` instead of editing
      "src/api/generated/**",
    ],
  },
]
