import arJson from '../../../assets/i18n/ar.json';

const translationMap: Record<string, string> = {};

function flatten(obj: any, prefix = ''): void {
  if (!obj || typeof obj !== 'object') return;
  for (const k of Object.keys(obj)) {
    if (k === 'default' && typeof obj[k] === 'object' && obj[k] !== null && !prefix) {
      flatten(obj[k], '');
      continue;
    }
    const val = obj[k];
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof val === 'string') {
      translationMap[fullKey] = val;
    } else if (typeof val === 'object' && val !== null) {
      flatten(val, fullKey);
    }
  }
}

// Unpack default export wrapper if present in ES module bundle
const rawJson = (arJson && (arJson as any).default && typeof (arJson as any).default === 'object')
  ? (arJson as any).default
  : arJson;
flatten(rawJson);
if ((arJson as any).default && (arJson as any).default !== rawJson) {
  flatten((arJson as any).default);
}
flatten(arJson);

/**
 * Hardcoded safety map for standard translation keys to guarantee instant resolution
 */
const fallbackSafetyMap: Record<string, string> = {
  'HOME.BEST_SELLERS_ALT': 'الأكثر مبيعاً',
  'HOME.BEST_SELLERS': 'الأكثر مبيعاً',
  'PRODUCT.COLOR': 'اللون',
  'PRODUCT.SIZE': 'المقاس',
  'PRODUCT.SIZE_GUIDE': 'دليل المقاسات',
  'COMMON.ADDRESS': 'العنوان',
  'PRODUCT.DESCRIPTION': 'الوصف',
  'CART.TITLE': 'سلة المشتريات',
  'CART.TOTAL': 'الإجمالي',
  'COMMON.SUBTOTAL': 'المجموع الفرعي',
  'COMMON.DELIVERY': 'رسوم الشحن',
  'COMMON.PENDING': 'قيد الانتظار',
  'COMMON.CONFIRMED': 'مؤكد',
  'COMMON.SHIPPED': 'تم الشحن',
  'COMMON.DELIVERED': 'تم التسليم',
  'COMMON.CANCELLED': 'ملغي',
  'COMMON.ALL': 'الكل',
  'COMMON.CASHONDELIVERY': 'الدفع عند الاستلام',
  'CHECKOUT.BANK_TRANSFER': 'تحويل بنكي',
  'COMMON.ACCEPTORDER': 'قبول الطلب',
  'COMMON.OUTOFSTOCK': 'غير متوفر',
  'CHECKOUT.CUSTOMER_NAME': 'اسم العميل',
  'CHECKOUT.PHONE': 'رقم الهاتف',
  'CHECKOUT.COUNTRY': 'الدولة',
  'CHECKOUT.CITY': 'المدينة',
  'ORDERS.ORDER_NUMBER': 'رقم الطلب',
  'ORDERS.ORDER_DATE': 'تاريخ الطلب',
  'ORDERS.STATUS': 'الحالة',
  'CHECKOUT.PAYMENT_METHOD': 'طريقة الدفع',
  'COMMON.WOMENS': 'نسائي',
  'COMMON.LOADING': 'جاري التحميل...'
};

/**
 * Resolves a translation key (e.g. 'HOME.BEST_SELLERS_ALT', 'PRODUCT.COLOR')
 * to its human-readable Arabic text. If the text is already custom Arabic, it is preserved.
 */
export function resolveTranslationKey(val: any): any {
  if (typeof val !== 'string') {
    if (Array.isArray(val)) {
      return val.map(item => resolveTranslationKey(item));
    }
    if (typeof val === 'object' && val !== null) {
      const res: any = {};
      for (const k of Object.keys(val)) {
        res[k] = resolveTranslationKey(val[k]);
      }
      return res;
    }
    return val;
  }

  const trimmed = val.trim();

  // If translationMap has exact match
  if (translationMap[trimmed]) {
    return translationMap[trimmed];
  }

  // If prefixed with 'default.'
  if (translationMap[`default.${trimmed}`]) {
    return translationMap[`default.${trimmed}`];
  }

  // Strip 'default.' if present
  if (trimmed.startsWith('default.')) {
    const stripped = trimmed.slice(8);
    if (translationMap[stripped]) {
      return translationMap[stripped];
    }
  }

  // Fallback safety map
  if (fallbackSafetyMap[trimmed]) {
    return fallbackSafetyMap[trimmed];
  }

  // Dotted key pattern matching
  if (/^[A-Z0-9_]+(\.[A-Z0-9_]+)+$/.test(trimmed)) {
    if (translationMap[trimmed]) {
      return translationMap[trimmed];
    }
  }

  return val;
}

// Run automatic one-time migration of any persisted localStorage configs
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const allKeys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && (k.startsWith('loxxking-') || k.startsWith('lk-config-'))) {
        allKeys.push(k);
      }
    }
    for (const key of allKeys) {
      const val = window.localStorage.getItem(key);
      if (val && (val.includes('.') || val.includes('BEST_SELLERS') || val.includes('PRODUCT.') || val.includes('AUTO_STR'))) {
        try {
          const parsed = JSON.parse(val);
          const sanitized = resolveTranslationKey(parsed);
          window.localStorage.setItem(key, JSON.stringify(sanitized));
        } catch (_) {}
      }
    }
  } catch (_) {}
}

/**
 * Deep merge utility that prioritizes user values while ensuring
 * that any legacy translation keys are resolved to clean Arabic strings.
 */
function deepMerge(target: any, source: any): any {
  if (source === undefined) return target;
  if (target === undefined) return source;

  if (typeof source !== 'object' || source === null) {
    return resolveTranslationKey(source);
  }

  if (Array.isArray(source)) {
    return source.map((item, idx) => {
      const template = Array.isArray(target) ? (target[idx] ?? target[0]) : undefined;
      return template ? deepMerge(template, item) : resolveTranslationKey(item);
    });
  }

  const result: any = { ...target };
  for (const key of Object.keys(source)) {
    const targetVal = target[key];
    const sourceVal = source[key];
    if (sourceVal === undefined || sourceVal === null) continue;

    if (
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal)
    ) {
      result[key] = deepMerge(targetVal, sourceVal);
    } else {
      result[key] = resolveTranslationKey(sourceVal);
    }
  }
  return result;
}

/**
 * Utility to sanitize persisted page configurations loaded from localStorage.
 * Converts raw translation keys (like 'HOME.SHOP_BY_CATEGORY_ALT') to human-readable
 * Arabic text so that dashboard editor inputs display clean Arabic, while preserving
 * any user-customized edits.
 */
export function sanitizeWithInitial<T>(parsed: any, initial: T): T {
  const cleanInitial = resolveTranslationKey(initial) as T;
  if (!parsed || typeof parsed !== 'object') return cleanInitial;

  const cleanParsed = resolveTranslationKey(parsed);

  if (Array.isArray(cleanInitial)) {
    if (!Array.isArray(cleanParsed)) return cleanInitial;
    return (cleanParsed.map((item, idx) => {
      const template = (cleanInitial as any)[idx] ?? (cleanInitial as any)[0];
      return deepMerge(template, item);
    }) as any) as T;
  }

  return deepMerge(cleanInitial, cleanParsed) as T;
}
