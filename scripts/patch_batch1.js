const fs = require('fs');
const path = require('path');

const dict = {
  // error.interceptor.ts
  'حدث خطأ غير متوقع في الاتصال بالخادم.': { key: 'ERROR.UNEXPECTED', en: "An unexpected server error occurred." },
  'خطأ من المتصفح: ${error.error.message}': { key: 'ERROR.BROWSER', en: "Browser error: ${error.error.message}" },
  'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً.': { key: 'ERROR.SESSION_EXPIRED', en: "Session expired, please log in again." },
  'ليس لديك الصلاحية لتنفيذ هذا الإجراء.': { key: 'ERROR.UNAUTHORIZED', en: "You do not have permission to perform this action." },
  'المورد المطلوب غير موجود.': { key: 'ERROR.NOT_FOUND', en: "The requested resource was not found." },
  'حدث خطأ في الخادم، يرجى المحاولة لاحقاً.': { key: 'ERROR.SERVER_ERROR', en: "A server error occurred, please try again later." },
  
  // models/order.model.ts
  'رجالي': { key: 'COMMON.MENS', en: "Men's" },
  'نسائي': { key: 'COMMON.WOMENS', en: "Women's" },
  'مختلط': { key: 'COMMON.UNISEX', en: "Unisex" },

  // catalog.service.ts
  'ملابس رجالية': { key: 'CATALOG.MENS_CLOTHING', en: "Men's Clothing" },

  // cart-page-config.service.ts
  'سلة التسوق': { key: 'CART.TITLE', en: "Shopping Cart" },
  'كود الخصم': { key: 'CART.DISCOUNT_CODE', en: "Discount Code" },
  'ادخل كود الخصم': { key: 'CART.ENTER_DISCOUNT', en: "Enter discount code" },
  'تطبيق': { key: 'COMMON.APPLY', en: "Apply" },
  'إتمام الطلب': { key: 'CART.CHECKOUT', en: "Checkout" },
  'السلة فارغة': { key: 'CART.EMPTY', en: "Cart is empty" },
  'منتجات أصلية': { key: 'CART.ORIGINAL_PRODUCTS', en: "Original Products" },
  '100% مضمونة': { key: 'CART.GUARANTEED_100', en: "100% Guaranteed" },
  'شحن سريع': { key: 'CART.FAST_SHIPPING', en: "Fast Shipping" },
  'خلال 2 - 5 أيام': { key: 'CART.DELIVERY_TIME', en: "Within 2 - 5 days" },
  'إرجاع سهل': { key: 'CART.EASY_RETURNS', en: "Easy Returns" },
  'خلال 14 يوم': { key: 'CART.RETURN_PERIOD', en: "Within 14 days" },
  'دفع آمن': { key: 'CART.SECURE_PAYMENT', en: "Secure Payment" },
  '100% آمن': { key: 'CART.SECURE_100', en: "100% Secure" },

  // contact-page-config.service.ts
  'تواصل معنا': { key: 'CONTACT.TITLE', en: "Contact Us" },
  'نحن هنا لمساعدتك والإجابة على كافة استفساراتك.': { key: 'CONTACT.SUBTITLE', en: "We are here to help you and answer all your inquiries." },
  'أرسل لنا رسالة': { key: 'CONTACT.FORM_TITLE', en: "Send us a message" },
  'سنقوم بالرد عليك في أقرب وقت ممكن.': { key: 'CONTACT.FORM_SUBTITLE', en: "We will respond to you as soon as possible." },
  'خدمة العملاء': { key: 'CONTACT.CUSTOMER_SERVICE', en: "Customer Service" },
  'واتساب': { key: 'CONTACT.WHATSAPP', en: "WhatsApp" },
  'البريد الإلكتروني': { key: 'CONTACT.EMAIL', en: "Email" },

  // home-page-config.service.ts
  'خصر منحوت\\nوقوام أكثر أنوثة': { key: 'HOME.HERO_TITLE', en: "Sculpted Waist\\nAnd More Feminine Figure" },
  'دفع عند الاستلام\\nأو دفع آمن إلكترونياً': { key: 'HOME.BENEFIT_1', en: "Cash on Delivery\\nOr Secure Online Payment" },
  'توصيل سريع\\nلكافة المدن السعودية': { key: 'HOME.BENEFIT_2', en: "Fast Delivery\\nTo All Saudi Cities" },
  'استبدال سهل\\nوسياسة استرجاع مرنة': { key: 'HOME.BENEFIT_3', en: "Easy Exchange\\nAnd Flexible Return Policy" },
  'تسوقي حسب الفئة': { key: 'HOME.SHOP_BY_CATEGORY', en: "Shop by Category" },
  'القطع الأكثر مبيعاً': { key: 'HOME.BEST_SELLERS', en: "Best Sellers" },

  // notifications
  'الإشعارات': { key: 'NOTIFICATIONS.TITLE', en: "Notifications" },
  'لا توجد إشعارات حالياً': { key: 'NOTIFICATIONS.EMPTY', en: "No notifications currently" },

  // order service
  'المسؤول': { key: 'ORDER.ADMIN', en: "Admin" },

  // about page
  'من نحن': { key: 'ABOUT.TITLE', en: "About Us" },
  'لوكس كينج... ثقتك، راحتك، جمالك': { key: 'ABOUT.SLOGAN', en: "LOXX KING... Your Trust, Comfort, Beauty" },
  'لوكس كينج هو متجرك الموثوق\\nلمشدات الجسم ومنتجات العناية\\nبالجمال عالية الجودة.\\nنحن نؤمن أن الثقة تبدأ من الراحة،\\nونختار لك الأفضل لتشعري بأجمل\\nإطلالة كل يوم.': { key: 'ABOUT.DESC', en: "LOXX KING is your trusted store\\nfor body shapers and high-quality\\nbeauty products.\\nWe believe trust starts with comfort,\\nand we choose the best for you to look\\nbeautiful every day." },
  'لماذا نحن؟': { key: 'ABOUT.WHY_US', en: "Why Us?" },
  'جودة استثنائية': { key: 'ABOUT.QUALITY', en: "Exceptional Quality" },
  'نختار منتجاتنا بعناية فائقة لضمان أفضل النتائج.': { key: 'ABOUT.QUALITY_DESC', en: "We choose our products carefully to ensure the best results." },
  'راحة تامة': { key: 'ABOUT.COMFORT', en: "Total Comfort" },
  'تصاميم تناسب الاستخدام اليومي دون إزعاج.': { key: 'ABOUT.COMFORT_DESC', en: "Designs suitable for daily use without discomfort." },
  'نتائج ملحوظة': { key: 'ABOUT.RESULTS', en: "Noticeable Results" },
  'منتجات تساعدك على إبراز جمالك الطبيعي.': { key: 'ABOUT.RESULTS_DESC', en: "Products that help highlight your natural beauty." },
  'رؤيتنا': { key: 'ABOUT.VISION_TITLE', en: "Our Vision" },
  'أن نكون الخيار الأول في مجال مشدات الجسم ومنتجات الجمال في الوطن العربي\\nمن خلال الجودة، المصداقية وخدمة العملاء المتميزة.': { key: 'ABOUT.VISION_TEXT', en: "To be the first choice for body shapers and beauty products in the Arab world\\nthrough quality, credibility, and outstanding customer service." },
  'رسالتنا': { key: 'ABOUT.MISSION_TITLE', en: "Our Mission" },
  'تقديم منتجات موثوقة وآمنة تساعدك على إبراز جمالك وثقتك بنفسك،\\nمع تجربة تسوق سهلة، سريعة وآمنة.': { key: 'ABOUT.MISSION_TEXT', en: "Providing reliable and safe products that help highlight your beauty and confidence,\\nwith an easy, fast, and secure shopping experience." },
  'قيمنا': { key: 'ABOUT.VALUES_TITLE', en: "Our Values" },
  'المصداقية': { key: 'ABOUT.VALUE_1', en: "Credibility" },
  'العناية بالعميل': { key: 'ABOUT.VALUE_2', en: "Customer Care" },
  'الجودة العالية': { key: 'ABOUT.VALUE_3', en: "High Quality" },
  'الابتكار المستمر': { key: 'ABOUT.VALUE_4', en: "Continuous Innovation" },
  'الشفافية': { key: 'ABOUT.VALUE_5', en: "Transparency" },
  'فيسبوك': { key: 'SOCIAL.FACEBOOK', en: "Facebook" },
  'إنستغرام': { key: 'SOCIAL.INSTAGRAM', en: "Instagram" },
  'بريد إلكتروني': { key: 'SOCIAL.EMAIL', en: "Email" },
  'اتصال': { key: 'SOCIAL.CALL', en: "Call" },

  // all shapers
  'كل المشدات': { key: 'PRODUCTS.ALL_SHAPERS', en: "All Shapers" },
  'لا توجد منتجات بهذه المواصفات': { key: 'PRODUCTS.NO_PRODUCTS', en: "No products found matching these specifications" },
  'جرّبي تغيير اللون أو المقاس أو نطاق السعر.': { key: 'PRODUCTS.TRY_CHANGING', en: "Try changing the color, size, or price range." },
  'عرض كل المشدات': { key: 'PRODUCTS.VIEW_ALL', en: "View All Shapers" },

  // categories
  'التصنيفات': { key: 'CATEGORIES.TITLE', en: "Categories" },
  'تصفح جميع المنتجات حسب الفئة': { key: 'CATEGORIES.SUBTITLE', en: "Browse all products by category" },
  'مشدات': { key: 'CATEGORIES.SHAPERS', en: "Shapers" },
  'رجالية': { key: 'CATEGORIES.MENS', en: "Men's" },
  'دعم مثالي وثقة\\nطوال اليوم': { key: 'CATEGORIES.MENS_DESC', en: "Perfect support and confidence\\nall day long" },
  'نسائية': { key: 'CATEGORIES.WOMENS', en: "Women's" },
  'تصاميم أنثوية\\nلإطلالة مثالية': { key: 'CATEGORIES.WOMENS_DESC', en: "Feminine designs\\nfor a perfect look" },
  'مشدات بعد': { key: 'CATEGORIES.POST', en: "Post" },
  'الولادة': { key: 'CATEGORIES.MATERNITY', en: "Maternity" },
  'راحة ودعم بعد\\nفترة الحمل': { key: 'CATEGORIES.MATERNITY_DESC', en: "Comfort and support after\\npregnancy" },
  'رياضية': { key: 'CATEGORIES.SPORTS', en: "Sports" },
  'حرية الحركة\\nوأداء أفضل': { key: 'CATEGORIES.SPORTS_DESC', en: "Freedom of movement\\nand better performance" },
  'مشد كامل': { key: 'CATEGORIES.FULL_BODY', en: "Full Body" },
  'الجسم': { key: 'CATEGORIES.BODY', en: "Body" },
  'تنسيق شامل\\nلجسم مثالي': { key: 'CATEGORIES.FULL_BODY_DESC', en: "Comprehensive coordination\\nfor a perfect body" },
  'الخصر': { key: 'CATEGORIES.WAIST', en: "Waist" },
  'خصر أنحف\\nوإطلالة جذابة': { key: 'CATEGORIES.WAIST_DESC', en: "Slimmer waist\\nand attractive look" },

  // checkout
  'أدخل بياناتك لإكمال الطلب': { key: 'CHECKOUT.ENTER_DETAILS', en: "Enter your details to complete the order" },
  'بيانات العميل': { key: 'CHECKOUT.CUSTOMER_DETAILS', en: "Customer Details" },
  'طريقة الدفع': { key: 'CHECKOUT.PAYMENT_METHOD', en: "Payment Method" },
  'ملخص الطلب': { key: 'CHECKOUT.ORDER_SUMMARY', en: "Order Summary" },
  'تسوق آمن': { key: 'CHECKOUT.SECURE_SHOPPING', en: "Secure Shopping" },
  'نحن نضمن حماية بياناتك ومعلوماتك الشخصية': { key: 'CHECKOUT.DATA_PROTECTION', en: "We guarantee the protection of your personal data and information" },
  'لا توجد منتجات لإتمام الطلب': { key: 'CHECKOUT.NO_PRODUCTS', en: "No products to checkout" },
  'أضيفي المنتجات إلى السلة أولًا ثم تابعي إتمام الطلب.': { key: 'CHECKOUT.ADD_FIRST', en: "Add products to the cart first, then proceed to checkout." },
  'عودة إلى السلة': { key: 'CHECKOUT.BACK_TO_CART', en: "Back to Cart" },

  // faq
  'الأسئلة الشائعة': { key: 'FAQ.TITLE', en: "Frequently Asked Questions" },
  'إجابات سريعة على أكثر الأسئلة شيوعًا حول الطلب والمقاسات والاستخدام': { key: 'FAQ.SUBTITLE', en: "Quick answers to the most common questions about ordering, sizing, and use" },
  'ابحث عن سؤالك': { key: 'FAQ.SEARCH', en: "Search for your question" },
  'لم تجد إجابتك؟': { key: 'FAQ.NOT_FOUND', en: "Didn't find your answer?" },
  'تواصل معنا عبر واتساب': { key: 'FAQ.CONTACT_WHATSAPP', en: "Contact us via WhatsApp" },
  'كيف أختار المقاس؟': { key: 'FAQ.Q1', en: "How do I choose the size?" },
  'يمكنك اختيار المقاس عبر دليل المقاسات...': { key: 'FAQ.A1', en: "You can choose the size via the size guide..." },
  'هل يمكن الاستبدال؟': { key: 'FAQ.Q2', en: "Is exchange possible?" },
  'نعم، يمكنك طلب الاستبدال خلال 14 يومًا...': { key: 'FAQ.A2', en: "Yes, you can request an exchange within 14 days..." },
  'كم مدة التوصيل؟': { key: 'FAQ.Q3', en: "How long is the delivery time?" },
  'يستغرق التوصيل عادةً من يومين إلى خمسة أيام عمل...': { key: 'FAQ.A3', en: "Delivery usually takes from two to five working days..." },

  // favorites
  'المفضلة': { key: 'FAVORITES.TITLE', en: "Favorites" },
  'المنتجات التي قمت بحفظها لوقت لاحق': { key: 'FAVORITES.SUBTITLE', en: "Products you have saved for later" },
  'إضافة جميع المنتجات إلى السلة': { key: 'FAVORITES.ADD_ALL', en: "Add all products to cart" },
  'قائمة المفضلة فارغة': { key: 'FAVORITES.EMPTY', en: "Favorites list is empty" },
  'لم تقم بإضافة أي منتجات إلى قائمة المفضلة بعد': { key: 'FAVORITES.EMPTY_DESC', en: "You have not added any products to the favorites list yet" },
  'ابدأ التسوق': { key: 'COMMON.START_SHOPPING', en: "Start Shopping" },
  '2 - 5 أيام': { key: 'CART.DAYS_2_5', en: "2 - 5 days" },

  // home
  'شد أقوى\\nوقوام أفضل': { key: 'HOME.HERO_TITLE2', en: "Stronger Compression\\nAnd Better Figure" },
  'دفع عند الاستلام\\nادفع بعد الاستلام': { key: 'HOME.BENEFIT_1_ALT', en: "Cash on Delivery\\nPay after receipt" },
  'توصيل سريع\\nلكافة المناطق': { key: 'HOME.BENEFIT_2_ALT', en: "Fast Delivery\\nTo all regions" },
  'استبدال سهل\\nوسياسات مرنة': { key: 'HOME.BENEFIT_3_ALT', en: "Easy Exchange\\nAnd flexible policies" },
  'تسوق حسب الفئة': { key: 'HOME.SHOP_BY_CATEGORY_ALT', en: "Shop by Category" },
  'الأكثر مبيعاً': { key: 'HOME.BEST_SELLERS_ALT', en: "Best Sellers" },

  // my orders
  'تتبع الطلب': { key: 'ORDERS.TRACK', en: "Track Order" },
  'أدخل رقم الهاتف ورقم الطلب لمعرفة حالة طلبك بسهولة': { key: 'ORDERS.TRACK_DESC', en: "Enter your phone number and order number to easily check your order status" },
  'رقم الهاتف': { key: 'COMMON.PHONE', en: "Phone Number" },
  'رقم الطلب': { key: 'COMMON.ORDER_NUMBER', en: "Order Number" },
  'ليس لديك طلبات مشحونة': { key: 'ORDERS.NO_SHIPPED', en: "You have no shipped orders" },
  'لا يوجد حاليًا أي طلبات مكتملة أو قيد الشحن. ابدئي التسوق وسيظهر طلبك هنا بعد إتمامه.': { key: 'ORDERS.NO_ORDERS_DESC', en: "There are currently no completed or shipping orders. Start shopping and your order will appear here once completed." },
  'ابدأي التسوق': { key: 'COMMON.START_SHOPPING_FEM', en: "Start Shopping" },
  'لم يتم العثور على طلب مطابق': { key: 'ORDERS.NOT_FOUND', en: "No matching order found" },
  'تأكدي من رقم الهاتف أو رقم الطلب ثم حاولي مرة أخرى.': { key: 'ORDERS.TRY_AGAIN', en: "Please check your phone number or order number and try again." },
  'نحن هنا لمساعدتك': { key: 'ORDERS.HELP_TITLE', en: "We are here to help you" },
  'إذا واجهت أي مشكلة، تواصل معنا عبر واتساب': { key: 'ORDERS.HELP_DESC', en: "If you encounter any problem, contact us via WhatsApp" },

  // offers
  'عروض خاصة': { key: 'OFFERS.TITLE', en: "Special Offers" },
  'أفضل الأسعار لفترة محدودة': { key: 'OFFERS.SUBTITLE', en: "Best prices for a limited time" },
  'التخفيضات الحالية': { key: 'OFFERS.CURRENT', en: "Current Discounts" },
  'وفر أكثر مع الباقات': { key: 'OFFERS.BUNDLES', en: "Save more with bundles" },
  'اختار الباقة الأنسب لك بأسعار مخفضة': { key: 'OFFERS.BUNDLES_DESC', en: "Choose the most suitable bundle for you at discounted prices" },

  // order confirmation
  'تم تأكيد طلبك': { key: 'CHECKOUT.CONFIRMED', en: "Your order has been confirmed" },
  'شكراً لتسوقك من LOXX KING. تم استلام طلبك بنجاح.': { key: 'CHECKOUT.SUCCESS_DESC', en: "Thank you for shopping with LOXX KING. Your order has been received successfully." },

  // policies
  'السياسات والمعلومات': { key: 'POLICIES.TITLE', en: "Policies and Information" },
  'تعرف على سياسات المتجر وشروط استخدامه': { key: 'POLICIES.SUBTITLE', en: "Learn about the store policies and terms of use" },
  'سياسة الخصوصية': { key: 'POLICIES.PRIVACY', en: "Privacy Policy" },
  'كيف نحمي بياناتك ومعلوماتك': { key: 'POLICIES.PRIVACY_DESC', en: "How we protect your data and information" },
  'سياسة الخصوصية والأمان': { key: 'POLICIES.PRIVACY_SEC', en: "Privacy and Security Policy" },
  'نحن نأخذ خصوصيتك على محمل الجد، ونلتزم بحماية كافة بياناتك الشخصية وفقاً لأعلى معايير الأمان العالمية.': { key: 'POLICIES.PRIVACY_TEXT', en: "We take your privacy seriously and are committed to protecting all your personal data in accordance with the highest global security standards." },
  'جمع المعلومات': { key: 'POLICIES.INFO_COLLECTION', en: "Information Collection" },
  'نحن نجمع فقط المعلومات الضرورية لإتمام طلباتك...': { key: 'POLICIES.INFO_TEXT', en: "We only collect the information necessary to complete your orders..." },
  'الاستبدال والاسترجاع': { key: 'POLICIES.RETURNS', en: "Exchange and Return" },
  'شروط إرجاع واستبدال المنتجات': { key: 'POLICIES.RETURNS_DESC', en: "Terms of returning and exchanging products" },
  'سياسة الاستبدال والاسترجاع': { key: 'POLICIES.RETURNS_POLICY', en: "Exchange and Return Policy" },
  'حرصاً منا على رضاكم، نوفر سياسة مرنة للاستبدال والاسترجاع...': { key: 'POLICIES.RETURNS_TEXT', en: "To ensure your satisfaction, we provide a flexible exchange and return policy..." },
  'شروط الاستبدال': { key: 'POLICIES.EXCHANGE_TERMS', en: "Exchange Terms" },
  'يجب أن يكون المنتج في حالته الأصلية': { key: 'POLICIES.CONDITION', en: "The product must be in its original condition" },
  'الاستبدال خلال 14 يوما': { key: 'POLICIES.EXCHANGE_PERIOD', en: "Exchange within 14 days" },

  // product page
  'اللون': { key: 'PRODUCT.COLOR', en: "Color" },
  'المقاس': { key: 'PRODUCT.SIZE', en: "Size" },
  'دليل المقاسات': { key: 'PRODUCT.SIZE_GUIDE', en: "Size Guide" },
  'أضف للسلة': { key: 'PRODUCT.ADD_TO_CART', en: "Add to Cart" },
  'شراء الآن': { key: 'PRODUCT.BUY_NOW', en: "Buy Now" },
  'توصيل مجاني للطلبات فوق': { key: 'PRODUCT.FREE_SHIPPING', en: "Free shipping for orders over" },
  'استبدال واسترجاع خلال': { key: 'PRODUCT.RETURNS_WITHIN', en: "Exchange and return within" },
  'الوصف': { key: 'PRODUCT.DESCRIPTION', en: "Description" },
  'المميزات': { key: 'PRODUCT.FEATURES', en: "Features" },
  'التقييمات': { key: 'PRODUCT.REVIEWS', en: "Reviews" },
  'خامة آمنة': { key: 'PRODUCT.SAFE_MATERIAL', en: "Safe Material" },
  'لطيفة على البشرة': { key: 'PRODUCT.GENTLE', en: "Gentle on the skin" },
  'خفيف الوزن': { key: 'PRODUCT.LIGHTWEIGHT', en: "Lightweight" },
  'لراحة تدوم طويلاً': { key: 'PRODUCT.COMFORTABLE', en: "For long-lasting comfort" },
  'دعم الظهر': { key: 'PRODUCT.BACK_SUPPORT', en: "Back Support" },
  'يحسن استقامة القوام': { key: 'PRODUCT.IMPROVES_POSTURE', en: "Improves posture" },
  'تهوية عالية': { key: 'PRODUCT.BREATHABLE', en: "Highly Breathable" },
  'يسمح بمرور الهواء': { key: 'PRODUCT.AIRFLOW', en: "Allows air to pass through" },
  'نحت الخصر': { key: 'PRODUCT.WAIST_SCULPTING', en: "Waist Sculpting" },
  'يمنحك شكلاً متناسقاً': { key: 'PRODUCT.SHAPES_BODY', en: "Gives you a harmonious shape" },

  // profile page
  'الملف الشخصي': { key: 'PROFILE.TITLE', en: "Profile" },
  'حدّث صورتك وبيانات التواصل والعنوان المستخدم في طلباتك': { key: 'PROFILE.SUBTITLE', en: "Update your photo, contact details, and address used in your orders" },

  // search page
  'ابحث عن': { key: 'SEARCH.FIND', en: "Search for" },
  'عمليات بحث شائعة': { key: 'SEARCH.POPULAR', en: "Popular Searches" },
  'مشد خصر رجالي': { key: 'SEARCH.MENS_WAIST', en: "Men's waist shaper" },
  'مشد خصر نسائي': { key: 'SEARCH.WOMENS_WAIST', en: "Women's waist shaper" },
  'مشد خصر للتنحيف': { key: 'SEARCH.SLIMMING_WAIST', en: "Slimming waist shaper" },
  'مشد خصر بعد الولادة': { key: 'SEARCH.POSTPARTUM_WAIST', en: "Postpartum waist shaper" },
  'عمليات البحث الأخيرة': { key: 'SEARCH.RECENT', en: "Recent Searches" },
  'لم يتم العثور على أي منتج': { key: 'SEARCH.NO_RESULTS', en: "No product found" },
  'جرب استخدام كلمات بحث مختلفة أو تصفح المنتجات الشائعة': { key: 'SEARCH.TRY_DIFFERENT', en: "Try using different search terms or browse popular products" },
  'لم تجد ما تبحث عنه؟': { key: 'SEARCH.NOT_FOUND', en: "Didn't find what you're looking for?" },
  'تواصل معنا عبر واتساب للمساعدة': { key: 'SEARCH.WHATSAPP_HELP', en: "Contact us via WhatsApp for help" },

  // size guide
  'تعرفي على المقاس المناسب لكِ لضمان أفضل راحة ودعم': { key: 'SIZE_GUIDE.SUBTITLE', en: "Find out the right size for you to ensure the best comfort and support" },
};

function deepSet(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

// 1. Update i18n JSON files
const i18nDir = path.join(__dirname, '../src/assets/i18n');
const enPath = path.join(i18nDir, 'en.json');
const arPath = path.join(i18nDir, 'ar.json');
let enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
let arJson = JSON.parse(fs.readFileSync(arPath, 'utf8'));

Object.entries(dict).forEach(([arString, mapping]) => {
  deepSet(enJson, mapping.key, mapping.en);
  // Un-escape newlines for json storage
  const arFormatted = arString.replace(/\\n/g, '\n');
  deepSet(arJson, mapping.key, arFormatted);
});

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
fs.writeFileSync(arPath, JSON.stringify(arJson, null, 2));

// 2. Patch .ts files in core
function walkAndPatch(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkAndPatch(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Special handling for error interceptor to use translateService
      if (fullPath.includes('error.interceptor.ts')) {
         if (!content.includes('TranslateService')) {
           content = content.replace("import { inject } from '@angular/core';", "import { inject } from '@angular/core';\nimport { TranslateService } from '@ngx-translate/core';");
           content = content.replace("const toastService = inject(ToastService);", "const toastService = inject(ToastService);\n  const translateService = inject(TranslateService);");
         }
      }

      Object.entries(dict).forEach(([arString, mapping]) => {
        // Need to escape backslashes for Regex since some strings have \n literal in TS code
        const safeArString = arString.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const regex1 = new RegExp(`'${safeArString}'`, 'g');
        const regex2 = new RegExp(`\`${safeArString}\``, 'g');
        const regex3 = new RegExp(`"${safeArString}"`, 'g');

        let replacement = `'${mapping.key}'`;
        
        // For the interceptor, we wrap in translateService.instant
        if (fullPath.includes('error.interceptor.ts') && arString !== 'خطأ من المتصفح: ${error.error.message}') {
           replacement = `translateService.instant('${mapping.key}')`;
        }

        // Special case for template literals
        if (arString === 'خطأ من المتصفح: ${error.error.message}') {
           const literalRegex = new RegExp('`خطأ من المتصفح: \\$\\{error\\.error\\.message\\}`', 'g');
           if (literalRegex.test(content)) {
             content = content.replace(literalRegex, "translateService.instant('ERROR.BROWSER').replace('${error.error.message}', error.error.message)");
             changed = true;
           }
        }

        if (regex1.test(content) || regex2.test(content) || regex3.test(content)) {
          content = content.replace(regex1, replacement);
          content = content.replace(regex2, replacement);
          content = content.replace(regex3, replacement);
          changed = true;
        }
      });

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

walkAndPatch(path.join(__dirname, '../src/app/core'));

console.log("Batch 1 completed successfully.");
