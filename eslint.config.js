import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

const reactHooksRecommendedRules =
  reactHooks.configs["recommended-latest"]?.rules ??
  reactHooks.configs.recommended.rules;

export default [
  globalIgnores([
    "node_modules/",
    "dist/",
    "build/",
    "coverage/",
    ".wrangler/",
    ".vite/",
    ".cache/",
    ".temp/",
    "tmp/",
    "logs/",
    "*.log",
    "*.tsbuildinfo",
    "worker-configuration.d.ts",
  ]),

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["src/**/*.{ts,tsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
      },
    },

    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    rules: {
      ...reactHooksRecommendedRules,

      /*
        Essa regra é útil, mas está restritiva demais para o estado atual
        do projeto. Features antigas como jobs e sessions ainda usam setState
        dentro de effects para carregamento/sincronização.

        Vamos reativar depois que essas telas forem refatoradas para hooks
        como useAsyncResource e estados derivados.
      */
      "react-hooks/set-state-in-effect": "off",

      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
    },
  },

  {
    files: [
      "*.config.{ts,js}",
      "vite.config.ts",
      "vitest.config.ts",
      "eslint.config.js",
      "src/**/*.test.{ts,tsx}",
      "src/**/testing/**/*.{ts,tsx}",
    ],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  {
    files: ["worker/**/*.{ts,tsx}", "src/worker/**/*.{ts,tsx}"],

    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  },

  {
    files: ["src/features/jobs/components/job-allowance-icons.tsx"],

    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
];