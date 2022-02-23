module.exports = {
  env: {
    commonjs: true,
    es2021  : true,
    node    : true,
  },
  extends      : ['airbnb-base'],
  parserOptions: { ecmaVersion: 12 },
  rules        : {
    'import/prefer-default-export'    : 0,
    'no-underscore-dangle'            : 0,
    'no-console'                      : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger'                     : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'nonblock-statement-body-position': ['error', 'any'],
    curly                             : ['error', 'multi-or-nest', 'consistent'],
    'linebreak-style'                 : ['warn', 'windows'],
    'object-curly-newline'            : ['error', {
      ObjectExpression : { minProperties: 10, multiline: true, consistent: true },
      ObjectPattern    : { minProperties: 10, multiline: true, consistent: true },
      ImportDeclaration: { minProperties: 10, multiline: true, consistent: true },
      ExportDeclaration: { minProperties: 10, multiline: true, consistent: true },
    }],
    'max-len'    : ['error', 120],
    'key-spacing': ['error', {
      singleLine: {
        beforeColon: false,
        afterColon : true,
      },
      multiLine: { align: 'colon' },
    }],
    'comma-dangle': ['error', {
      arrays   : 'always-multiline',
      objects  : 'always-multiline',
      imports  : 'never',
      exports  : 'never',
      functions: 'never',
    }],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev     : '*',
        next     : 'return',
      },
      {
        blankLine: 'always',
        prev     : ['const', 'let', 'var'],
        next     : '*',
      },
      {
        blankLine: 'any',
        prev     : ['const', 'let', 'var'],
        next     : ['const', 'let', 'var'],
      },
      {
        blankLine: 'always',
        prev     : ['if', 'case', 'default'],
        next     : '*',
      },
      {
        blankLine: 'always',
        prev     : '*',
        next     : ['if', 'case', 'default'],
      },
      {
        blankLine: 'any',
        prev     : ['if', 'case', 'default'],
        next     : ['if', 'case', 'default'],
      },
    ],
  },
};
