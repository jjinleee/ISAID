export interface EtfPriceSet {
  categories: string[];
  data: number[];
}

export type EtfPeriod = '1주일' | '1개월' | '3개월' | '1년' | '3년';

function generatePriceSeries(days: number, startPrice = 9300): EtfPriceSet {
  const categories: string[] = [];
  const data: number[] = [];

  let currentPrice = startPrice;
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const iso = date.toISOString().split('T')[0];
    categories.push(iso);

    const fluctuation = (Math.random() - 0.5) * 2;
    currentPrice = Math.round(currentPrice * (1 + fluctuation / 100)); // 정수화
    data.push(currentPrice);
  }

  return { categories, data };
}

export const etfPriceData: Record<EtfPeriod, EtfPriceSet> = {
  '1주일': generatePriceSeries(7),
  '1개월': generatePriceSeries(30),
  '3개월': generatePriceSeries(90),
  '1년': generatePriceSeries(365),
  '3년': generatePriceSeries(1095),
};
