import { LayoutDashboard, Users, FileText, Settings, ArrowLeft, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useState } from "react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExitAdmin: () => void;
  onLogout?: () => void;
}

export function AdminSidebar({ activeTab, setActiveTab, onExitAdmin, onLogout }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);
  
  const navItems = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "user-management", label: "User Management", icon: Users },
    { id: "content-management", label: "Content Management", icon: FileText },
    { id: "system-settings", label: "System Settings", icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setOpen(false); // Close mobile menu after selection
  };

  // Sidebar content component (reused for both desktop and mobile)
  const SidebarContent = () => (
    <div
      className="h-full shadow-xl flex flex-col"
      style={{ backgroundColor: "#1C3B5E" }}
    >
      {/* Admin Header */}
      <div className="p-6 border-b" style={{ borderColor: "#ffffff20" }}>
        <div className="flex items-center gap-3 mb-2">
          <div
            className="p-2 rounded-xl"
            style={{ backgroundColor: "#20B2AA" }}
          >
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg text-white">Admin Panel</h2>
            <p className="text-xs" style={{ color: "#ffffff80" }}>
              System Management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive ? "shadow-lg" : ""
              }`}
              style={{
                backgroundColor: isActive ? "#20B2AA" : "transparent",
                color: isActive ? "white" : "#ffffff80",
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm md:text-base">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Exit Admin & Logout Buttons */}
      <div className="p-4 border-t space-y-2" style={{ borderColor: "#ffffff20" }}>
        <button
          onClick={() => {
            onExitAdmin();
            setOpen(false);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all hover:bg-white/10"
          style={{ color: "#ffffff80" }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Exit Admin Panel</span>
        </button>
        
        {onLogout && (
          <button
            onClick={() => {
              onLogout();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all hover:bg-white/10"
            style={{ color: "#ffffff80" }}
          >
            <LogOut className="w-5 h-5" />
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
            aria-label="Open admin menu"
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
