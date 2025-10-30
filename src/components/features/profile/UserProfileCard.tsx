import { useState, useEffect } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { User, Settings, X } from "lucide-react";

export function UserProfileCard() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  // Disable background scroll and preserve scrollbar width to prevent layout shift
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Profile Card */}
      <Card className="rounded-3xl shadow-lg border-0 p-6 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar */}
          <div
            className="w-24 h-24 sm:w-20 sm:h-20 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0"
            style={{ backgroundColor: "#20B2AA20" }}
          >
            <User className="w-12 h-12 sm:w-10 sm:h-10" style={{ color: "#20B2AA" }} />
          </div>

          {/* User Info */}
          <div className="flex-1 w-full mt-4 sm:mt-0">
            <h2 className="text-2xl sm:text-2xl mb-2" style={{ color: "#1C3B5E" }}>
              Sarah Mitchell
            </h2>

            <div className="mb-4">
              {/* Classification */}
              <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-start items-center gap-2 mb-2">
                <span className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                  Classification:
                </span>
                <span
                  className="px-3 py-1 rounded-xl text-sm"
                  style={{ backgroundColor: "#20B2AA20", color: "#20B2AA" }}
                >
                  Moderate Smoker
                </span>
              </div>

              {/* Account Status */}
              <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-start items-center gap-2 mb-2">
                <span className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                  Account Status:
                </span>
                <span
                  className="px-3 py-1 rounded-xl text-sm"
                  style={{ backgroundColor: "#8BC34A20", color: "#8BC34A" }}
                >
                  Active Member
                </span>
              </div>

              {/* Member Since */}
              <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-start items-center gap-2">
                <span className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                  Member Since:
                </span>
                <span className="text-sm" style={{ color: "#333333" }}>
                  September 2025
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              onClick={handleToggle}
              className="w-full rounded-2xl transition-all hover:opacity-90 flex items-center justify-center gap-2 mt-2 sm:mt-0"
              style={{ backgroundColor: "#20B2AA", color: "white" }}
            >
              <Settings className="w-4 h-4" />
              Edit Profile / Settings
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal Popup - transparent overlay so background color doesn't change */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto"
        >
          {/* Transparent overlay */}
          <div
            className="absolute inset-0"
            onClick={handleToggle}
            aria-hidden="true"
          />

          {/* Modal Box with full shadow on all sides */}
          <div
            className="relative bg-white rounded-3xl p-6 w-[90%] sm:w-[400px]"
            style={{
              zIndex: 51,
              boxShadow: "0 0 25px rgba(0, 0, 0, 0.25)", // 💫 4-sided ambient shadow
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleToggle}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close edit profile"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-center mb-4" style={{ color: "#1C3B5E" }}>
              Edit Profile
            </h2>

            {/* Manual spacing for form controls */}
            <form>
              {/* Name Field */}
              <div>
                <label className="block text-sm mb-1" style={{ color: "#1C3B5E" }}>
                  Name
                </label>
                <input
                  type="text"
                  defaultValue="Sarah Mitchell"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
                  style={{ backgroundColor: "#F9F9F9" }}
                />
              </div>

              {/* Classification */}
              <div className="mt-4">
                <label className="block text-sm mb-1" style={{ color: "#1C3B5E" }}>
                  Classification
                </label>
                <select
                  defaultValue="Moderate Smoker"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
                  style={{ backgroundColor: "#F9F9F9" }}
                >
                  <option>Non-Smoker</option>
                  <option>Light Smoker</option>
                  <option>Moderate Smoker</option>
                  <option>Heavy Smoker</option>
                </select>
              </div>

              {/* Account Status */}
              <div className="mt-4">
                <label className="block text-sm mb-1" style={{ color: "#1C3B5E" }}>
                  Account Status
                </label>
                <select
                  defaultValue="Active Member"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
                  style={{ backgroundColor: "#F9F9F9" }}
                >
                  <option>Active Member</option>
                  <option>Inactive</option>
                  <option>Suspended</option>
                </select>
              </div>

              {/* Save Button */}
              <Button
                className="w-full mt-6 rounded-2xl transition-all hover:opacity-90"
                style={{ backgroundColor: "#20B2AA", color: "white" }}
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                }}
              >
                Save Changes
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
