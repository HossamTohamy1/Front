const fs = require('fs');
const path = require('path');

// 1. Gather all translations
const i18nDir = path.join(__dirname, '../src/assets/i18n');
const enPath = path.join(i18nDir, 'en.json');
const arPath = path.join(i18nDir, 'ar.json');
let enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
let arJson = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const transContent = fs.readFileSync(path.join(__dirname, '../src/app/shared/i18n/translations.ts'), 'utf8');
const transRegex = /([a-zA-Z0-9_]+):\s*\{\s*en:\s*[\"\'\`](.*?)[\"\'\`]\s*,\s*ar:\s*[\"\'\`](.*?)[\"\'\`]\s*\}/g;

const dict = {}; // Map of Arabic string -> { key, en }

let match;
while ((match = transRegex.exec(transContent)) !== null) {
  const key = 'COMMON.' + match[1].toUpperCase();
  const en = match[2];
  const ar = match[3];
  dict[ar.trim()] = { key, en };
}

function traverseJson(objEn, objAr, prefix = '') {
  for (const k in objAr) {
    if (typeof objAr[k] === 'object' && objAr[k] !== null) {
      traverseJson(objEn[k] || {}, objAr[k], prefix + k + '.');
    } else {
      dict[objAr[k].trim()] = { key: prefix + k, en: objEn[k] };
    }
  }
}
traverseJson(enJson, arJson);

// Add some known dashboard keys manually that were unmapped
const manualDict = {
  "بحث": { key: "COMMON.SEARCH", en: "Search" },
  "الكل": { key: "COMMON.ALL", en: "All" },
  "لا توجد نتائج": { key: "COMMON.NO_RESULTS", en: "No results" },
  "تحويل بنكي": { key: "CHECKOUT.BANK_TRANSFER", en: "Bank Transfer" },
  "طلب رقم": { key: "ORDERS.ORDER_NUMBER", en: "Order Number" },
  "إلغاء": { key: "COMMON.CANCEL", en: "Cancel" },
  "اسم العميل": { key: "CHECKOUT.CUSTOMER_NAME", en: "Customer Name" },
  "رقم الهاتف": { key: "CHECKOUT.PHONE", en: "Phone Number" },
  "الدولة": { key: "CHECKOUT.COUNTRY", en: "Country" },
  "المدينة": { key: "CHECKOUT.CITY", en: "City" },
  "ملاحظات": { key: "CHECKOUT.NOTES", en: "Notes" },
  "رقم الطلب": { key: "ORDERS.ORDER_NUMBER", en: "Order Number" },
  "تاريخ الطلب": { key: "ORDERS.ORDER_DATE", en: "Order Date" },
  "مراسلة": { key: "COMMON.MESSAGE", en: "Message" },
  "المنتجات": { key: "COMMON.PRODUCTS", en: "Products" },
  "إجراءات": { key: "COMMON.ACTIONS", en: "Actions" },
  "تعديل الطلب": { key: "ADMIN.EDIT_ORDER", en: "Edit Order" },
  "الحالة": { key: "ORDERS.STATUS", en: "Status" },
  "الإجمالي": { key: "CART.TOTAL", en: "Total" },
  "رجوع": { key: "COMMON.BACK", en: "Back" },
  "السلة": { key: "COMMON.CART", en: "Cart" },
  "العروض": { key: "COMMON.OFFERS", en: "Offers" },
  "تتبع": { key: "ORDERS.TRACK", en: "Track" },
  "الرئيسية": { key: "COMMON.HOME", en: "Home" },
  "المفضلة": { key: "FAVORITES.TITLE", en: "Favorites" },
  "حسابي": { key: "PROFILE.TITLE", en: "Profile" },
  "إرسال": { key: "COMMON.SEND", en: "Send" },
  "المتجر": { key: "COMMON.SHOP", en: "Shop" },
  "طلباتي": { key: "COMMON.MY_ORDERS", en: "My Orders" },
  "نسائي": { key: "COMMON.WOMENS", en: "Women's" },
  "رجالي": { key: "COMMON.MENS", en: "Men's" },
};

Object.assign(dict, manualDict);

// Deep set utility
function deepSet(obj, pathStr, value) {
  const parts = pathStr.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

// Update i18n
Object.entries(dict).forEach(([ar, mapping]) => {
  deepSet(enJson, mapping.key, mapping.en);
  deepSet(arJson, mapping.key, ar);
});

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
fs.writeFileSync(arPath, JSON.stringify(arJson, null, 2));

// 2. Walk and Patch Files
function findArabicFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findArabicFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = [
  ...findArabicFiles(path.join(__dirname, '../src/app/dashboard/components')),
  ...findArabicFiles(path.join(__dirname, '../src/app/dashboard/facades')),
  ...findArabicFiles(path.join(__dirname, '../src/app/shared'))
];

let filesChanged = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Make sure TranslateModule is imported if needed for standalone components
  if (file.endsWith('.ts') && /[\u0600-\u06FF]/.test(content)) {
     if (content.includes('standalone: true') && !content.includes('TranslateModule')) {
         content = content.replace(/imports:\s*\[/, 'imports: [TranslateModule, ');
         if (!content.includes("@ngx-translate/core")) {
             content = `import { TranslateModule } from '@ngx-translate/core';\n` + content;
         }
     }
  }

  // Iterate over dict and replace exact matches
  // Sort dict keys by length descending to replace longest first
  const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);

  sortedKeys.forEach(arStr => {
    if (arStr.length < 2) return;
    const mapping = dict[arStr];
    const safeArStr = arStr.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    
    // Regex for text nodes in HTML or TS templates: >Arabic< or > Arabic <
    const htmlTextRegex = new RegExp(`>\\s*${safeArStr}\\s*<`, 'g');
    content = content.replace(htmlTextRegex, `>{{ '${mapping.key}' | translate }}<`);

    // Regex for inline strings in TS: 'Arabic' or "Arabic"
    const tsStrRegex1 = new RegExp(`'${safeArStr}'`, 'g');
    const tsStrRegex2 = new RegExp(`"${safeArStr}"`, 'g');
    const tsStrRegex3 = new RegExp(`\\\`${safeArStr}\\\``, 'g');
    
    if (file.endsWith('.ts')) {
        // In TS logic (not template), if it's not a template literal we might need translateService
        // But for simplicity in shared/utils, let's just replace the string. 
        // This is safe because utils often return strings that are piped later, or translated at call site.
        // For component templates, it's safer to just replace.
        // Let's replace the string with the key for now. 
        // Wait, if it's in a .ts file it's better to just swap the string.
        content = content.replace(tsStrRegex1, `'${mapping.key}'`);
        content = content.replace(tsStrRegex2, `'${mapping.key}'`);
        content = content.replace(tsStrRegex3, `'${mapping.key}'`);
    } else if (file.endsWith('.html')) {
        content = content.replace(tsStrRegex1, `'${mapping.key}'`);
        content = content.replace(tsStrRegex2, `'${mapping.key}'`);
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    filesChanged++;
  }
});

console.log('Files changed:', filesChanged);
console.log('Done!');
