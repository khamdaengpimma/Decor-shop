import { useTranslations } from "@/lib/i18n";

export default function Footer() {
  const t = useTranslations();
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 ml:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <span className="text-2xl font-extrabold tracking-tight text-gray-900 mb-4 block">
              Décor<span className="text-amber-500">Shop</span>
            </span>
            <p className="text-sm text-gray-500 font-light leading-relaxed mb-6">
              {t("footer.brandDescription")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-4">{t("footer.shop")}</h3>
            <ul className="space-y-3">
              <li><a href="/products" className="text-sm text-gray-500 hover:text-amber-500 transition-colors">{t("footer.allCollections")}</a></li>
              <li><a href="/sale" className="text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors">{t("footer.clearanceSale")}</a></li>
              <li><a href="/cart" className="text-sm text-gray-500 hover:text-amber-500 transition-colors">{t("footer.yourCart")}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-4">{t("footer.company")}</h3>
            <ul className="space-y-3">
              <li><a href="/about" className="text-sm text-gray-500 hover:text-amber-500 transition-colors">{t("footer.aboutUs")}</a></li>
              <li><a href="/about" className="text-sm text-gray-500 hover:text-amber-500 transition-colors">{t("footer.ourPromise")}</a></li>
              <li><a href="mailto:contact@decorshop.com" className="text-sm text-gray-500 hover:text-amber-500 transition-colors">{t("footer.contactSupport")}</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-4">{t("footer.stayInspired")}</h3>
            <p className="text-sm text-gray-500 font-light mb-4">{t("footer.subscribeText")}</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={t("footer.emailAddress")}
                className="w-full px-4 py-2 bg-white border border-black rounded-l-full text-black text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-r-full hover:bg-amber-500 transition-colors">
                {t("footer.go")}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            {t("footer.rightsReserved", { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors text-sm">{t("footer.privacyPolicy")}</a>
            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors text-sm">{t("footer.termsOfService")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
