import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface LearningSectionProps {
  title: string;
  children: ReactNode;
  onViewMore?: () => void;
}

export function LearningSection({ title, children, onViewMore }: LearningSectionProps) {
  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl" style={{ color: "#1C3B5E" }}>
          {title}
        </h2>
        {onViewMore && (
          <button
            onClick={onViewMore}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm transition-all hover:opacity-80"
            style={{ color: "#20B2AA", backgroundColor: "#20B2AA10" }}
          >
            View More
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Horizontal Scrolling Container */}
      <div
        className="overflow-x-auto pb-3 -mx-4 px-4 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.15)_transparent] hover:[scrollbar-color:rgba(0,0,0,0.25)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/15 hover:[&::-webkit-scrollbar-thumb]:bg-black/25 [&::-webkit-scrollbar-button]:hidden"
        style={{ msOverflowStyle: 'none' }}
      >
        <div className="flex gap-6 pb-1">
          {children}
        </div>
      </div>
    </div>
  );
}
