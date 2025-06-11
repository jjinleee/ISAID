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
    // 빈 subject 허용 안 함
    'subject-empty': [2, 'never'],
    // type 비워두면 에러
    'type-empty': [2, 'never'],
    // 끝에 마침표 금지
    'subject-full-stop': [2, 'never', '.'],
  },
};
