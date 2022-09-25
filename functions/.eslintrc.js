module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'google',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json', 'tsconfig.dev.json'],
        sourceType: 'module',
    },
    ignorePatterns: [
        '/lib/**/*', // Ignore built files.
    ],
    plugins: ['@typescript-eslint', 'import', 'prettier'],
    rules: {
        indent: ['warn', 4],
        quotes: ['warn', 'single', { avoidEscape: true }],
        semi: ['warn', 'never'],
        'quote-props': ['warn', 'as-needed'],
        'object-curly-spacing': ['warn', 'always'],
        'no-empty': 'warn',
        'import/no-unresolved': 0,
    },
}
