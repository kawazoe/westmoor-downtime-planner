module.exports = {
  root: true,
  env: { node: true },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: { ecmaVersion: 2020 },
  rules: {
    // https://eslint.org/docs/rules/#possible-errors
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'require-atomic-updates': 'error',

    // https://eslint.org/docs/rules/#best-practices
    'accessor-pairs': 'error',
    'array-callback-return': 'error',
    'consistent-return': 'error',
    'curly': ['error', 'all'],
    'dot-location': ['error', 'property'],
    'eqeqeq': 'error',
    'grouped-accessor-pairs': 'error',
    'guard-for-in': 'error',
    'no-constructor-return': 'error',
    'no-else-return': 'error',
    'no-eval': 'error',
    'no-extra-label': 'error',
    'no-floating-decimal': 'error',
    'no-invalid-this': 'error',
    'no-labels': 'error',
    'no-redeclare': ['error'],
    'no-unused-expressions': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'radix': ['error', 'always'],
    'wrap-iife': ['error', 'inside'],

    // https://eslint.org/docs/rules/#variables
    'no-shadow': 'error',
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    // https://eslint.org/docs/rules/#stylistic-issues
    'array-bracket-newline': ['error', { multiline: true }],
    'array-bracket-spacing': ['error', 'never'],
    'array-element-newline': ['error', 'consistent'],
    'block-spacing': ['error', 'always'],
    'brace-style': ['error', '1tbs'],
    'capitalized-comments': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': 'error',
    'comma-style': ['error', 'last'],
    'computed-property-spacing': ['error', 'never'],
    'default-param-last': 'error',
    'eol-last': ['error', 'always'],
    'func-call-spacing': ['error', 'never'],
    'function-call-argument-newline': ['error', 'consistent'],
    'function-paren-newline': ['error', 'multiline'],
    'implicit-arrow-linebreak': ['error', 'beside'],
    'indent': ['error', 2],
    'jsx-quotes': ['error', 'prefer-double'],
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
    'lines-around-comment': 'error',
    'multiline-ternary': ['error', 'always-multiline'],
    'new-parens': ['error', 'always'],
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
    'no-lonely-if': 'error',
    'no-multiple-empty-lines': 'error',
    'no-trailing-spaces': 'error',
    'no-unneeded-ternary': 'error',
    'no-whitespace-before-property': 'error',
    'object-curly-newline': ['error', { multiline: true }],
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': 'off',
    'operator-assignment': ['error', 'always'],
    'padded-blocks': ['error', 'never'],
    'prefer-exponentiation-operator': 'error',
    'prefer-object-spread': 'error',
    'quote-props': ['error', 'consistent'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'semi-spacing': 'error',
    'semi-style': ['error', 'last'],
    'space-before-function-paren': ['error', { anonymous: 'always', named: 'never' }],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': ['error', 'always', { line: { exceptions: ['/'], markers: ['<'] }, block: { exceptions: ['*'] } }],
    'switch-colon-spacing': 'error',
    'template-tag-spacing': ['error', 'never'],
    'unicode-bom': ['error', 'never'],

    // https://eslint.org/docs/rules/#ecmascript-6
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-spacing': 'error',
    'generator-star-spacing': 'error',
    'no-confusing-arrow': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-computed-key': ['error', { enforceForClassMembers: true }],
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'no-var': 'error',
    'object-shorthand': ['error', 'always'],
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    'prefer-const': 'error',
    'prefer-numeric-literals': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'require-yield': 'error',
    'rest-spread-spacing': ['error', 'never'],
    'sort-imports': ['error', { ignoreCase: true, allowSeparatedGroups: true }],
    'symbol-description': 'error',
    'template-curly-spacing': ['error', 'never'],
    'yield-star-spacing': 'error',

    // Undo @vue/cli globals
    '@typescript-eslint/no-var-requires': 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: { mocha: 'error' },
    },
    {
      files: ['**/*.ts?(x)', '**/*.vue'],
      rules: {
        // https://eslint.org/docs/rules/#best-practices
        'no-invalid-this': 'off',
        '@typescript-eslint/no-invalid-this': 'error',
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': ['error', { ignoreDeclarationMerge: true }],
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

        // https://eslint.org/docs/rules/#variables
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error', { ignoreTypeValueShadow: true }],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

        // https://eslint.org/docs/rules/#stylistic-issues
        'brace-style': 'off',
        '@typescript-eslint/brace-style': ['error', '1tbs'],
        'comma-dangle': 'off',
        '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
        'comma-spacing': 'off',
        '@typescript-eslint/comma-spacing': 'error',
        'default-param-last': 'off',
        '@typescript-eslint/default-param-last': 'error',
        'func-call-spacing': 'off',
        '@typescript-eslint/func-call-spacing': ['error', 'never'],
        'indent': 'off',
        '@typescript-eslint/indent': ['error', 2],
        'keyword-spacing': 'off',
        '@typescript-eslint/keyword-spacing': 'error',
        'quotes': 'off',
        '@typescript-eslint/quotes': ['error', 'single'],
        'semi': 'off',
        '@typescript-eslint/semi': ['error', 'always'],
        'space-before-function-paren': 'off',
        '@typescript-eslint/space-before-function-paren': ['error', { anonymous: 'always', named: 'never' }],
        'space-infix-ops': 'off',
        '@typescript-eslint/space-infix-ops': 'error',

        // https://eslint.org/docs/rules/#ecmascript-6
        'no-duplicate-imports': 'off',
        '@typescript-eslint/no-duplicate-imports': 'error',
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'error',
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': 'off',

        // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
        '@typescript-eslint/array-type': ['error', { default: 'array', readonly: 'array' }],
        '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as', objectLiteralTypeAssertions: 'allow' }],
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
        '@typescript-eslint/explicit-member-accessibility': 'error',
        '@typescript-eslint/member-delimiter-style': [
          'error',
          {
            multiline: { delimiter: 'semi', requireLast: true },
            singleline: { delimiter: 'comma', requireLast: false },
            overrides: { typeLiteral: { multiline: { delimiter: 'comma' } } },
          },
        ],
        '@typescript-eslint/no-confusing-non-null-assertion': 'error',
        '@typescript-eslint/no-extraneous-class': 'error',
        '@typescript-eslint/no-implicit-any-catch': ['error', { allowExplicitAny: true }],
        '@typescript-eslint/no-unnecessary-type-constraint': 'error',
        '@typescript-eslint/prefer-enum-initializers': 'error',
        '@typescript-eslint/prefer-for-of': 'error',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/unified-signatures': 'error',

        // Redo @vue/cli globals
        '@typescript-eslint/no-var-requires': 'error',

        // Loosen rules in dev
        'vue/no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'vue/no-unused-components': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      },
    },
  ],
};
