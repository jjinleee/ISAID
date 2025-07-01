module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'add',
        'setting',
        'rename',
        'comment',
      ],
    ],
    'header-max-length': [2, 'always', 100],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'references-empty': [0],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w+):\s(.+?)(\s\(#\d+\))?$/,
      headerCorrespondence: ['type', 'subject', 'issue'],
    },
  },
};
