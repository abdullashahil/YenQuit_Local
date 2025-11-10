import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Calendar, Plus, X, Clock } from "lucide-react";
import { useState } from "react";

export function CampaignScheduler() {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [challengeName, setChallengeName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const plannedCampaigns = [
    { id: 1, name: "30-Day Smoke-Free Challenge", startDate: "Nov 1, 2025", endDate: "Nov 30, 2025", status: "Upcoming" },
    { id: 2, name: "Holiday Season Support", startDate: "Dec 15, 2025", endDate: "Jan 5, 2026", status: "Scheduled" },
    { id: 3, name: "New Year Fresh Start", startDate: "Jan 1, 2026", endDate: "Jan 31, 2026", status: "Scheduled" },
  ];

  const handlePlanCampaign = () => {
    console.log({ challengeName, startDate, endDate });
    setIsPlanModalOpen(false);
    setChallengeName("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <>
      <Card className="rounded-3xl border-0 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ backgroundColor: "#20B2AA20" }}>
              <Calendar className="w-5 h-5" style={{ color: "#20B2AA" }} />
            </div>
            <div>
              <h3 className="text-lg" style={{ color: "#1C3B5E" }}>Campaign Scheduler</h3>
              <p className="text-xs mt-0.5" style={{ color: "#333333", opacity: 0.6 }}>Plan and manage campaigns</p>
            </div>
          </div>
          <Button onClick={() => setIsPlanModalOpen(true)} className="px-4 py-2 rounded-xl text-white transition-all hover:opacity-90" style={{ backgroundColor: "#20B2AA" }}>
            <Plus className="w-4 h-4 mr-2" />
            Plan New Campaign
          </Button>
        </div>

        <div className="p-6 space-y-3">
          {plannedCampaigns.map((campaign) => (
            <div key={campaign.id} className="p-4 rounded-2xl border transition-all hover:shadow-md" style={{ borderColor: "#f0f0f0" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-sm mb-1" style={{ color: "#1C3B5E" }}>{campaign.name}</h4>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "#333333", opacity: 0.6 }}>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{campaign.startDate}</span>
                    </div>
                    <span>→</span>
                    <span>{campaign.endDate}</span>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: "#20B2AA20", color: "#20B2AA" }}>
                  {campaign.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
        <DialogContent className="max-w-2xl p-0 rounded-3xl border-0 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl mb-1" style={{ color: "#1C3B5E" }}>Plan New Campaign</h2>
              <p className="text-sm" style={{ color: "#333333", opacity: 0.6 }}>Schedule a new challenge or campaign</p>
            </div>
            <button onClick={() => setIsPlanModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-all">
              <X className="w-5 h-5" style={{ color: "#333333" }} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label style={{ color: "#1C3B5E" }}>
                Challenge Name <span style={{ color: "#D9534F" }}>*</span>
              </Label>
              <Input value={challengeName} onChange={(e) => setChallengeName(e.target.value)} placeholder="e.g., 30-Day Smoke-Free Challenge" className="rounded-2xl border-gray-200 h-12" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label style={{ color: "#1C3B5E" }}>
                  Start Date <span style={{ color: "#D9534F" }}>*</span>
                </Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-2xl border-gray-200 h-12" />
              </div>
              <div className="space-y-2">
                <Label style={{ color: "#1C3B5E" }}>
                  End Date <span style={{ color: "#D9534F" }}>*</span>
                </Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-2xl border-gray-200 h-12" />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 flex items-center justify-between">
            <Button onClick={() => setIsPlanModalOpen(false)} className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all" style={{ color: "#333333" }}>
              Cancel
            </Button>
            <Button onClick={handlePlanCampaign} className="px-8 py-6 rounded-2xl text-white transition-all hover:opacity-90 shadow-md" style={{ backgroundColor: "#20B2AA" }}>
              Schedule Campaign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
