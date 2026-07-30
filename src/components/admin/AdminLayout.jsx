import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ClipboardList, Settings, LogOut, ShoppingCart } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders", path: "/admin/orders", icon: ClipboardList },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("locoglovo:adminSession");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0518] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-ink text-white shrink-0">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-brightGold" />
            <span className="font-display font-bold text-lg">Loco<span className="text-brightGold">Glovo</span></span>
          </div>
          <p className="text-[10px] text-white/40 mt-0.5">Admin Dashboard</p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-white/15 text-brightGold" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-red-400 w-full transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="md:hidden bg-ink text-white px-3 py-3 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <ShoppingCart size={16} className="text-brightGold" />
            <span className="font-display font-bold text-xs">Loco<span className="text-brightGold">Glovo</span></span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-[10px] font-medium whitespace-nowrap px-2 py-1.5 rounded-full transition-colors ${
                    isActive ? "bg-white/15 text-brightGold" : "text-white/60"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button onClick={handleLogout} className="text-white/60 hover:text-red-400 shrink-0 px-1.5 py-1">
              <LogOut size={14} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
