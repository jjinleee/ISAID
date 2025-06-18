import { prisma } from '@/lib/prisma';

export const getEtfDailyTrading3y = async (etfId: number) => {
  const from = new Date();
  from.setFullYear(from.getFullYear() - 3);

  const rows = await prisma.etfDailyTrading.findMany({
    where: { etfId, baseDate: { gte: from } },
    orderBy: { baseDate: 'asc' },
    select: { baseDate: true, tddClosePrice: true },
  });

  return rows.map((r) => ({
    date: r.baseDate.toISOString().slice(0, 10),
    closePrice: Number(r.tddClosePrice),
  }));
};
