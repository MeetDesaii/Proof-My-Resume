import baseConfig from "@visume/eslint-config/base.js";

export default [
  ...baseConfig,
  {
    ignores: ["dist/**"],
  },
];
