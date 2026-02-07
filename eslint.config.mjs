import globals from "globals";
import js from "@eslint/js";

export default [
	{
		ignores: ["node_modules/**/*"],
	},
	js.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.mocha,
			},
			ecmaVersion: "latest",
			sourceType: "module",
		},
		rules: {
			indent: ["error", "tab"],
			"linebreak-style": ["error", "unix"],
			quotes: ["error", "double"],
			semi: ["error", "always"],
			"no-console": "error",
			"no-redeclare": "warn",
			"no-trailing-spaces": "error",
			"no-cond-assign": "error",
		},
	},
];
