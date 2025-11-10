import { Card } from "../../ui/card";
import { Users } from "lucide-react";
import { ImageWithFallback } from "../../images/ImageWithFallback";

interface CommunityGroupCardProps {
  image: string;
  name: string;
  description: string;
  members: number;
}

export function CommunityGroupCard({ image, name, description, members }: CommunityGroupCardProps) {
  return (
    <Card className="rounded-3xl shadow-lg border-0 overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
      {/* Group Image */}
      <div className="relative h-36 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Member Count Badge */}
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-sm flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" style={{ color: "#20B2AA" }} />
          <span className="text-xs" style={{ color: "#333333" }}>
            {members}
          </span>
        </div>
      </div>

      {/* Group Info */}
      <div className="p-5 space-y-2">
        <h4 className="leading-snug" style={{ color: "#1C3B5E" }}>
          {name}
        </h4>
        <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: "#333333", opacity: 0.7 }}>
          {description}
        </p>
        
        {/* Join Button */}
        <button
          className="w-full py-2.5 rounded-2xl text-sm transition-all hover:opacity-80 mt-3"
          style={{ backgroundColor: "#20B2AA", color: "white" }}
        >
          Join Group
        </button>
      </div>
    </Card>
  );
}
