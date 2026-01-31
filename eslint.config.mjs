import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts'
  ]),
  {
    rules: {
      quotes: ['error', 'single'], // usa comillas simples
      semi: ['error', 'never'], // sin punto y coma
      'eol-last': ['error', 'always'], // nueva línea al final del archivo
      indent: ['error', 2], // indentación de 2 espacios
      'comma-dangle': ['error', 'never'], // sin coma al final
      'no-unused-vars': ['warn', { // advertencia para variables no usadas
        argsIgnorePattern: '^_', // ignora parámetros que empiezan con _
        varsIgnorePattern: '^_' // ignora variables que empiezan con _
      }]
    }
  }
])

export default eslintConfig
