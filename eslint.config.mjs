import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import jest from 'eslint-plugin-jest'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import neostandard from 'neostandard'
import tseslint from 'typescript-eslint'

const MULTILINE_PREFIX_STATEMENTS = ['block-like', 'expression', 'var', 'let', 'const']
const MULTILINE_STATEMENTS = MULTILINE_PREFIX_STATEMENTS.map(key => `multiline-${key}`)

export default defineConfig([
  neostandard(),
  globalIgnores(['release', 'node_modules', 'docs']),
  {
    files: ['**/*.{ts,js,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      jest,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: jest.environments.globals.globals,
    },
    rules: {
      'no-new': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'lines-between-class-members': ['error', 'always', {
        exceptAfterSingleLine: true,
      }],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      'import/no-unused-modules': ['warn', {
        unusedExports: true,
      }],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: [...MULTILINE_STATEMENTS, 'return'] },
        { blankLine: 'always', prev: MULTILINE_STATEMENTS, next: '*' },
      ],
      'no-console': 'warn',
      'import/no-dynamic-require': 'error',
      'import/no-nodejs-modules': 'error',
      'unused-imports/no-unused-imports': 'error',
      'no-unreachable': 'error',
      'simple-import-sort/imports': ['error', {
        groups: [
          ['^\\u0000'],
          ['^'],
          ['^\\.+(/[^/.]+|/[^.]+/[^/.]+)$'],
          ['^\\..+'],
          ['^\\.$'],
        ],
      }],
      'simple-import-sort/exports': 'error',
      'import/order': 'off',
      'import/first': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          tsx: 'never',
          js: 'never',
          jsx: 'never',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
    },
  },
  {
    files: ['eslint.config.js'],
    rules: {
      'import/no-unused-modules': 'off',
      'import/no-named-as-default-member': 'off',
    },
  },
])
