import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Download, LogOut } from "lucide-react";

export function ActionBlock() {
  return (
    <Card className="rounded-3xl shadow-lg border-0 p-6">
      <h3 className="text-lg mb-4" style={{ color: "#1C3B5E" }}>
        Account Actions
      </h3>
      
      <div className="space-y-3">

        <Button
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
