import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Download, LogOut } from "lucide-react";
import userService from "../../services/userService";
import { useRouter } from "next/navigation";

export function ActionBlock() {
  const router = useRouter();

  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to log out? You will need to sign in again to access your account."
    );
    
    if (!confirmed) return;

    try {
      // Call backend logout endpoint (optional but recommended)
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

  return (
    <Card className="rounded-3xl shadow-lg border-0 p-6">
      <h3 className="text-lg mb-4" style={{ color: "#1C3B5E" }}>
        Account Actions
      </h3>
      
      <div className="space-y-3">

        <Button
          onClick={handleLogout}
          className="w-full py-6 rounded-2xl transition-all hover:opacity-90 flex items-center justify-center gap-2 border"
          style={{ 
            backgroundColor: "transparent", 
            color: "#333333",
            borderColor: "#e0e0e0"
          }}
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </Button>
      </div>
    </Card>
  );
}