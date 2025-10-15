import path from 'node:path';
import { FlatCompat } from '@eslint/eslintrc';
import jsEslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

const compat = new FlatCompat({
  baseDirectory: path.dirname(new URL(import.meta.url).pathname),
});

export default defineConfig([
  { ignores: ['node_modules/**'] },
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: ['js/recommended', eslintConfigPrettier],
    languageOptions: { globals: globals.node },
    plugins: { js: jsEslint, eslintPluginPrettier },
  },
  {
    files: ['**/*.js'],
    extends: [...compat.extends('airbnb-base')],
    languageOptions: { sourceType: 'module' },
    rules: {
      'import/extensions': [
        'error',
        'always',
        {
          js: 'always',
        },
      ],
    },
  },
]);
