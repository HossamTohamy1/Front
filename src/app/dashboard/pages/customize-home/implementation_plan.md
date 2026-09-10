# خطة العمل — إصلاح مشكلة وميض ومسح المدخلات (Input Flickering / Revert) في صفحة إعدادات البحث

## تحليل المشكلة والأسباب الجذرية (Root Causes Analysis)

بعد فحص الكود بعناية في ملفات:
- `search-page-editor.component.ts`
- `bilingual-input.component.ts`
- `search-page-config.service.ts`
- `config-sanitizer.ts`
- `customize-home-page.component.ts` و `live-preview.component.ts`

تم اكتشاف **مزيج من الأسباب الجذرية** التي تؤدي بالضبط إلى ظهور الحرف ثم اختفائه فوراً مع فقدان الـ Focus:

### 1. حلقة الارتداد والتزامن العكسي بين الـ Dashboard والـ Live Preview Iframe (السبب الأكبر لاختفاء الحروف):
- في `SearchPageConfigService`، يوجد `effect()` يقوم فورياً عند أي نقرة زر أو حرف بحفظ البيانات في `localStorage.setItem(...)` ونشر حدث `StorageEvent`.
- صفحة التخصيص بها `LivePreviewComponent` يعرض المتجر الحي بداخل `<iframe>` على نفس الـ Origin ويشارك نفس الـ `localStorage`.
- عندما يقوم المحرر بالكتابة، يرسل المتصفح حدث `storage` حقيقي أصلي للـ iframe.
- يقوم كود المتجر داخل الـ iframe باستقبال الحدث واستدعاء `pageConfig.set(...)`، مما يشغل الـ `effect()` الخاص بالـ iframe فيقوم الـ iframe بالكتابة في `localStorage` مرة ثانية!
- يرتد الحدث للمتصفح الرئيسي للـ Dashboard كحدث `storage` قادم من الـ iframe، وبما أنه حدث نظامي لا يحمل معرف المصدر الداخلي، تقوم لوحة التحكم بتطبيق البيانات الواردة القديمة فوراً أثناء كتابة المستخدم!
- بالإضافة لذلك، في `config-sanitizer.ts` كل عنصر في مصفوفة `quickSuggestions` لا يمتلك `id`، فتولّد الدالة `deepMerge` معرفاً عشوائياً جديداً (`Date.now() + Math.random()`) في كل مرة، مما يجعل البيانات غير متطابقة دائماً ويعيد توليد وتفريغ المدخلات.

### 2. استدعاء دوال الـ Signal في القالب مباشرة بدون حالة محلية (Signal Evaluation in Template):
- في `search-page-editor.component.ts`، ترتبط المدخلات مباشرة بـ:
  `[valueAr]="$any(config())['searchPlaceholderAr'] || ''"`
  مع كل Change Detection Cycle يتم إعادة قراءة الـ Signal واستبدال مرجع الكائن بالكامل.

### 3. الربط أحادي الاتجاه واستبدال الكائنات في المصفوفة (One-Way Binding & Object Re-instantiation):
- في `bilingual-input.component.ts`، الحقول مربوطة بـ `[ngModel]="valueAr"` (ربط أحادي بدون two-way binding داخلي أو خارجي).
- في قائمة `quickSuggestions`، الحقول مربوطة بـ `[ngModel]="sugg.textAr"` مع استدعاء `updateSuggestion` الذي ينشئ كائناً جديداً بالكامل ومصفوفة جديدة في كل حرف مطبوع.

---

## خطة الإصلاح الشاملة (Implementation Plan)

### 1. تعديل `SearchPageConfigService` لمنع حلقة الارتداد (Break Storage Echo Loop):
- إضافة معرفات ثابتة (`id: 'qs-1'`, `id: 'qs-2'`, إلخ) لعناصر `quickSuggestions` في الإعدادات الافتراضية.
- تحديث واجهة `SearchPageConfig` لدعم المعرف `id?: string`.
- حماية الـ `effect()` بحيث يقارن القيمة الحالية في الـ `localStorage` قبل الحفظ؛ فإذا كانت متطابقة لا يقوم بإعادة الكتابة ولا نشر أحداث غير ضرورية.
- إضافة حماية `isApplyingExternalUpdate` لمنع الـ `effect` من إعادة الكتابة في `localStorage` عند استقبال التحديثات الخارجية.

### 2. ترقية `BilingualInputComponent` لدعم الربط ثنائي الاتجاه الصحيح:
- إضافة مخرجات ثنائية الاتجاه:
  - `@Output() valueArChange = new EventEmitter<string>()`
  - `@Output() valueEnChange = new EventEmitter<string>()`
- تحويل المدخلات إلى `[(ngModel)]="valueAr"` و `[(ngModel)]="valueEn"`.
- الحفاظ على `valueChange` للتوافق مع باقي المحررات بدون كسر أي كود سابق.

### 3. تحسين `SearchPageEditorComponent` بنموذج حالة محلية وتأخير زمني (Local State & Debounce):
- إنشاء حالة محلية `localConfig` مشتقة عند التحميل، بحيث ترتبط بها المدخلات مباشرة عبر Two-Way Binding (`[(valueAr)]`, `[(valueEn)]`, `[(ngModel)]`).
- استخدام `Subject` مع `debounceTime(300)` لإرسال التحديثات لـ `SearchPageConfigService` فقط بعد توقف المستخدم عن الكتابة بـ 300 مللي ثانية (مثل النمط الناجح المتبع في `home-page-editor.component.ts`).
- في مصفوفة الكلمات المفتاحية `*ngFor="let sugg of localConfig.quickSuggestions; trackBy: trackBySuggestionId"`، التتبع باستخدام معرف العنصر الثابت `sugg.id`.
- حماية الحالة المحلية من أن تُمسح أثناء كتابة المستخدم.

---

## خطة التحقق والاختبار (Verification Plan)
1. تشغيل فحص الـ Build (`ng build` / `npm run build`) والتأكد من خلو المشروع من أي أخطاء ترجمة أو أنواع TypeScript.
2. فتح المحرر في لوحة التحكم وتجربة الكتابة السريعة والمتواصلة في:
   - حقل نص البحث بالعربية والإنجليزية (Placeholder).
   - عناوين الأقسام (Section Titles).
   - قائمة الكلمات الشائعة (Quick Suggestions) بالعربية والإنجليزية.
3. إضافة وحذف كلمات شائعة والتأكد من بقاء التركيز وحفظ الكلمات بشكل صحيح.
4. التأكد من أن المعاينة الحية (Live Preview) في الناحية اليسرى تتحدث بشكل سلس وتلقائي بعد انتهاء الكتابة دون أي وميض أو ارتداد.
