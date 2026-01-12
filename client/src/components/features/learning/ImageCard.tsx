import { Card } from "../../ui/card";
import { Heart } from "lucide-react";
import { ImageWithFallback } from "../../images/ImageWithFallback";

import { getMediaUrl } from "../../../services/contentService";

interface ImageCardProps {
  image: string;
  caption: string;
  category?: string;
}

export function ImageCard({ image, caption, category }: ImageCardProps) {
  return (
    <Card className="w-80 flex-shrink-0 rounded-3xl shadow-lg border-0 overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <ImageWithFallback
          src={getMediaUrl(image)}
          alt={caption}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Category Badge */}
        {category && (
          <div
            className="absolute top-3 left-3 px-3 py-1.5 rounded-xl text-xs"
            style={{ backgroundColor: "#20B2AA", color: "white" }}
          >
            {category}
          </div>
        )}

        {/* Heart Icon */}
        <button
          className="absolute top-3 right-3 p-2.5 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
        >
          <Heart className="w-4 h-4 text-white" />
        </button>

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-white leading-relaxed">
            {caption}
          </p>
        </div>
      </div>
    </Card>
  );
}
