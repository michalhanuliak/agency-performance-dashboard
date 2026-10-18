import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'react-refresh/only-export-components': [
        'error',
        { allowConstantExport: true },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'recharts',
              message: 'Import from @/lib/charts instead.',
            },
            {
              name: '@tanstack/react-table',
              message: 'Import from @/lib/table instead.',
            },
            {
              name: 'react-error-boundary',
              message: 'Import from @/lib/error-boundary instead.',
            },
            {
              name: 'lucide-react',
              message: 'Import from @/lib/icons instead.',
            },
            {
              name: '@tanstack/react-query',
              message: 'Import from @/lib/query instead.',
            },
            {
              name: '@dnd-kit/core',
              message: 'Import from @/lib/dnd instead.',
            },
            {
              name: '@dnd-kit/sortable',
              message: 'Import from @/lib/dnd instead.',
            },
            {
              name: '@dnd-kit/utilities',
              message: 'Import from @/lib/dnd instead.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/components/ui/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['src/lib/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['src/api/__generated__/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
])
