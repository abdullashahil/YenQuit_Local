import { Card } from "../../ui/card";
import { ScrollArea } from "../../ui/scroll-area";
import { Play, Headphones, BookOpen, CheckCircle2 } from "lucide-react";

export function LearningActivityLog() {
  const activities = [
    {
      id: 1,
      type: "video",
      icon: Play,
      action: "Watched",
      title: "5-Minute Breathing Exercises for Cravings",
      date: "Oct 16, 2025",
      time: "2:30 PM",
      completed: true,
    },
    {
      id: 2,
      type: "podcast",
      icon: Headphones,
      action: "Completed",
      title: "Real Stories: One Year Smoke-Free",
      date: "Oct 15, 2025",
      time: "8:15 AM",
      completed: true,
    },
    {
      id: 3,
      type: "article",
      icon: BookOpen,
      action: "Read",
      title: "Understanding Nicotine Withdrawal Symptoms",
      date: "Oct 14, 2025",
      time: "6:45 PM",
      completed: true,
    },
    {
      id: 4,
      type: "video",
      icon: Play,
      action: "Watched",
      title: "Building Your Support System",
      date: "Oct 13, 2025",
      time: "11:20 AM",
      completed: true,
    },
    {
      id: 5,
      type: "podcast",
      icon: Headphones,
      action: "Started",
      title: "Mindfulness for Quitting Success",
      date: "Oct 12, 2025",
      time: "9:00 PM",
      completed: false,
    },
    {
      id: 6,
      type: "video",
      icon: Play,
      action: "Watched",
      title: "The Science of Nicotine Addiction",
      date: "Oct 11, 2025",
      time: "3:15 PM",
      completed: true,
    },
  ];

  return (
    <Card className="rounded-3xl shadow-lg border-0 h-[500px] flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg" style={{ color: "#1C3B5E" }}>
            Learning Hub Activity
          </h3>
          <span className="text-sm px-3 py-1 rounded-xl" style={{ backgroundColor: "#20B2AA10", color: "#20B2AA" }}>
            {activities.length} Activities
          </span>
        </div>
      </div>

<ScrollArea
  className="
    flex-1 p-6
    [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_90%,rgba(0,0,0,0)_100%)]
    overflow-hidden
    rounded-2xl
    isolate
  "
>
  <div
    className="
      bg-white w-full h-full
      rounded-2xl overflow-hidden
      relative isolate
    "
    style={{
      contain: "paint",
      WebkitMaskImage:
        "linear-gradient(to bottom, rgba(0,0,0,1) 98%, rgba(0,0,0,0) 100%)",
    }}
  >
    <div className="space-y-4 pb-6 pr-2 scroll-smooth w-full">
      {activities.map((activity) => {
        const Icon = activity.icon;
        return (
          <div
            key={activity.id}
            className="
              flex items-start gap-3 p-3 rounded-2xl
              hover:bg-gray-50 transition-all w-full overflow-hidden
            "
          >
            {/* Icon */}
            <div
              className="p-2 rounded-xl flex-shrink-0"
              style={{ backgroundColor: '#20B2AA10' }}
            >
              <Icon className="w-5 h-5" style={{ color: '#20B2AA' }} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 break-words">
              <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                <p className="text-sm text-[#333333] break-words leading-snug">
                  <span className="opacity-70">{activity.action}</span>{' '}
                  <span className="text-[#20B2AA] break-all">
                    {activity.title}
                  </span>
                </p>
                {activity.completed && (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#8BC34A]" />
                )}
              </div>
              <p className="text-xs text-[#333333] opacity-50 leading-tight">
                {activity.date} at {activity.time}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</ScrollArea>

    </Card>
  );
}
