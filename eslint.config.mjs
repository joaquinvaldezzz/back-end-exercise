import path from 'node:path';
import { FlatCompat } from '@eslint/eslintrc';
import jsEslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsdoc from 'eslint-plugin-jsdoc';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

const compat = new FlatCompat({
  baseDirectory: path.dirname(new URL(import.meta.url).pathname),
});

export default defineConfig([
  { ignores: ['dist/*', 'node_modules/**'] },
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    plugins: { js: jsEslint },
  },
  {
    files: ['**/*.js'],
    extends: [
      ...compat.extends('airbnb-base'),
      jsdoc.configs['flat/recommended'],
      jsdoc.configs['flat/stylistic-typescript'],
      eslintConfigPrettier,
      eslintPluginPrettier,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'import/extensions': [
        'error',
        'always',
        {
          js: 'always',
        },
      ],
      'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.js'] }],
      'jsdoc/check-line-alignment': 'off',
      'jsdoc/tag-lines': 'off',
    },
  },
]);
