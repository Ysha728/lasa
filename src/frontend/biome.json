{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "files": {
    "ignore": [
      "**/backend.ts",
      "**/backend.d.ts",
      "dist/**",
      "node_modules/**",
      "build/**",
      "*.config.js",
      "src/declarations/**",
      "src/config.ts"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "useHookAtTopLevel": "error",
        "noUnusedVariables": "error"
      },
      "suspicious": {
        "noExplicitAny": "off"
      },
      "style": {
        "useConst": "off",
        "noNonNullAssertion": "off"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always"
    }
  }
}
