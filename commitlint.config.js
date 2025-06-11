module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 허용된 커밋 타입
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
    // header는 100자 이하 권장
    'header-max-length': [2, 'always', 100],
    // 빈 subject 금지
    'subject-empty': [2, 'never'],
    // type은 반드시 입력
    'type-empty': [2, 'never'],
    // subject 끝에 마침표 금지
    'subject-full-stop': [2, 'never', '.'],
    // (#123) 형식 허용
    'references-empty': [0],
  },
  parserPreset: {
    parserOpts: {
      // 정규식: <type>: <subject> (#issue)
      headerPattern: /^(\w+):\s(.+?)(\s\(#\d+\))?$/,
      headerCorrespondence: ['type', 'subject', 'issue'],
    },
  },
};
