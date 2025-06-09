
export const TRANSLATIONS = {
  en: {
    // Navigation
    home: 'Home',
    browse: 'Browse',
    forYou: 'For You',
    cart: 'Cart',
    account: 'Account',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    
    // Product related
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    viewDetails: 'View Details',
    price: 'Price',
    description: 'Description',
    reviews: 'Reviews',
    rating: 'Rating',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    
    // Categories
    furniture: 'Furniture',
    outdoor: 'Outdoor',
    bedding: 'Bedding & Bath',
    rugs: 'Rugs',
    decor: 'Decor & Pillows',
    lighting: 'Lighting',
    organization: 'Organization',
    kitchen: 'Kitchen',
    homeImprovement: 'Home Improvement',
    shopByRooms: 'Shop by Rooms',
    
    // Search and filters
    search: 'Search',
    searchForFurniture: 'Search for furniture...',
    filters: 'Filters',
    sortBy: 'Sort by',
    priceRange: 'Price Range',
    category: 'Category',
    brand: 'Brand',
    color: 'Color',
    
    // User actions
    myAccount: 'My Account',
    orders: 'Orders',
    wishlist: 'Wishlist',
    addresses: 'Addresses',
    paymentMethods: 'Payment Methods',
    settings: 'Settings',
    
    // Admin
    adminPortal: 'Admin Portal',
    dashboard: 'Dashboard',
    companyInfo: 'Company Info',
    requests: 'Requests',
    categories: 'Categories',
    
    // Seller
    sellerDashboard: 'Seller Dashboard',
    products: 'Products',
    payments: 'Payments',
    logistics: 'Logistics',
    
    // Common actions
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    
    // Messages
    welcome: 'Welcome',
    thankYou: 'Thank You',
    error: 'Error',
    success: 'Success',
    loading: 'Loading...',
    
    // Theme
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    language: 'Language',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    browse: 'تصفح',
    forYou: 'لك',
    cart: 'السلة',
    account: 'الحساب',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    signOut: 'تسجيل الخروج',
    
    // Product related
    addToCart: 'أضف إلى السلة',
    buyNow: 'اشتري الآن',
    viewDetails: 'عرض التفاصيل',
    price: 'السعر',
    description: 'الوصف',
    reviews: 'المراجعات',
    rating: 'التقييم',
    inStock: 'متوفر',
    outOfStock: 'غير متوفر',
    
    // Categories
    furniture: 'الأثاث',
    outdoor: 'الخارجي',
    bedding: 'المفروشات والحمام',
    rugs: 'السجاد',
    decor: 'الديكور والوسائد',
    lighting: 'الإضاءة',
    organization: 'التنظيم',
    kitchen: 'المطبخ',
    homeImprovement: 'تحسين المنزل',
    shopByRooms: 'تسوق حسب الغرف',
    
    // Search and filters
    search: 'بحث',
    searchForFurniture: 'البحث عن الأثاث...',
    filters: 'المرشحات',
    sortBy: 'ترتيب حسب',
    priceRange: 'نطاق السعر',
    category: 'الفئة',
    brand: 'العلامة التجارية',
    color: 'اللون',
    
    // User actions
    myAccount: 'حسابي',
    orders: 'الطلبات',
    wishlist: 'قائمة الأمنيات',
    addresses: 'العناوين',
    paymentMethods: 'طرق الدفع',
    settings: 'الإعدادات',
    
    // Admin
    adminPortal: 'بوابة الإدارة',
    dashboard: 'لوحة التحكم',
    companyInfo: 'معلومات الشركة',
    requests: 'الطلبات',
    categories: 'الفئات',
    
    // Seller
    sellerDashboard: 'لوحة تحكم البائع',
    products: 'المنتجات',
    payments: 'المدفوعات',
    logistics: 'اللوجستيات',
    
    // Common actions
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تحرير',
    delete: 'حذف',
    confirm: 'تأكيد',
    back: 'رجوع',
    next: 'التالي',
    submit: 'إرسال',
    
    // Messages
    welcome: 'مرحباً',
    thankYou: 'شكراً لك',
    error: 'خطأ',
    success: 'نجح',
    loading: 'جاري التحميل...',
    
    // Theme
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع الداكن',
    language: 'اللغة',
  }
} as const;

export type Language = keyof typeof TRANSLATIONS;
export type TranslationKey = keyof typeof TRANSLATIONS.en;
