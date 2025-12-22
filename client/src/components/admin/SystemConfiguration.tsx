import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Key, Eye, EyeOff, Info, Settings, Save } from "lucide-react";
import { useState, useEffect } from "react";

export function SystemConfiguration() {
  const [aiApiKey, setAiApiKey] = useState("");
  const [aiModel, setAiModel] = useState("");
  const [showAiKey, setShowAiKey] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${API_BASE_URL}/config`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.OPENROUTER_API_KEY) setAiApiKey(data.OPENROUTER_API_KEY);
        if (data.AI_MODEL) setAiModel(data.AI_MODEL);
      }
    } catch (error) {
      console.error("Failed to load config", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${API_BASE_URL}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          aiApiKey,
          aiModel
        })
      });

      if (response.ok) {
        setStatusMessage({ type: 'success', text: 'Configuration saved successfully' });
        // Hide success message after 3 seconds
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Failed to save configuration' });
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20B2AA]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* API Keys */}
      <Card className="p-8 rounded-3xl border-0 shadow-xl relative overflow-hidden">
        {statusMessage && (
          <div className={`absolute top-0 left-0 right-0 p-3 text-center text-sm font-medium transition-colors ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            {statusMessage.text}
          </div>
        )}

        <div className="flex items-center gap-3 mb-6 mt-2">
          <div className="p-3 rounded-2xl" style={{ backgroundColor: "#D9534F20" }}>
            <Key className="w-6 h-6" style={{ color: "#D9534F" }} />
          </div>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: "#1C3B5E" }}>
              API Keys & Integrations
            </h3>
            <p className="text-sm mt-1" style={{ color: "#D9534F", opacity: 0.8 }}>
              Manage external service connections
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* AI Service API Key */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold" style={{ color: "#1C3B5E" }}>
              AI Service API Key (OpenRouter)
            </Label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <ApiKeyInput
                  value={aiApiKey}
                  onChange={(e: any) => setAiApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  showKey={showAiKey}
                  setShowKey={setShowAiKey}
                />
              </div>
            </div>
            <p className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
              Get your key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">OpenRouter</a>. Used for the AI chatbot.
            </p>
          </div>

          {/* AI Model Name */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold" style={{ color: "#1C3B5E" }}>
              AI Model Name
            </Label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  placeholder="e.g. mistralai/mistral-7b-instruct:free"
                  className="rounded-2xl h-12"
                  style={{ borderColor: "#D9534F40" }}
                />
              </div>
            </div>
            <p className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
              Specify the model ID (e.g. meta-llama/llama-3-8b-instruct:free).
            </p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="px-12 py-6 rounded-2xl text-white font-semibold text-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg flex items-center gap-2"
          style={{ backgroundColor: "#20B2AA" }}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Configuration
            </>
          )}
        </Button>
      </div>
    </div>
  );
}