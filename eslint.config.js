export default [
    {
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      settings: {
        react: {
          version: "detect" // Auto-detect React version
        }
      },
      linterOptions: {
        reportUnusedDisableDirectives: true
      },
      rules: {
        "no-undef": "off", // Turn off `no-undef` to avoid process/__dirname errors
        "import/extensions": ["error", "ignorePackages"],
        "no-unused-vars": "warn", // Change to warning instead of error
        "no-prototype-builtins": "off" // Allow Object.prototype methods
      }
    }
  ];
  