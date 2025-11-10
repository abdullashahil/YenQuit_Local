import { Dialog, DialogContent } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { 
  X, 
  Calendar, 
  TrendingUp, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Target,
  Award,
  Clock,
  MessageCircle
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

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
    { date: "Oct 16, 2025", cigarettes: 0, craving: 4, mood: "😊", notes: "Had coffee with friends but stayed strong. Using breathing exercises helped!" },
    { date: "Oct 15, 2025", cigarettes: 2, craving: 6, mood: "😔", notes: "Stressful day at work. Need to work on stress management techniques." },
    { date: "Oct 14, 2025", cigarettes: 3, craving: 5, mood: "😐", notes: "Morning was tough but afternoon went well. Exercised in the evening." },
    { date: "Oct 13, 2025", cigarettes: 5, craving: 7, mood: "😟", notes: "Felt stressed and anxious. Spoke with AI helper which was very supportive." },
  ];

  const progressData = [
    { week: "Week 1", cigarettes: 18, craving: 8 },
    { week: "Week 2", cigarettes: 14, craving: 7 },
    { week: "Week 3", cigarettes: 10, craving: 6 },
    { week: "Week 4", cigarettes: 7, craving: 5 },
    { week: "Week 5", cigarettes: 4, craving: 4 },
    { week: "Week 6", cigarettes: 2, craving: 4 },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      joined: "#1C3B5E",
      milestone: "#20B2AA", 
      progress: "#FFA726",
      success: "#8BC34A"
    };
    return colors[status as keyof typeof colors] || "#1C3B5E";
  };

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      "😊": "#8BC34A",
      "😐": "#FFA726", 
      "😔": "#D9534F",
      "😟": "#D9534F"
    };
    return colors[mood] || "#1C3B5E";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 rounded-3xl border-0 overflow-hidden shadow-2xl bg-white">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-white to-blue-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#20B2AA] to-[#1C9B94] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                  user.status === 'Active' ? 'bg-green-500' : 
                  user.status === 'Quit' ? 'bg-blue-500' : 'bg-red-500'
                }`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1C3B5E]">{user.name}'s Profile</h2>
                <p className="text-sm text-gray-600 mt-1">Comprehensive view of user progress and journey</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="rounded-2xl border-0 bg-gradient-to-r from-[#20B2AA] to-[#1C9B94] hover:shadow-lg transition-all">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <button 
                onClick={() => onOpenChange(false)}
                className="p-3 rounded-2xl hover:bg-gray-100 transition-all duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-8 space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 rounded-3xl border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-blue-100">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Fagerström Score</p>
                </div>
                <p className="text-3xl font-bold text-[#1C3B5E]">{user.fagerstrom}</p>
                <p className="text-xs text-gray-500 mt-1">Addiction Level: {user.addictionLevel}</p>
              </Card>

              <Card className="p-6 rounded-3xl border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-green-100">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Current Status</p>
                </div>
                <p className="text-3xl font-bold text-[#20B2AA]">{user.status}</p>
                <p className="text-xs text-gray-500 mt-1">45 days in program</p>
              </Card>

              <Card className="p-6 rounded-3xl border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-orange-100">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                </div>
                <p className="text-3xl font-bold text-[#1C3B5E]">72%</p>
                <p className="text-xs text-gray-500 mt-1">18 sessions completed</p>
              </Card>

              <Card className="p-6 rounded-3xl border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-purple-100">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Last Active</p>
                </div>
                <p className="text-3xl font-bold text-[#1C3B5E]">2h</p>
                <p className="text-xs text-gray-500 mt-1">ago</p>
              </Card>
            </div>

            {/* User Information & Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* User Details */}
              <Card className="p-6 rounded-3xl border-0 shadow-lg lg:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-[#20B2AA20]">
                    <User className="w-5 h-5 text-[#20B2AA]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1C3B5E]">User Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-sm text-[#1C3B5E]">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone</p>
                      <p className="text-sm text-[#1C3B5E]">{user.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Age</p>
                      <p className="text-sm text-[#1C3B5E]">{user.age} years</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Member Since</p>
                      <p className="text-sm text-[#1C3B5E]">{user.joinDate}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Progress Chart */}
              <Card className="p-6 rounded-3xl border-0 shadow-lg lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-[#20B2AA20]">
                    <TrendingUp className="w-5 h-5 text-[#20B2AA]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1C3B5E]">Progress Trend</h3>
                </div>
                
                <div className="space-y-4">
                  {progressData.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-[#1C3B5E]">{data.week}</span>
                        <span className="text-[#20B2AA] font-semibold">{data.cigarettes} cigs/day</span>
                      </div>
                      <div className="h-3 rounded-xl bg-gray-200 overflow-hidden">
                        <div 
                          className="h-full rounded-xl transition-all duration-500"
                          style={{ 
                            width: `${(data.cigarettes / 20) * 100}%`,
                            background: "linear-gradient(90deg, #20B2AA 0%, #1C9B94 100%)"
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Craving Level: {data.craving}/10</span>
                        <span>{Math.round((data.cigarettes / 20) * 100)}% of initial</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Timeline & Daily Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Timeline */}
              <Card className="p-6 rounded-3xl border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-[#20B2AA20]">
                    <Calendar className="w-5 h-5 text-[#20B2AA]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1C3B5E]">Journey Timeline</h3>
                </div>
                
                <div className="relative space-y-6 pl-8">
                  <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#20B2AA] to-[#1C9B94]" />
                  
                  {addictionHistory.map((event, index) => (
                    <div key={index} className="relative">
                      <div 
                        className="absolute -left-8 top-1 w-6 h-6 rounded-full border-4 border-white shadow-lg"
                        style={{ backgroundColor: getStatusColor(event.status) }}
                      />
                      <div className="pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-[#1C3B5E]">{event.event}</p>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {event.date}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {event.cigarettesPerDay} cigarettes per day
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Daily Logs */}
              <Card className="p-6 rounded-3xl border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-[#20B2AA20]">
                    <FileText className="w-5 h-5 text-[#20B2AA]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1C3B5E]">Recent Activity</h3>
                </div>
                
                <div className="space-y-4">
                  {dailyLogs.map((log, index) => (
                    <div key={index} className="p-4 rounded-2xl border border-gray-200 bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-semibold text-[#1C3B5E]">{log.date}</span>
                        <div className="flex items-center gap-3 text-xs">
                          <span 
                            className="px-2 py-1 rounded-full font-medium"
                            style={{ 
                              backgroundColor: log.cigarettes === 0 ? '#8BC34A20' : '#FFA72620',
                              color: log.cigarettes === 0 ? '#8BC34A' : '#FFA726'
                            }}
                          >
                            {log.cigarettes} cigs
                          </span>
                          <span 
                            className="px-2 py-1 rounded-full font-medium"
                            style={{ 
                              backgroundColor: log.craving >= 7 ? '#D9534F20' : '#FFA72620',
                              color: log.craving >= 7 ? '#D9534F' : '#FFA726'
                            }}
                          >
                            Craving: {log.craving}/10
                          </span>
                          <span 
                            className="text-lg"
                            style={{ color: getMoodColor(log.mood) }}
                          >
                            {log.mood}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{log.notes}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}