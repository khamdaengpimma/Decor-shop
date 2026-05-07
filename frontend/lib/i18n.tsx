"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "en" | "vn";

const LOCALE_STORAGE_KEY = "decorShopLocale";

const messages = {
  en: {
    navbar: {
      home: "Home",
      collections: "Collections",
      sale: "Sale",
      about: "About",
      orders: "Orders",
      signIn: "Sign In",
      register: "Register",
      logout: "Logout",
      shop: "Shop",
      cart: "Cart",
      login: "Login",
      language: "EN",
    },
    home: {
      newArrivals: "New Arrivals",
      heroTitle: "Style Your Living Space",
      heroDescription: "Curated home décor to make every corner feel like yours.",
      shopNow: "Shop Now",
      createAccount: "Create Account",
      searchPlaceholder: "Search products...",
      filter: "Filter",
      resultsFor: "Results for \"{search}\"",
      allProducts: "All Products",
      items: "{count} items",
      noProductsFound: "No products found",
    },
    about: {
      heroTitle: "Redefining Modern Spaces",
      heroDescription:
        "At DécorShop, we believe that your home should be a reflection of your unique identity. Curating premium, sustainable, and timeless furniture designed to elevate every corner of your life.",
      ourStoryLabel: "Our Story",
      ourStoryTitle: "Craftsmanship meets contemporary aesthetics.",
      paragraph1:
        "Founded in 2024, DécorShop began as a small boutique conceptualized by a team of passionate architects and interior designers. We were tired of the 'fast furniture' movement and wanted to build pieces that endure—both in style and substance.",
      paragraph2:
        "We partner globally with ethical artisans to bring you handcrafted items that blend minimalism with functional warmth. Our materials are sustainably sourced, and our designs are obsessively iterated upon.",
      statHomes: "Happy Homes",
      statRating: "Average Studio Rating",
      promiseTitle: "The DécorShop Promise",
      promise1: {
        title: "Sustainable Materials",
        desc: "Crafted using ethically sourced wood and recycled fabrics to protect our planet.",
      },
      promise2: {
        title: "Timeless Design",
        desc: "Aesthetic structures intended to look stunning today and decades from now.",
      },
      promise3: {
        title: "Lifetime Warranty",
        desc: "We stand entirely behind the durability and craftsmanship of our entire catalog.",
      },
      ctaTitle: "Ready to upgrade your living space?",
      ctaSubtitle: "Explore our latest collection of premium interior essentials.",
      exploreCollections: "Explore Collections",
    },
    login: {
      subtitle: "Sign in to your dashboard",
      emailLabel: "Email",
      passwordLabel: "Password",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "••••••••",
      signIn: "Sign In",
      signingIn: "Signing in…",
      noAccount: "Don't have an account?",
      register: "Register",
      fillFields: "Please fill in all fields.",
      invalidCredentials: "Invalid email or password.",
    },
    register: {
      subtitle: "Create a new admin account",
      fullName: "Full Name",
      email: "Email",
      password: "Password",
      namePlaceholder: "John Doe",
      emailPlaceholder: "admin@example.com",
      passwordPlaceholder: "••••••••",
      createAccount: "Create Account",
      creatingAccount: "Creating account…",
      alreadyHave: "Already have an account?",
      signIn: "Sign in",
      fillFields: "Please fill in all fields.",
      registrationFailed: "Registration failed. Please try again.",
    },
    products: {
      searchPlaceholder: "Search products...",
      filter: "Filter",
      allProducts: "All Products",
      noProductsFound: "No products found.",
      clearFilters: "Clear filters",
      unavailable: "Unavailable",
      added: "✓ Added",
      addToCart: "Add to Cart",
      outOfStock: "Out of stock",
      itemsLeft: "{count} left",      quickAdd: "+ Quick Add",      shopCollection: "Shop Collection",
      categories: {
        All: "All",
        Vases: "Vases",
        Lighting: "Lighting",
        Cushions: "Cushions",
        Rugs: "Rugs",
        Plants: "Plants",
        Art: "Art",
      },
    },
    product: {
      breadcrumbHome: "Home",
      breadcrumbProducts: "Products",
      notFoundTitle: "Product Not Found",
      notFoundMessage: "We couldn't locate the product you were looking for.",
      goBack: "Go Back",
      availability: "Availability:",
      outOfStock: "Out of Stock",
      inStock: "In Stock {count}",
      categoryLabel: "Category:",
      descriptionTitle: "Description",
      descriptionText:
        "This premium decor piece brings a touch of elegance and style to any modern living space. Crafted with attention to detail and designed to stand out, it perfectly complements both contemporary and classic interior themes.",
      currentlyUnavailable: "Currently Unavailable",
      addedToCart: "Added to Cart",
      addToCart: "Add to Cart",
      quantity: "Quantity",
      proceedToCheckout: "Proceed to Checkout",
    },
    cart: {
      checkoutLabel: "Checkout",
      shoppingCart: "Shopping Cart",
      itemsReady: "{count} items ready for checkout",
      emptyTitle: "Cart Empty",
      emptyMessage: "Add some products first",
      browseProducts: "Browse Products",
      deliveryInfo: "Delivery Information",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      shipping: "Shipping",
      free: "Free",
      tax: "Tax (10%)",
      grandTotal: "Grand Total",
      processing: "Processing...",
      loginRequired: "Login Required",
      pleaseLogin: "Please login to continue",
      nameRequired: "Name required",
      emailRequired: "Email required",
      invalidEmail: "Invalid email",
      phoneRequired: "Phone required",
      addressRequired: "Address required",
      checkoutButton: "Checkout • ₫{total}",
      thankYouTitle: "Order Successful",
      thankYouMessage: "Thank you for your purchase.",
      viewOrders: "View Orders",
      enterField: "Enter {field}",
      each: "each",
    },
    orders: {
      purchaseHistory: "Purchase History",
      yourOrders: "Your Orders",
      viewOrders: "View all your purchases and order tracking",
      ordersLabel: "Orders",
      totalSpent: "Total Spent",
      loginRequired: "Login Required",
      pleaseSignIn: "Please sign in to view your order history",
      signIn: "Sign In",
      noOrdersYet: "No Orders Yet",
      noOrdersMessage: "Your purchased products will appear here",
      startShopping: "Start Shopping",
      customerInfo: "Customer Info",
      orderItems: "Order Items",
      totalPayment: "Total Payment",
      status: {
        pending: "Pending",
        processing: "Processing",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled",
      },
    },
    footer: {
      brandDescription: "Curating premium, sustainable, and timeless furniture designed to elevate every corner of your life. Make your space truly yours.",
      shop: "Shop",
      allCollections: "All Collections",
      clearanceSale: "Clearance Sale",
      yourCart: "Your Cart",
      company: "Company",
      aboutUs: "About Us",
      ourPromise: "Our Promise",
      contactSupport: "Contact Support",
      stayInspired: "Stay Inspired",
      subscribeText: "Subscribe for interior design tips and exclusive sales.",
      emailAddress: "Email address",
      go: "Go",
      rightsReserved: "© {year} DécorShop. All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
    },
    sale: {
      trendingSale: "Trending Sale 2026",
      titleLine1: "Modern",
      titleLine2: "Flash Deals",
      description: "Discover premium modern furniture and décor with exclusive discounts from 5% to 30%.",
      shopCollection: "Shop Collection",
      viewCart: "View Cart",
      limitedSale: "Limited Sale",
      saveAmount: "Save ₫{amount}",
      newCollection: "New Collection",
      popularProducts: "Popular Products",
      activeDeals: "Active Deals",
      discount: "Discount",
    },
    admin: {
      nav: {
        products: "Products",
        orders: "Orders",
        customers: "Customers",
        settings: "Settings",
        logout: "Logout",
      },
      stats: {
        totalProducts: "Total Products",
        totalOrders: "Total Orders",
        revenue: "Revenue",
        pendingOrders: "Pending Orders",
        productsTrend: "+3 this week",
        ordersTrend: "{count} pending",
        revenueTrend: "+12% this month",
        pendingTrend: "Needs attention",
      },
      dashboard: "Dashboard",
      welcomeBack: "Welcome back 👋",
      welcomeMessage: "Here's what's happening in your store today.",
      quickActions: "Quick Actions",
      viewProducts: "View Products",
      viewProductsDesc: "Upload photos, set price & stock",
      viewOrders: "View Orders",
      viewOrdersDesc: "{count} pending — needs review",
      totalProducts: "Total Products",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      orderStatuses: {
        pending: "Pending",
        processing: "Processing",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled",
      },
      customerStatuses: {
        active: "Active",
        inactive: "Inactive",
        banned: "Banned",
      },
      settingsTabs: {
        store: "Store",
        shipping: "Shipping",
        profile: "Profile",
        danger: "Danger",
      },
    },
  },
  vn: {
    navbar: {
      home: "Trang chủ",
      collections: "Bộ sưu tập",
      sale: "Giảm giá",
      about: "Giới thiệu",
      orders: "Đơn hàng",
      signIn: "Đăng nhập",
      register: "Đăng ký",
      logout: "Đăng xuất",
      shop: "Mua sắm",
      cart: "Giỏ hàng",
      login: "Đăng nhập",
      language: "VN",
    },
    home: {
      newArrivals: "Hàng mới",
      heroTitle: "Phong cách cho không gian sống của bạn",
      heroDescription: "Trang trí nhà được tuyển chọn để mỗi góc đều thuộc về bạn.",
      shopNow: "Mua ngay",
      createAccount: "Tạo tài khoản",
      searchPlaceholder: "Tìm kiếm sản phẩm...",
      filter: "Lọc",
      resultsFor: "Kết quả cho \"{search}\"",
      allProducts: "Tất cả sản phẩm",
      items: "{count} sản phẩm",
      noProductsFound: "Không tìm thấy sản phẩm",
    },
    about: {
      heroTitle: "Định nghĩa lại không gian hiện đại",
      heroDescription:
        "Tại DécorShop, chúng tôi tin rằng ngôi nhà của bạn nên phản ánh cá tính độc đáo của bạn. Chúng tôi tuyển chọn nội thất cao cấp, bền vững và trường tồn để nâng tầm mọi góc sống.",
      ourStoryLabel: "Câu chuyện của chúng tôi",
      ourStoryTitle: "Nghệ thuật thủ công gặp gỡ thẩm mỹ đương đại.",
      paragraph1:
        "Thành lập năm 2024, DécorShop bắt đầu như một cửa hàng nhỏ được tạo dựng bởi nhóm kiến trúc sư và nhà thiết kế nội thất đam mê. Chúng tôi chán ngấy phong trào 'nội thất nhanh' và muốn tạo ra những sản phẩm bền bỉ cả về phong cách lẫn chất lượng.",
      paragraph2:
        "Chúng tôi hợp tác toàn cầu với các nghệ nhân có đạo đức để mang đến những sản phẩm thủ công hòa quyện giữa chủ nghĩa tối giản và sự ấm áp chức năng. Nguyên liệu của chúng tôi được khai thác bền vững, và thiết kế được hoàn thiện cẩn thận.",
      statHomes: "Ngôi nhà hạnh phúc",
      statRating: "Đánh giá trung bình",
      promiseTitle: "Cam kết của DécorShop",
      promise1: {
        title: "Nguyên liệu bền vững",
        desc: "Chế tác từ gỗ khai thác có trách nhiệm và vải tái chế để bảo vệ hành tinh.",
      },
      promise2: {
        title: "Thiết kế trường tồn",
        desc: "Các cấu trúc thẩm mỹ được thiết kế để đẹp hôm nay và cả hàng thập kỷ sau.",
      },
      promise3: {
        title: "Bảo hành trọn đời",
        desc: "Chúng tôi hoàn toàn đứng sau độ bền và chất lượng của toàn bộ danh mục sản phẩm.",
      },
      ctaTitle: "Sẵn sàng nâng cấp không gian sống?",
      ctaSubtitle: "Khám phá bộ sưu tập nội thất cao cấp mới nhất của chúng tôi.",
      exploreCollections: "Khám phá bộ sưu tập",
    },
    login: {
      subtitle: "Đăng nhập vào bảng điều khiển của bạn",
      emailLabel: "Email",
      passwordLabel: "Mật khẩu",
      emailPlaceholder: "Nhập email của bạn",
      passwordPlaceholder: "••••••••",
      signIn: "Đăng nhập",
      signingIn: "Đang đăng nhập…",
      noAccount: "Chưa có tài khoản?",
      register: "Đăng ký",
      fillFields: "Vui lòng điền đầy đủ thông tin.",
      invalidCredentials: "Email hoặc mật khẩu không hợp lệ.",
    },
    register: {
      subtitle: "Tạo tài khoản quản trị mới",
      fullName: "Họ và Tên",
      email: "Email",
      password: "Mật khẩu",
      namePlaceholder: "Nguyễn Văn A",
      emailPlaceholder: "admin@example.com",
      passwordPlaceholder: "••••••••",
      createAccount: "Tạo tài khoản",
      creatingAccount: "Đang tạo tài khoản…",
      alreadyHave: "Đã có tài khoản?",
      signIn: "Đăng nhập",
      fillFields: "Vui lòng điền đầy đủ thông tin.",
      registrationFailed: "Đăng ký thất bại. Vui lòng thử lại.",
    },
    products: {
      searchPlaceholder: "Tìm kiếm sản phẩm...",
      filter: "Lọc",
      allProducts: "Tất cả sản phẩm",
      noProductsFound: "Không tìm thấy sản phẩm.",
      clearFilters: "Xóa bộ lọc",
      unavailable: "Không có sẵn",
      added: "✓ Đã thêm",
      addToCart: "Thêm vào giỏ",
      outOfStock: "Hết hàng",
      itemsLeft: "Còn {count}",
      quickAdd: "+ Thêm nhanh",
      shopCollection: "Mua sắm bộ sưu tập",
      categories: {
        All: "Tất cả",
        Vases: "Bình",
        Lighting: "Đèn",
        Cushions: "Gối",
        Rugs: "Thảm",
        Plants: "Cây",
        Art: "Nghệ thuật",
      },
    },
    product: {
      breadcrumbHome: "Trang chủ",
      breadcrumbProducts: "Sản phẩm",
      notFoundTitle: "Không tìm thấy sản phẩm",
      notFoundMessage: "Chúng tôi không thể tìm thấy sản phẩm bạn đang tìm.",
      goBack: "Quay lại",
      availability: "Tình trạng:",
      outOfStock: "Hết hàng",
      inStock: "Còn {count}",
      categoryLabel: "Danh mục:",
      descriptionTitle: "Mô tả",
      descriptionText:
        "Sản phẩm trang trí cao cấp này mang đến vẻ đẹp và phong cách cho mọi không gian sống hiện đại. Được chế tác tỉ mỉ và thiết kế để nổi bật, nó phù hợp hoàn hảo với cả phong cách nội thất hiện đại và cổ điển.",
      currentlyUnavailable: "Hiện không có sẵn",
      addedToCart: "Đã thêm vào giỏ",
      addToCart: "Thêm vào giỏ",
      quantity: "Số lượng",
      proceedToCheckout: "Thanh toán",
    },
    cart: {
      checkoutLabel: "Thanh toán",
      shoppingCart: "Giỏ hàng",
      itemsReady: "{count} sản phẩm sẵn sàng thanh toán",
      emptyTitle: "Giỏ hàng trống",
      emptyMessage: "Thêm một số sản phẩm trước",
      browseProducts: "Duyệt sản phẩm",
      deliveryInfo: "Thông tin giao hàng",
      orderSummary: "Tóm tắt đơn hàng",
      subtotal: "Tạm tính",
      shipping: "Vận chuyển",
      free: "Miễn phí",
      tax: "Thuế (10%)",
      grandTotal: "Tổng cộng",
      processing: "Đang xử lý...",
      loginRequired: "Cần đăng nhập",
      pleaseLogin: "Vui lòng đăng nhập để tiếp tục",
      nameRequired: "Tên bắt buộc",
      emailRequired: "Email bắt buộc",
      invalidEmail: "Email không hợp lệ",
      phoneRequired: "Số điện thoại bắt buộc",
      addressRequired: "Địa chỉ bắt buộc",
      checkoutButton: "Thanh toán • ₫{total}",
      thankYouTitle: "Đặt hàng thành công",
      thankYouMessage: "Cảm ơn bạn đã mua hàng.",
      viewOrders: "Xem đơn hàng",
      enterField: "Nhập {field}",
      each: "mỗi",
    },
    orders: {
      purchaseHistory: "Lịch sử mua hàng",
      yourOrders: "Đơn hàng của bạn",
      viewOrders: "Xem tất cả đơn hàng và theo dõi",
      ordersLabel: "Đơn hàng",
      totalSpent: "Tổng chi",
      loginRequired: "Cần đăng nhập",
      pleaseSignIn: "Vui lòng đăng nhập để xem lịch sử đơn hàng",
      signIn: "Đăng nhập",
      noOrdersYet: "Chưa có đơn hàng",
      noOrdersMessage: "Sản phẩm bạn mua sẽ xuất hiện ở đây",
      startShopping: "Bắt đầu mua sắm",
      customerInfo: "Thông tin khách hàng",
      orderItems: "Sản phẩm đơn hàng",
      totalPayment: "Tổng thanh toán",
      status: {
        pending: "Đang xử lý",
        processing: "Đang chuẩn bị",
        shipped: "Đã gửi",
        delivered: "Đã giao",
        cancelled: "Đã hủy",
      },
    },
    footer: {
      brandDescription: "Tuyển chọn nội thất cao cấp, bền vững và trường tồn được thiết kế để nâng tầm mọi góc sống của bạn. Làm cho không gian của bạn thực sự thuộc về bạn.",
      shop: "Cửa hàng",
      allCollections: "Tất cả bộ sưu tập",
      clearanceSale: "Khuyến mãi",
      yourCart: "Giỏ hàng",
      company: "Công ty",
      aboutUs: "Về chúng tôi",
      ourPromise: "Cam kết của chúng tôi",
      contactSupport: "Liên hệ hỗ trợ",
      stayInspired: "Giữ cảm hứng",
      subscribeText: "Đăng ký để nhận mẹo thiết kế và khuyến mãi độc quyền.",
      emailAddress: "Địa chỉ email",
      go: "Gửi",
      rightsReserved: "© {year} DécorShop. Bảo lưu mọi quyền.",
      privacyPolicy: "Chính sách quyền riêng tư",
      termsOfService: "Điều khoản dịch vụ",
    },
    admin: {
      nav: {
        products: "Sản phẩm",
        orders: "Đơn hàng",
        customers: "Khách hàng",
        settings: "Cài đặt",
        logout: "Đăng xuất",
      },
      stats: {
        totalProducts: "Tổng sản phẩm",
        totalOrders: "Tổng đơn hàng",
        revenue: "Doanh thu",
        pendingOrders: "Đơn hàng chờ xử lý",
        productsTrend: "+3 tuần này",
        ordersTrend: "{count} đang chờ",
        revenueTrend: "+12% tháng này",
        pendingTrend: "Cần chú ý",
      },
      dashboard: "Bảng điều khiển",
      welcomeBack: "Chào mừng trở lại 👋",
      welcomeMessage: "Đây là những gì đang xảy ra trong cửa hàng của bạn hôm nay.",
      quickActions: "Hành động nhanh",
      viewProducts: "Xem sản phẩm",
      viewProductsDesc: "Tải lên ảnh, đặt giá và tồn kho",
      viewOrders: "Xem đơn hàng",
      viewOrdersDesc: "{count} đang chờ — cần xem xét",
      totalProducts: "Tổng sản phẩm",
      inStock: "Còn hàng",
      outOfStock: "Hết hàng",
      orderStatuses: {
        pending: "Đang xử lý",
        processing: "Đang chuẩn bị",
        shipped: "Đã gửi",
        delivered: "Đã giao",
        cancelled: "Đã hủy",
      },
      customerStatuses: {
        active: "Hoạt động",
        inactive: "Không hoạt động",
        banned: "Bị cấm",
      },
      settingsTabs: {
        store: "Cửa hàng",
        shipping: "Vận chuyển",
        profile: "Hồ sơ",
        danger: "Nguy hiểm",
      },
    },
    sale: {
      trendingSale: "Xu hướng giảm giá 2026",
      titleLine1: "Hiện đại",
      titleLine2: "Ưu đãi chớp nhoáng",
      description: "Khám phá đồ nội thất và trang trí hiện đại cao cấp với ưu đãi độc quyền từ 5% đến 30%.",
      shopCollection: "Mua bộ sưu tập",
      viewCart: "Xem giỏ hàng",
      limitedSale: "Giảm giá có hạn",
      saveAmount: "Tiết kiệm ₫{amount}",
      newCollection: "Bộ sưu tập mới",
      popularProducts: "Sản phẩm phổ biến",
      activeDeals: "Ưu đãi đang hoạt động",
      discount: "Giảm giá",
    },
  },
};

function resolveTranslation(locale: Locale, path: string) {
  const keys = path.split(".");
  let current: any = messages[locale] as any;

  for (const key of keys) {
    if (current == null) return undefined;
    current = current[key];
  }

  return typeof current === "string" ? current : undefined;
}

function formatTranslation(text: string, params?: Record<string, string | number>) {
  if (!params) return text;
  return text.replace(/\{([^}]+)\}/g, (_, key) => {
    const value = params[key];
    return value != null ? String(value) : "";
  });
}

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (savedLocale === "vn" || savedLocale === "en") {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const text = resolveTranslation(locale, key) ?? resolveTranslation("en", key) ?? key;
      return formatTranslation(text, params);
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useLocale() {
  return useContext(I18nContext).locale;
}

export function useTranslations() {
  return useContext(I18nContext).t;
}
