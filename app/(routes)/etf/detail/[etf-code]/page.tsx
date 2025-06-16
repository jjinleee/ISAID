import { notFound } from 'next/navigation';
import { getEtfDailyTrading3y } from '@/lib/db/etf';
import { fillGapsBetweenSingleMonthData } from '@/lib/utils';
import EtfDetailContainer from './_components/etf-detail-container';

export default async function EtfDetailPage({ params }: { params: any }) {
  // 내부에서만 안전하게 타입 단언
  const raw = (params as { 'etf-code': string | string[] })['etf-code'];
  const etfCode = Array.isArray(raw) ? raw[0] : raw;
  const etfId = Number(etfCode);

  if (!Number.isInteger(etfId) || etfId <= 0) notFound();

  const chartRows = await getEtfDailyTrading3y(etfId);
  const filledChartRows = fillGapsBetweenSingleMonthData(chartRows);

  return (
    <EtfDetailContainer etfCode={etfCode} initialChart={filledChartRows} />
  );
}
