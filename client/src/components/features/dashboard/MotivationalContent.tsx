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
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-semibold text-gray-900 md:block hidden">
          Continue Your Journey
        </h3>
        <button 
          className="text-sm flex items-center gap-1 text-[#20B2AA] hover:text-[#1a9c94] transition-colors"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {motivationalItems.map((item, index) => {
          const Icon = item.icon;
          const isQuote = item.type === "quote";
          
          return (
            <Card 
              key={index} 
              className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group h-full flex flex-col"
            >
              {/* Thumbnail with Aspect Ratio */}
              <div className="relative pt-[56.25%] overflow-hidden bg-gray-50">
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    width={400}
                    height={225}
                  />
                  
                  {/* Overlay with Icon */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-4">
                    <div className="p-2 rounded-xl bg-[#20B2AA] shadow-md">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Progress Bar for Video/Podcast */}
                  {!isQuote && item.progress && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200/50">
                      <div 
                        className="h-full bg-[#20B2AA] transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                {isQuote ? (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Quote className="w-4 h-4 flex-shrink-0 mt-1 text-[#20B2AA]" />
                      <p className="text-sm text-gray-800 leading-relaxed line-clamp-3">
                        "{item.quote}"
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      - {item.author}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500 truncate pr-2">
                        {item.subtitle}
                      </p>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {item.duration}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
