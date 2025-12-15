"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Settings,
  ArrowLeft,
  LogOut,
  Menu,
  Shield,
  MessageSquare
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useState } from "react";
import userService from "../../services/userService";
import { useRouter } from "next/navigation";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExitAdmin: () => void;
  onLogout?: () => void;
}

export function AdminSidebar({ activeTab, setActiveTab, onExitAdmin, onLogout }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to log out? You will need to sign in again to access your account."
    );

    if (!confirmed) return;

    try {
      // Call backend logout endpoint
      await userService.logout();
    } catch (error) {
      // Continue with logout even if backend call fails
      console.error("Logout API call failed:", error);
    } finally {
      // Clear all storage regardless of API call success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      sessionStorage.clear();

      // Redirect to login page
      router.push('/login');
    }
  };

  const navItems = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin", badge: null },
    { id: "content-management", label: "Content Management", icon: FileText, href: "/admin/content", badge: null },
    { id: "communities", label: "Communities", icon: MessageSquare, href: "/admin/communities", badge: null },
    { id: "system-settings", label: "System Settings", icon: Settings, href: "/admin/settings", badge: null },
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1C3B5E] to-[#2D4A6E] shadow-2xl">
      {/* Admin Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-[#20B2AA] to-[#1C9B94] shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <p className="text-sm text-white/60">YenQuit System Management</p>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-2xl bg-white/5 backdrop-blur-sm">
          <p className="text-xs text-white/80">Welcome back,</p>
          <p className="text-sm font-semibold text-white">Admin</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => {
                setActiveTab(item.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-200 group relative ${isActive
                ? "bg-gradient-to-r from-[#20B2AA] to-[#1C9B94] shadow-lg shadow-[#20B2AA]/25"
                : "hover:bg-white/10 hover:translate-x-1"
                }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-white/60 group-hover:text-white"
                  }`}
              />
              <span
                className={`text-sm font-medium transition-colors ${isActive ? "text-white" : "text-white/80 group-hover:text-white"
                  }`}
              >
                {item.label}
              </span>

              {item.badge && (
                <span
                  className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${isActive
                    ? "bg-white/20 text-white"
                    : "bg-[#20B2AA] text-white"
                    }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">

        {onLogout && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 hover:bg-red-500/20 group"
          >
            <div className="p-2 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
              <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300" />
            </div>
            <span className="text-sm text-red-400 group-hover:text-red-300 transition-colors">
              Logout
            </span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="fixed top-6 left-6 z-50 p-3 rounded-2xl md:hidden shadow-lg transition-all hover:scale-105"
            style={{
              backgroundColor: "#1C3B5E",
              backgroundImage: "linear-gradient(135deg, #1C3B5E 0%, #2D4A6E 100%)"
            }}
            aria-label="Open admin menu"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80 border-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-80 z-40">
        <SidebarContent />
      </div>
    </>
  );
}
