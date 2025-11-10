import { Card } from "../../ui/card";
import { Headphones, Clock } from "lucide-react";
import { ImageWithFallback } from "../../images/ImageWithFallback";

interface PodcastCardProps {
  artwork: string;
  title: string;
  description: string;
  duration: string;
  episode?: string;
}

export function PodcastCard({ artwork, title, description, duration, episode }: PodcastCardProps) {
  return (
    <Card className="w-80 flex-shrink-0 rounded-3xl shadow-lg border-0 overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
      {/* Artwork */}
      <div className="relative h-44 overflow-hidden">
        <ImageWithFallback
          src={artwork}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Headphones Icon Overlay */}
        <div className="absolute top-3 left-3 p-2.5 rounded-xl" style={{ backgroundColor: "#20B2AA" }}>
          <Headphones className="w-5 h-5 text-white" />
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-white" />
          <span className="text-xs text-white">{duration}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {episode && (
          <div 
            className="inline-block px-3 py-1 rounded-xl text-xs"
            style={{ backgroundColor: "#20B2AA20", color: "#20B2AA" }}
          >
            {episode}
          </div>
        )}

        <h4 className="leading-snug line-clamp-2" style={{ color: "#1C3B5E" }}>
          {title}
        </h4>
        
        <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: "#333333", opacity: 0.7 }}>
          {description}
        </p>

        {/* Listen Now Button */}
        <button 
          className="w-full py-2.5 rounded-2xl text-sm transition-all hover:opacity-80"
          style={{ backgroundColor: "#20B2AA", color: "white" }}
        >
          Listen Now
        </button>
      </div>
    </Card>
  );
}
