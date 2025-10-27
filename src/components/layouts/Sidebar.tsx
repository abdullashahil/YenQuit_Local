import { Home, BookOpen, Users, User, Phone, LogOut, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useState } from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const [open, setOpen] = useState(false);
  
  const navItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "learning", label: "Learning Hub", icon: BookOpen },
    { id: "community", label: "Community", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setOpen(false); // Close mobile menu after selection
  };

  // Sidebar content component (reused for both desktop and mobile)
  const SidebarContent = () => (
    <div className="h-full flex flex-col" style={{ backgroundColor: "#1C3B5E" }}>
      {/* Emergency Support Button */}
      <div className="p-6">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-all hover:opacity-90"
          style={{ backgroundColor: "#20B2AA" }}
        >
          <Phone className="w-5 h-5 text-white" />
          <span className="text-white text-sm md:text-base">Live Support</span>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5 text-white" />
              <span className="text-white text-sm md:text-base">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* App Branding */}
      <div className="p-6 border-t" style={{ borderColor: "#ffffff20" }}>
        <div className="text-center mb-4">
          <p className="text-white/60 text-sm">Quitting Journey</p>
          <p className="text-white/40 text-xs mt-1">Your path to freedom</p>
        </div>
        
        {/* Admin Link */}
        <button
          onClick={() => handleNavClick("admin")}
          className="w-full text-xs hover:text-white/80 transition-all mb-3"
          style={{ color: "#ffffff40" }}
        >
          Admin Panel →
        </button>

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-all hover:bg-white/10"
            style={{ color: "#ffffff80" }}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="fixed top-4 left-4 z-50 p-2 rounded-lg md:hidden"
            style={{ backgroundColor: "#1C3B5E" }}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64">
        <SidebarContent />
      </div>
    </>
  );
}
