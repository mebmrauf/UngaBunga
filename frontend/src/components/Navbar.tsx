"use client";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShopContext } from "../context/ShopContext";

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link href={href} className={`nav-link ${isActive ? "active" : ""}`}>
      {label}
    </Link>
  );
};

export default function Navbar() {
  const { getCartCount, navigate, token, setToken, setShowSearch, socket, backendUrl } = useContext(ShopContext)!;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (token) {
      // Fetch initial notifications
      fetch(`${backendUrl}/api/user/notifications`, {
        headers: { token }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNotifications(data.notifications);
        }
      })
      .catch(console.error);
    }
  }, [token, backendUrl]);

  useEffect(() => {
    if (socket) {
      const handleNewNotification = (notif: any) => {
        setNotifications(prev => [notif, ...prev]);
        // toast or generic alert can go here
      };
      socket.on('newNotification', handleNewNotification);
      return () => {
        socket.off('newNotification', handleNewNotification);
      };
    }
  }, [socket]);

  const markNotificationsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch(`${backendUrl}/api/user/notifications/read`, {
        method: 'PUT',
        headers: { token }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleNotif = () => {
    if (!notifOpen) markNotificationsRead();
    setNotifOpen(!notifOpen);
    setProfileOpen(false);
  };

  const toggleProfile = () => {
    if (!token) return navigate.push("/login");
    setProfileOpen(!profileOpen);
    setNotifOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setProfileOpen(false);
    navigate.push("/login");
  };

  const cartCount = getCartCount();

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">K</span>
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                Kha<span className="text-orange-600">bari</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <NavLink href="/" label="Home" />
              <NavLink href="/collection" label="Shop" />
              <NavLink href="/recipes" label="Recipes" />
              <NavLink href="/bounties" label="Bounties" />
              <NavLink href="/about" label="About" />
              <NavLink href="/contact" label="Contact" />
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-xl text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-xl text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-orange-600 text-white text-[10px] font-bold rounded-full animate-fade-in">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              {token && (
                <div className="relative">
                  <button
                    onClick={toggleNotif}
                    className="relative p-2 rounded-xl text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 animate-slide-down max-h-[400px] overflow-y-auto z-50">
                      <div className="px-4 pb-2 border-b border-gray-100 flex justify-between items-center mb-2">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                      </div>
                      {notifications.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-gray-500 text-center">No notifications yet.</p>
                      ) : (
                        notifications.map((notif, idx) => (
                          <div key={idx} className={`px-4 py-3 border-b border-gray-50 last:border-0 ${!notif.isRead ? 'bg-orange-50/50' : ''}`}>
                            <p className={`text-sm ${!notif.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{notif.message}</p>
                            <span className="text-[10px] text-gray-400 mt-1 block">
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="p-2 rounded-xl text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                {profileOpen && token && (
                  <div className="absolute right-0 top-12 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-slide-down">
                    <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      My Profile
                    </Link>
                    <Link href="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      My Orders
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-all"
              >
                {mobileOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white animate-slide-down">
            <nav className="flex flex-col px-4 py-3 gap-1">
              {["/", "/collection", "/recipes", "/bounties", "/about", "/contact"].map((href, i) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {["Home", "Shop", "Recipes", "Bounties", "About", "Contact"][i]}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Overlay for dropdowns */}
      {(profileOpen || notifOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setProfileOpen(false); setNotifOpen(false); }} />
      )}
    </>
  );
}