import { Dialog, DialogContent } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { CravingSlider } from "./CravingSlider";
import { X, Calendar, Shield, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";

interface DailyLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DailyLogModal({ open, onOpenChange }: DailyLogModalProps) {
  const [cigaretteCount, setCigaretteCount] = useState<number>(0);
  const [cravingLevel, setCravingLevel] = useState<number>(5);
  const [notes, setNotes] = useState("");
  const [quitDate, setQuitDate] = useState("2025-10-05");
  const [showSmokeFreeConfirmation, setShowSmokeFreeConfirmation] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleSmokeFreeDay = () => {
    setCigaretteCount(0);
    setShowSmokeFreeConfirmation(true);
    setTimeout(() => setShowSmokeFreeConfirmation(false), 3000);
  };

  const handleSave = () => {
    // Save logic would go here
    console.log({
      cigaretteCount,
      cravingLevel,
      notes,
      quitDate,
    });
    onOpenChange(false);
  };

  // Determine shield status based on input
  const getShieldStatus = () => {
    if (cigaretteCount === 0 && cravingLevel <= 3) {
      return { icon: Shield, color: "#8BC34A", label: "Strong Progress" };
    } else if (cigaretteCount === 0 && cravingLevel > 3) {
      return { icon: Shield, color: "#20B2AA", label: "Staying Strong" };
    } else if (cigaretteCount > 0 && cravingLevel >= 7) {
      return { icon: AlertTriangle, color: "#D9534F", label: "Challenging Day" };
    } else {
      return { icon: Shield, color: "#20B2AA", label: "Working Through It" };
    }
  };

  const shieldStatus = getShieldStatus();
  const ShieldIcon = shieldStatus.icon;

  // Calculate slider color based on craving level
  const getSliderColor = (value: number) => {
    if (value <= 3) return "#E0E0E0";
    if (value <= 5) return "#FFA726";
    if (value <= 7) return "#FF7043";
    return "#D9534F";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 rounded-3xl border-0 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-8 pb-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl mb-2" style={{ color: "#1C3B5E" }}>
                Log Today's Progress
              </h2>
              <p className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                {currentDate} at {currentTime}
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all"
            >
              <X className="w-5 h-5" style={{ color: "#333333" }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Progress Visualization */}
          <div
            className="p-6 rounded-2xl flex items-center gap-4 transition-all"
            style={{ backgroundColor: `${shieldStatus.color}15` }}
          >
            <div
              className="p-3 rounded-2xl"
              style={{ backgroundColor: `${shieldStatus.color}30` }}
            >
              <ShieldIcon className="w-6 h-6" style={{ color: shieldStatus.color }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: shieldStatus.color }}>
                {shieldStatus.label}
              </p>
              <p className="text-xs mt-1" style={{ color: "#333333", opacity: 0.6 }}>
                Your progress is being tracked
              </p>
            </div>
          </div>

          {/* Required Field 1: Daily Tobacco Usage */}
          <div className="space-y-3">
            <Label className="text-sm" style={{ color: "#1C3B5E" }}>
              Daily Tobacco Usage <span style={{ color: "#D9534F" }}>*</span>
            </Label>
            
            {/* Smoke-Free Day Button */}
            <button
              onClick={handleSmokeFreeDay}
              className="w-full p-4 rounded-2xl border-2 transition-all hover:shadow-md flex items-center justify-center gap-2"
              style={{
                borderColor: cigaretteCount === 0 ? "#20B2AA" : "#e0e0e0",
                backgroundColor: cigaretteCount === 0 ? "#20B2AA10" : "transparent",
              }}
            >
              <CheckCircle2
                className="w-5 h-5"
                style={{ color: cigaretteCount === 0 ? "#20B2AA" : "#999" }}
              />
              <span style={{ color: cigaretteCount === 0 ? "#20B2AA" : "#333333" }}>
                Smoke-Free Day! 🎉
              </span>
            </button>

            {showSmokeFreeConfirmation && (
              <div
                className="p-3 rounded-xl flex items-center gap-2 animate-in fade-in"
                style={{ backgroundColor: "#8BC34A20" }}
              >
                <Sparkles className="w-4 h-4" style={{ color: "#8BC34A" }} />
                <span className="text-sm" style={{ color: "#8BC34A" }}>
                  Excellent work! Keep it up!
                </span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="0"
                value={cigaretteCount}
                onChange={(e) => setCigaretteCount(parseInt(e.target.value) || 0)}
                className="flex-1 rounded-2xl border-gray-200 text-center text-lg h-14"
                placeholder="0"
              />
              <span className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                cigarettes today
              </span>
            </div>
            <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
              Enter the total number of cigarettes (or equivalent) consumed today
            </p>
          </div>

          {/* Required Field 2: Craving Level */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm" style={{ color: "#1C3B5E" }}>
                Overall Craving Level <span style={{ color: "#D9534F" }}>*</span>
              </Label>
              <div
                className="px-4 py-2 rounded-xl text-lg"
                style={{
                  backgroundColor: `${getSliderColor(cravingLevel)}20`,
                  color: getSliderColor(cravingLevel),
                }}
              >
                {cravingLevel}/10
              </div>
            </div>

            <div className="px-2">
              <CravingSlider
                value={cravingLevel}
                onChange={setCravingLevel}
                min={1}
                max={10}
              />
              <div className="flex justify-between mt-2 text-xs" style={{ color: "#333333", opacity: 0.6 }}>
                <span>Low</span>
                <span>Moderate</span>
                <span>High</span>
              </div>
            </div>
            <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
              Rate your overall craving intensity throughout the day
            </p>
          </div>

          {/* Required Field 3: Quit Date */}
          <div className="space-y-3">
            <Label className="text-sm" style={{ color: "#1C3B5E" }}>
              Official Quit Date
            </Label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#20B2AA" }} />
                <Input
                  type="date"
                  value={quitDate}
                  onChange={(e) => setQuitDate(e.target.value)}
                  className="rounded-2xl border-gray-200 h-14 pl-12"
                />
              </div>
            </div>
            {quitDate && (
              <div className="p-3 rounded-xl" style={{ backgroundColor: "#20B2AA10" }}>
                <p className="text-xs" style={{ color: "#20B2AA" }}>
                  ✓ Quit date set: {new Date(quitDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Optional: Notes */}
          <div className="space-y-3">
            <Label className="text-sm" style={{ color: "#1C3B5E" }}>
              Notes or Triggers (Optional)
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Felt stressed at work, had coffee with friends..."
              className="rounded-2xl border-gray-200 min-h-24 resize-none"
            />
            <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
              Track what triggered cravings or helped you stay strong
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-3 rounded-2xl text-sm transition-all hover:bg-gray-100"
            style={{ color: "#333333" }}
          >
            Cancel
          </button>
          <Button
            onClick={handleSave}
            className="px-8 py-6 rounded-2xl text-white transition-all hover:opacity-90 shadow-md"
            style={{ backgroundColor: "#20B2AA" }}
          >
            Save and Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
