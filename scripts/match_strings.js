const fs = require('fs');

const arStrings = JSON.parse(fs.readFileSync('E:/Loxging/New folder/loxxkingdesign/scripts/extracted_arabic.json', 'utf8'));

// Read translations.ts as text and parse it simply
const transContent = fs.readFileSync('E:/Loxging/New folder/loxxkingdesign/src/app/shared/i18n/translations.ts', 'utf8');
const transRegex = /([a-zA-Z0-9_]+):\s*\{\s*en:\s*[\"\'\`](.*?)[\"\'\`]\s*,\s*ar:\s*[\"\'\`](.*?)[\"\'\`]\s*\}/g;

const translationMap = {}; // ar -> key
let match;
while ((match = transRegex.exec(transContent)) !== null) {
  const key = match[1];
  const en = match[2];
  const ar = match[3];
  translationMap[ar.trim()] = { key: 'COMMON.' + key.toUpperCase(), en: en };
}

// Add the ones from en.json/ar.json if possible
const enJson = JSON.parse(fs.readFileSync('E:/Loxging/New folder/loxxkingdesign/src/assets/i18n/en.json', 'utf8'));
const arJson = JSON.parse(fs.readFileSync('E:/Loxging/New folder/loxxkingdesign/src/assets/i18n/ar.json', 'utf8'));

function traverseJson(objEn, objAr, prefix = '') {
  for (const k in objAr) {
    if (typeof objAr[k] === 'object') {
      traverseJson(objEn[k] || {}, objAr[k], prefix + k + '.');
    } else {
      translationMap[objAr[k].trim()] = { key: prefix + k, en: objEn[k] };
    }
  }
}
traverseJson(enJson, arJson);

const dict = {};
const unmapped = [];

arStrings.forEach(str => {
  if (translationMap[str]) {
    dict[str] = translationMap[str];
  } else {
    unmapped.push(str);
  }
});

fs.writeFileSync('E:/Loxging/New folder/loxxkingdesign/scripts/patch_dict.json', JSON.stringify(dict, null, 2));
fs.writeFileSync('E:/Loxging/New folder/loxxkingdesign/scripts/unmapped.json', JSON.stringify(unmapped, null, 2));
console.log('Mapped:', Object.keys(dict).length, 'Unmapped:', unmapped.length);
