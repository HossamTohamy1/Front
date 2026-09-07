export function formatWhatsAppPhone(phone: string, country = 'SHARED.AUTO_STR_79'): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';

  const countryDialCodes: Record<string, string> = {
    السعودية: '966',
    العراق: '964',
    الإمارات: '971',
    قطر: '974',
    ليبيا: '218',
    الكويت: '965',
    البحرين: '973',
    عُمان: '968',
    عمان: '968',
    مصر: '20',
    تركيا: '90',
  };

  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('0')) {
    const dialCode = countryDialCodes[country] || '966';
    return `${dialCode}${digits.slice(1)}`;
  }
  return digits;
}

export function buildWhatsAppUrl(phone: string, message: string, country = 'SHARED.AUTO_STR_79'): string {
  const formattedPhone = formatWhatsAppPhone(phone, country);
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}
