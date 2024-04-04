import perfectionist from 'eslint-plugin-perfectionist'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'


export default [
  {
    plugins: {
      perfectionist,
      eslintPluginPrettierRecommended,
    },
    rules: {
      'perfectionist/sort-objects': [
        'error',
        {
          type: 'natural',
          order: 'asc',
        },
      ],
    },
  },
]