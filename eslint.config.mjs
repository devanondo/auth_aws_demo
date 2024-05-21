import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,

    {
        languageOptions: {
            ecmaVersion: 12,
            sourceType: 'module',
            parserOptions: {
                project: true,
                // tsconfigRootDir: path.join(__dirname, 'tsconfig.json'),
            },
            globals: {
                process: 'readonly',
                console: 'readonly',
            },
        },
        files: ['**/*.js', '**/*.ts', '**/*.mjs'],
        ignores: ['node_modules/*'],
        extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
            'no-unused-expressions': 'error',
            'no-unreachable': 'error',
            'no-console': 'warn',
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        },
    }
);
