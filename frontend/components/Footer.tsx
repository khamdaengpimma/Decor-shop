export default function Footer() {
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
              Curating premium, sustainable, and timeless furniture designed to elevate every corner of your life. Make your space truly yours.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><a href="/products" className="text-sm text-gray-500 hover:text-amber-500 transition-colors">All Collections</a></li>
              <li><a href="/sale" className="text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors">Clearance Sale</a></li>
              <li><a href="/cart" className="text-sm text-gray-500 hover:text-amber-500 transition-colors">Your Cart</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="/about" className="text-sm text-gray-500 hover:text-amber-500 transition-colors">About Us</a></li>
              <li><a href="/about" className="text-sm text-gray-500 hover:text-amber-500 transition-colors">Our Promise</a></li>
              <li><a href="mailto:contact@decorshop.com" className="text-sm text-gray-500 hover:text-amber-500 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-4">Stay Inspired</h3>
            <p className="text-sm text-gray-500 font-light mb-4">Subscribe for interior design tips and exclusive sales.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full px-4 py-2 bg-white border border-black rounded-l-full text-black text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-r-full hover:bg-amber-500 transition-colors">
                Go
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} DécorShop. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
