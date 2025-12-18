import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { Button } from "../ui/button";


import { Key, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function SystemConfiguration() {

  const [aiApiKey, setAiApiKey] = useState("sk_test_••••••••••••••••••••••");
  const [analyticsKey, setAnalyticsKey] = useState("UA-••••••••-•");
  const [showAiKey, setShowAiKey] = useState(false);
  const [showAnalyticsKey, setShowAnalyticsKey] = useState(false);

  const handleTestAIConnection = () => {
    console.log("Testing AI connection...");
  };

  const handleTestAnalyticsConnection = () => {
    console.log("Testing Analytics connection...");
  };

  const ApiKeyInput = ({ value, onChange, placeholder, showKey, setShowKey }: any) => (
    <div className="relative">
      <Input
        type={showKey ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="rounded-2xl h-12 pr-12"
        style={{ borderColor: "#D9534F40" }}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowKey(!showKey)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">



      {/* API Keys */}
      <Card className="p-8 rounded-3xl border-0 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl" style={{ backgroundColor: "#D9534F20" }}>
            <Key className="w-6 h-6" style={{ color: "#D9534F" }} />
          </div>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: "#1C3B5E" }}>
              API Keys & Integrations
            </h3>
            <p className="text-sm mt-1" style={{ color: "#D9534F", opacity: 0.8 }}>
              Sensitive information - Handle with care
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* AI Service API Key */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold" style={{ color: "#1C3B5E" }}>
              AI Service API Key
            </Label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <ApiKeyInput
                  value={aiApiKey}
                  onChange={(e: any) => setAiApiKey(e.target.value)}
                  placeholder="Enter API key..."
                  showKey={showAiKey}
                  setShowKey={setShowAiKey}
                />
              </div>
              <Button
                onClick={handleTestAIConnection}
                className="px-6 py-3 rounded-2xl transition-all hover:scale-105 hover:shadow-lg active:scale-95 font-semibold"
                style={{ backgroundColor: "#20B2AA20", color: "#20B2AA" }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
            </div>
            <p className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
              Used for AI-powered support and personalized recommendations
            </p>
          </div>

          {/* Analytics Integration Key */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold" style={{ color: "#1C3B5E" }}>
              Analytics Integration Key
            </Label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <ApiKeyInput
                  value={analyticsKey}
                  onChange={(e: any) => setAnalyticsKey(e.target.value)}
                  placeholder="Enter analytics key..."
                  showKey={showAnalyticsKey}
                  setShowKey={setShowAnalyticsKey}
                />
              </div>
              <Button
                onClick={handleTestAnalyticsConnection}
                className="px-6 py-3 rounded-2xl transition-all hover:scale-105 hover:shadow-lg active:scale-95 font-semibold"
                style={{ backgroundColor: "#20B2AA20", color: "#20B2AA" }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
            </div>
            <p className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
              Used for tracking user engagement and platform analytics
            </p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center pt-4">
        <Button
          className="px-12 py-6 rounded-2xl text-white font-semibold text-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg"
          style={{ backgroundColor: "#20B2AA" }}
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
}