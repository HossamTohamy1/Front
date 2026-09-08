export const ARABIC_MONTH_NAMES = [
  'SHARED.AUTO_STR_100', 'SHARED.AUTO_STR_85', 'SHARED.AUTO_STR_112', 'SHARED.AUTO_STR_101', 'SHARED.AUTO_STR_113', 'SHARED.AUTO_STR_102',
  'SHARED.AUTO_STR_103', 'SHARED.AUTO_STR_104', 'SHARED.AUTO_STR_86', 'SHARED.AUTO_STR_87', 'SHARED.AUTO_STR_88', 'SHARED.AUTO_STR_89'
];

export const DASHBOARD_WEEK_DAYS = ['SHARED.AUTO_STR_105', 'SHARED.AUTO_STR_106', 'SHARED.AUTO_STR_90', 'SHARED.AUTO_STR_91', 'SHARED.AUTO_STR_77', 'SHARED.AUTO_STR_78', 'SHARED.AUTO_STR_82'];
export const DASHBOARD_WEEK_ORDER = [0, 6, 5, 4, 3, 2, 1];

export function formatISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
