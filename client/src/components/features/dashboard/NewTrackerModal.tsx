import { useState } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { X, Calendar } from "lucide-react";
import quitTrackerService from "../../../services/quitTrackerService";

interface NewTrackerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export function NewTrackerModal({ open, onOpenChange, onComplete }: NewTrackerModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Get minimum date (today)
  const minDate = today;

  // Get maximum date (1 year from today)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleSubmit = async () => {
    if (!selectedDate) {
      setError('Please select a quit date');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('🗓️ Creating new tracker with quit date:', selectedDate);

      // Update the quit date in the assist plan
      await quitTrackerService.updateQuitDate(selectedDate);

      console.log('✅ New tracker created successfully');

      onComplete();
      onOpenChange(false);
    } catch (err: any) {
      console.error('❌ Error creating new tracker:', err);
      setError(err.message || 'Failed to create new tracker');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDate("");
    setError(null);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md rounded-3xl shadow-2xl bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold" style={{ color: "#1C3B5E" }}>
            Start New Tracker
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="p-3 rounded-2xl mb-4 mx-auto w-fit" style={{ backgroundColor: "#20B2AA20" }}>
              <Calendar className="w-6 h-6" style={{ color: "#20B2AA" }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#1C3B5E" }}>
              Choose Your New Quit Date
            </h3>
            <p className="text-sm" style={{ color: "#333333" }}>
              Select a future date to begin your new quit tracking journey
            </p>
          </div>

          {/* Date Picker */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#1C3B5E" }}>
                Quit Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setError(null);
                }}
                min={minDate}
                max={maxDateStr}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
                style={{ borderColor: "#e5e7eb" }}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            className="rounded-xl"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!selectedDate || isLoading}
            className="rounded-xl px-8"
            style={{ backgroundColor: "#20B2AA", color: "white" }}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </div>
            ) : (
              "Start New Journey"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
