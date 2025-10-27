import { Dialog, DialogContent } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { X, Calendar, TrendingUp, FileText } from "lucide-react";
import { Card } from "../ui/card";

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

export function UserDetailModal({ open, onOpenChange, user }: UserDetailModalProps) {
  if (!user) return null;

  const addictionHistory = [
    { date: "Sep 2025", event: "Started Program", status: "joined", cigarettesPerDay: 20 },
    { date: "Oct 5, 2025", event: "Set Quit Date", status: "milestone", cigarettesPerDay: 18 },
    { date: "Oct 10, 2025", event: "Reduced to 10/day", status: "progress", cigarettesPerDay: 10 },
    { date: "Oct 16, 2025", event: "Smoke-Free Day", status: "success", cigarettesPerDay: 0 },
  ];

  const dailyLogs = [
    { date: "Oct 16, 2025", cigarettes: 0, craving: 4, notes: "Had coffee with friends but stayed strong. Using breathing exercises helped!" },
    { date: "Oct 15, 2025", cigarettes: 2, craving: 6, notes: "Stressful day at work. Need to work on stress management techniques." },
    { date: "Oct 14, 2025", cigarettes: 3, craving: 5, notes: "Morning was tough but afternoon went well. Exercised in the evening." },
    { date: "Oct 13, 2025", cigarettes: 5, craving: 7, notes: "Felt stressed and anxious. Spoke with AI helper which was very supportive." },
  ];

  const progressData = [
    { week: "Week 1", cigarettes: 18, craving: 8 },
    { week: "Week 2", cigarettes: 14, craving: 7 },
    { week: "Week 3", cigarettes: 10, craving: 6 },
    { week: "Week 4", cigarettes: 7, craving: 5 },
    { week: "Week 5", cigarettes: 4, craving: 4 },
    { week: "Week 6", cigarettes: 2, craving: 4 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 rounded-3xl border-0 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-1" style={{ color: "#1C3B5E" }}>
              {user.name}'s Detailed Profile
            </h2>
            <p className="text-sm" style={{ color: "#333333", opacity: 0.6 }}>
              Comprehensive view of user progress and activity
            </p>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-all">
            <X className="w-5 h-5" style={{ color: "#333333" }} />
          </button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-4 rounded-2xl border-0 shadow-md">
                <p className="text-xs mb-1" style={{ color: "#333333", opacity: 0.7 }}>Fagerström Score</p>
                <p className="text-2xl" style={{ color: "#1C3B5E" }}>{user.fagerstrom}</p>
              </Card>
              <Card className="p-4 rounded-2xl border-0 shadow-md">
                <p className="text-xs mb-1" style={{ color: "#333333", opacity: 0.7 }}>Addiction Level</p>
                <p className="text-2xl" style={{ color: user.addictionLevel === "High" ? "#D9534F" : user.addictionLevel === "Moderate" ? "#FFA726" : "#8BC34A" }}>{user.addictionLevel}</p>
              </Card>
              <Card className="p-4 rounded-2xl border-0 shadow-md">
                <p className="text-xs mb-1" style={{ color: "#333333", opacity: 0.7 }}>Current Status</p>
                <p className="text-2xl" style={{ color: "#20B2AA" }}>{user.status}</p>
              </Card>
              <Card className="p-4 rounded-2xl border-0 shadow-md">
                <p className="text-xs mb-1" style={{ color: "#333333", opacity: 0.7 }}>Days in Program</p>
                <p className="text-2xl" style={{ color: "#1C3B5E" }}>45</p>
              </Card>
            </div>

            <Card className="p-6 rounded-3xl border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl" style={{ backgroundColor: "#20B2AA20" }}>
                  <TrendingUp className="w-5 h-5" style={{ color: "#20B2AA" }} />
                </div>
                <h3 className="text-lg" style={{ color: "#1C3B5E" }}>Progress Trend Chart</h3>
              </div>
              <div className="space-y-3">
                {progressData.map((data, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: "#333333" }}>{data.week}</span>
                      <span style={{ color: "#20B2AA" }}>{data.cigarettes} cigs/day</span>
                    </div>
                    <div className="h-8 rounded-xl bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-xl transition-all" style={{ width: `${(data.cigarettes / 20) * 100}%`, backgroundColor: "#20B2AA" }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 rounded-3xl border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl" style={{ backgroundColor: "#20B2AA20" }}>
                  <Calendar className="w-5 h-5" style={{ color: "#20B2AA" }} />
                </div>
                <h3 className="text-lg" style={{ color: "#1C3B5E" }}>Addiction History Timeline</h3>
              </div>
              <div className="relative space-y-4 pl-6">
                <div className="absolute left-2 top-2 bottom-2 w-0.5" style={{ backgroundColor: "#20B2AA40" }} />
                {addictionHistory.map((event, index) => {
                  const colors: Record<string, string> = { joined: "#1C3B5E", milestone: "#20B2AA", progress: "#FFA726", success: "#8BC34A" };
                  return (
                    <div key={index} className="relative">
                      <div className="absolute -left-6 top-1 w-4 h-4 rounded-full border-4 border-white" style={{ backgroundColor: colors[event.status] }} />
                      <div className="pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm" style={{ color: "#1C3B5E" }}>{event.event}</p>
                          <span className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>{event.date}</span>
                        </div>
                        <p className="text-xs" style={{ color: "#333333", opacity: 0.7 }}>{event.cigarettesPerDay} cigarettes/day</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6 rounded-3xl border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl" style={{ backgroundColor: "#20B2AA20" }}>
                  <FileText className="w-5 h-5" style={{ color: "#20B2AA" }} />
                </div>
                <h3 className="text-lg" style={{ color: "#1C3B5E" }}>Daily Log Notes</h3>
              </div>
              <div className="space-y-4">
                {dailyLogs.map((log, index) => (
                  <div key={index} className="p-4 rounded-2xl border" style={{ borderColor: "#f0f0f0" }}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm" style={{ color: "#1C3B5E" }}>{log.date}</span>
                      <div className="flex gap-3 text-xs">
                        <span style={{ color: "#333333", opacity: 0.7 }}>{log.cigarettes} cigs</span>
                        <span style={{ color: log.craving >= 7 ? "#D9534F" : "#FFA726" }}>Craving: {log.craving}/10</span>
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: "#333333" }}>{log.notes}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
