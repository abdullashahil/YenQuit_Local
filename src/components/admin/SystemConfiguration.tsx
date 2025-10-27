import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { Settings, MessageSquare, Key, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function SystemConfiguration() {
  const [bannerMessage, setBannerMessage] = useState("Welcome to Quitting Journey App - Your path to freedom!");
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [landingHeadline, setLandingHeadline] = useState("Start Your Journey to a Smoke-Free Life Today");
  const [landingSubtext, setLandingSubtext] = useState("Join thousands of people who have successfully quit smoking with our evidence-based support program.");
  const [landingCTA, setLandingCTA] = useState("Begin Your Journey");
  const [aiApiKey, setAiApiKey] = useState("sk_test_••••••••••••••••••••••");
  const [analyticsKey, setAnalyticsKey] = useState("UA-••••••••-•");

  const handleTestAIConnection = () => {
    console.log("Testing AI connection...");
  };

  const handleTestAnalyticsConnection = () => {
    console.log("Testing Analytics connection...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl mb-2" style={{ color: "#1C3B5E" }}>
          System Configuration
        </h2>
        <p className="text-sm" style={{ color: "#333333", opacity: 0.6 }}>
          Configure global system settings and integrations
        </p>
      </div>

      {/* Banner Messages */}
      <Card className="p-6 rounded-3xl border-0 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-2 rounded-xl"
            style={{ backgroundColor: "#20B2AA20" }}
          >
            <MessageSquare className="w-5 h-5" style={{ color: "#20B2AA" }} />
          </div>
          <h3 className="text-lg" style={{ color: "#1C3B5E" }}>
            Site Banner Messages
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label style={{ color: "#1C3B5E" }}>
              Banner Content
            </Label>
            <Textarea
              value={bannerMessage}
              onChange={(e) => setBannerMessage(e.target.value)}
              className="rounded-2xl border-gray-200 min-h-24 resize-none"
              placeholder="Enter banner message to display across the platform..."
            />
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ backgroundColor: "#f8f8f8" }}>
            <Checkbox
              id="banner-enabled"
              checked={bannerEnabled}
              onCheckedChange={(checked) => setBannerEnabled(checked as boolean)}
            />
            <label
              htmlFor="banner-enabled"
              className="text-sm cursor-pointer"
              style={{ color: "#1C3B5E" }}
            >
              Display banner message to all users
            </label>
          </div>
        </div>
      </Card>

      {/* Landing Page Content Editor */}
      <Card className="p-6 rounded-3xl border-0 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-2 rounded-xl"
            style={{ backgroundColor: "#20B2AA20" }}
          >
            <Settings className="w-5 h-5" style={{ color: "#20B2AA" }} />
          </div>
          <h3 className="text-lg" style={{ color: "#1C3B5E" }}>
            Landing Page Content
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label style={{ color: "#1C3B5E" }}>
              Main Headline
            </Label>
            <Input
              value={landingHeadline}
              onChange={(e) => setLandingHeadline(e.target.value)}
              className="rounded-2xl border-gray-200 h-12"
              placeholder="Enter landing page headline..."
            />
          </div>

          <div className="space-y-2">
            <Label style={{ color: "#1C3B5E" }}>
              Subheading Text
            </Label>
            <Textarea
              value={landingSubtext}
              onChange={(e) => setLandingSubtext(e.target.value)}
              className="rounded-2xl border-gray-200 min-h-24 resize-none"
              placeholder="Enter landing page description..."
            />
          </div>

          <div className="space-y-2">
            <Label style={{ color: "#1C3B5E" }}>
              Call-to-Action Button Text
            </Label>
            <Input
              value={landingCTA}
              onChange={(e) => setLandingCTA(e.target.value)}
              className="rounded-2xl border-gray-200 h-12"
              placeholder="Enter CTA button text..."
            />
          </div>

          <div className="p-4 rounded-2xl" style={{ backgroundColor: "#20B2AA10" }}>
            <p className="text-xs" style={{ color: "#20B2AA" }}>
              💡 Preview your changes on the landing page before saving
            </p>
          </div>
        </div>
      </Card>

      {/* API Keys */}
      <Card className="p-6 rounded-3xl border-0 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-2 rounded-xl"
            style={{ backgroundColor: "#D9534F20" }}
          >
            <Key className="w-5 h-5" style={{ color: "#D9534F" }} />
          </div>
          <div>
            <h3 className="text-lg" style={{ color: "#1C3B5E" }}>
              API Keys & Integrations
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "#D9534F", opacity: 0.8 }}>
              Sensitive - Handle with care
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* AI Service API Key */}
          <div className="space-y-3">
            <Label style={{ color: "#1C3B5E" }}>
              AI Service API Key
            </Label>
            <div className="flex gap-3">
              <Input
                type="password"
                value={aiApiKey}
                onChange={(e) => setAiApiKey(e.target.value)}
                className="flex-1 rounded-2xl h-12"
                style={{ borderColor: "#D9534F40" }}
                placeholder="Enter API key..."
              />
              <Button
                onClick={handleTestAIConnection}
                className="px-6 py-3 rounded-xl transition-all hover:opacity-90"
                style={{ backgroundColor: "#20B2AA20", color: "#20B2AA" }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
            </div>
            <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
              Used for AI-powered support and personalized recommendations
            </p>
          </div>

          {/* Analytics Integration Key */}
          <div className="space-y-3">
            <Label style={{ color: "#1C3B5E" }}>
              Analytics Integration Key
            </Label>
            <div className="flex gap-3">
              <Input
                type="password"
                value={analyticsKey}
                onChange={(e) => setAnalyticsKey(e.target.value)}
                className="flex-1 rounded-2xl h-12"
                style={{ borderColor: "#D9534F40" }}
                placeholder="Enter analytics key..."
              />
              <Button
                onClick={handleTestAnalyticsConnection}
                className="px-6 py-3 rounded-xl transition-all hover:opacity-90"
                style={{ backgroundColor: "#20B2AA20", color: "#20B2AA" }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
            </div>
            <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
              Used for tracking user engagement and platform analytics
            </p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          className="px-8 py-6 rounded-2xl text-white transition-all hover:opacity-90 shadow-md"
          style={{ backgroundColor: "#20B2AA" }}
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
