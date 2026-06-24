"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">G</span>
              </div>
              <span className="font-bold text-xl text-white">
                Green<span className="text-green-400">ora</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Your one-stop shop for fresh groceries and everyday essentials. 
              Quality products, delivered fast, at fair prices.
            </p>
            <div className="flex gap-3 mt-6">
              {["facebook", "instagram", "twitter"].map(social => (
                <a key={social} href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors duration-200">
                  <span className="text-xs font-bold uppercase text-white">
                    {social[0].toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/collection" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "My Orders", href: "/orders" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-green-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Get In Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-400">📍</span>
                <span>Kha 224 Pragati Sarani, Merul Badda<br />Dhaka 1212, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">📞</span>
                <a href="tel:+8801726339233" className="hover:text-green-400 transition-colors">+8801726-339233</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✉️</span>
                <a href="mailto:bmrauf.me@gmail.com" className="hover:text-green-400 transition-colors">bmrauf.me@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Greenora. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}