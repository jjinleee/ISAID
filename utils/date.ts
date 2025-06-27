import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * KST 자정 (00:00) 기준의 Date 객체 반환
 */
export function getTodayStartOfKST(): Date {
  return dayjs().tz('Asia/Seoul').startOf('day').toDate();
}

/**
 * 어제 KST 자정 기준 Date 객체 반환
 */
export function getYesterdayStartOfKST(): Date {
  return dayjs().tz('Asia/Seoul').startOf('day').subtract(1, 'day').toDate();
}
