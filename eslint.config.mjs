// eslint.config.js
import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,

    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
            }
        },

        rules: {
            "no-unused-vars": "warn",
            "no-undef": "warn",
            "indent": ["error", 4, { "SwitchCase": 1 }],
            "linebreak-style": ["error", "unix"],
            "quotes": ["error", "double"],
            "semi": ["error", "never"],
            "prefer-const": ["error", {"destructuring": "any", "ignoreReadBeforeAssign": false}],
            "eqeqeq": "error",
            "func-style":"off",
            "camelcase":"error",
            "no-redeclare":"error",
            "require-await":"error"
        }
    }
];
