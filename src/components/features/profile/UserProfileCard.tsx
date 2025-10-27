import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { User, Settings } from "lucide-react";

export function UserProfileCard() {
  return (
    <Card className="rounded-3xl shadow-lg border-0 p-6">
      <div className="flex items-start gap-5">
        {/* Avatar */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#20B2AA20" }}
        >
          <User className="w-10 h-10" style={{ color: "#20B2AA" }} />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-2xl mb-2" style={{ color: "#1C3B5E" }}>
            Sarah Mitchell
          </h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
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
            
            <div className="flex items-center gap-2">
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

            <div className="flex items-center gap-2">
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
            className="w-full rounded-2xl transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#20B2AA", color: "white" }}
          >
            <Settings className="w-4 h-4" />
            Edit Profile / Settings
          </Button>
        </div>
      </div>
    </Card>
  );
}
