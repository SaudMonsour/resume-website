/**
 * ===================================
 *  نموذج إعدادات الموقع
 * ===================================
 * 
 * كيف تستخدمه؟
 * 1. انسخ هذا الملف وسمّه: my-data/config.js
 * 2. عدّل كل البيانات اللي تحت وحط معلوماتك بدالها
 * 3. حط صورك في مجلد my-data/images/
 * 
 * وبس كذا! الموقع الحين جاهز ترفعه وتستخدمه.
 */

const MY_CONFIG = {

    // اسمك والمسمى الوظيفي
    name: "اسمك الكريم",
    title: "تخصصك (مثلاً: مطور ويب)",
    pageTitle: "اسمك | تخصصك",

    // صور الواجهة الرئيسية (Hero)
    // الصورة الأساسية (تظهر دايم)
    heroBaseImage: "my-data/images/hero-base.jpeg",
    // الصورة الثانية (تظهر لما يمر الماوس)
    heroHoverImage: "my-data/images/hero-hover.jpeg",

    // روابط التواصل الاجتماعي (اتركها فاضية "" لو ما تبيها تظهر)
    socials: {
        github: "https://github.com/your-username",
        linkedin: "https://www.linkedin.com/in/your-profile",
        email: "your-email@example.com"
    },

    // الإرتباط مع GitHub (عشان يسحب المشاريع تلقائياً)
    githubUsername: "your-username",

    // الدخول للوحة التحكم (في كود القالب هذا الدخول مفتوح للتجربة)
    adminPassword: "", 
    // مفتاح URL للدخول السريع: ?admin=YOUR_KEY
    adminUrlKey: "admin123",

    // مسار ملف البيانات (JSON)
    dataFile: "my-data/portfolio_data.json",

    // روابط صور الشهادات (اختياري لو رافعها على GitHub)
    certImageBaseUrl: "",

    // مفتاح التخزين المحلي (غيره لو تبي تمسح البيانات القديمة)
    storageKey: "portfolio_v1"
};
