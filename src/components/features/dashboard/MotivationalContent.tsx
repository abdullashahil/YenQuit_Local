import { Card } from "../../ui/card";
import { Play, Headphones, Quote, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../../images/ImageWithFallback";

export function MotivationalContent() {
  const motivationalItems = [
    {
      type: "video",
      title: "Understanding Your Triggers",
      subtitle: "Dr. Sarah Johnson",
      duration: "12:45",
      progress: 65,
      thumbnail: "https://images.unsplash.com/photo-1695143302413-425685b8f590?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxtJTIwcGVhY2VmdWwlMjBuYXR1cmV8ZW58MXx8fHwxNzYwNjQ2OTIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Play,
    },
    {
      type: "podcast",
      title: "Stories of Success: Week 2",
      subtitle: "Quitting Journey Podcast",
      duration: "28:15",
      progress: 42,
      thumbnail: "https://images.unsplash.com/photo-1586695724166-d3576546880a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5yaXNlJTIwaG9wZSUyMG5ldyUyMGJlZ2lubmluZ3xlbnwxfHx8fDE3NjA2OTc5NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Headphones,
    },
    {
      type: "quote",
      title: "Daily Inspiration",
      quote: "Every moment is a fresh beginning. You have the power to choose freedom.",
      author: "Community Member",
      thumbnail: "https://images.unsplash.com/photo-1713922804581-b1897dd85dd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGFjaGlldmVtZW50JTIwc3VjY2Vzc3xlbnwxfHx8fDE3NjA2OTc5NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Quote,
      uploadedTime: "2 hours ago",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg" style={{ color: "#1C3B5E" }}>
          Continue Your Journey
        </h3>
        <button 
          className="text-sm flex items-center gap-1 hover:opacity-70 transition-all"
          style={{ color: "#20B2AA" }}
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {motivationalItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <Card 
              key={index} 
              className="rounded-3xl shadow-lg border-0 overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative h-40 overflow-hidden">
                <ImageWithFallback
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay with Icon */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div 
                    className="p-3 rounded-2xl"
                    style={{ backgroundColor: "#20B2AA" }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Progress Bar for Video/Podcast */}
                {item.type !== "quote" && item.progress && (
                  <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: "rgba(255,255,255,0.3)" }}>
                    <div 
                      className="h-full"
                      style={{ 
                        width: `${item.progress}%`,
                        backgroundColor: "#20B2AA"
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-2">
                {item.type === "quote" ? (
                  <>
                    <div className="flex items-start gap-2">
                      <Quote className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: "#20B2AA" }} />
                      <p className="text-sm leading-relaxed" style={{ color: "#333333" }}>
                        "{item.quote}"
                      </p>
                    </div>
                    <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
                      — {item.author}
                    </p>
                    <p className="text-xs" style={{ color: "#20B2AA" }}>
                      Uploaded {item.uploadedTime}
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="text-sm leading-snug" style={{ color: "#1C3B5E" }}>
                      {item.title}
                    </h4>
                    <p className="text-xs" style={{ color: "#333333", opacity: 0.7 }}>
                      {item.subtitle}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
                        {item.duration} remaining
                      </span>
                      {item.progress && (
                        <span className="text-xs" style={{ color: "#20B2AA" }}>
                          {item.progress}% complete
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
