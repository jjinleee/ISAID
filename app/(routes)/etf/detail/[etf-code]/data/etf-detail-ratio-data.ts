export interface EtfRatioData {
  labels: string[];
  series: number[];
}

export const etfRatioData: EtfRatioData = {
  labels: [
    '삼성전자',
    'SK하이닉스',
    'LG에너지솔루션',
    'NAVER',
    '카카오',
    '현대차',
    '기아',
    '삼성바이오로직스',
    'POSCO홀딩스',
    '셀트리온',
  ],
  series: [23.5, 15.2, 11.3, 9.1, 8.2, 7.6, 6.3, 5.1, 4.0, 9.7],
};
