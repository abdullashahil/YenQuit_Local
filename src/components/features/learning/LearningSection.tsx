import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface LearningSectionProps {
  title: string;
  children: ReactNode;
}

export function LearningSection({ title, children }: LearningSectionProps) {
  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl" style={{ color: "#1C3B5E" }}>
          {title}
        </h2>
        <button 
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm transition-all hover:opacity-80"
          style={{ color: "#20B2AA", backgroundColor: "#20B2AA10" }}
        >
          View More
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal Scrolling Container */}
      <div className="overflow-x-auto pb-4 -mx-8 px-8">
        <div className="flex gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}
