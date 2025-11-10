import { Card } from "../../ui/card";
import { Play, Clock } from "lucide-react";
import { ImageWithFallback } from "../../images/ImageWithFallback";

interface VideoCardProps {
  thumbnail: string;
  title: string;
  description: string;
  duration: string;
  instructor?: string;
}

export function VideoCard({ thumbnail, title, description, duration, instructor }: VideoCardProps) {
  return (
    <Card className="w-80 flex-shrink-0 rounded-3xl shadow-lg border-0 overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden">
        <ImageWithFallback
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-all">
          <div 
            className="p-4 rounded-full group-hover:scale-110 transition-transform"
            style={{ backgroundColor: "#20B2AA" }}
          >
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-white" />
          <span className="text-xs text-white">{duration}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h4 className="leading-snug line-clamp-2" style={{ color: "#1C3B5E" }}>
          {title}
        </h4>
        
        <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: "#333333", opacity: 0.7 }}>
          {description}
        </p>

        {instructor && (
          <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>
            By {instructor}
          </p>
        )}

        {/* Watch Now Button */}
        <button 
          className="w-full py-2.5 rounded-2xl text-sm transition-all hover:opacity-80"
          style={{ backgroundColor: "#20B2AA", color: "white" }}
        >
          Watch Now
        </button>
      </div>
    </Card>
  );
}
