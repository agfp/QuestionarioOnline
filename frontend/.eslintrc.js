// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'html/html-extensions': ['.html', '.vue'],

    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    'comma-dangle': 'off',
    'no-unused-vars': 'warn',
    'arrow-parens': 'off',
    'indent': ['warn', 4],
    'no-plusplus': 'off',
    'prefer-const': 'warn',
    'max-len': ["warn", 120],
    'no-param-reassign': 'off',
    'import/prefer-default-export': 'off',
    "no-use-before-define": ["error", { "functions": false, "classes": true }],
    'prefer-const': 'off',
    'no-trailing-spaces': 'off',
    'padded-blocks': 'off',

    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
