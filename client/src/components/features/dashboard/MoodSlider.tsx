import { useState } from "react";

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function MoodSlider({ value, onChange, min = 1, max = 10 }: MoodSliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  // Mood color scheme: 1/10 scale (1=bad, 10=good)
  const getMoodColor = (val: number) => {
    if (val <= 2) return "#D9534F";    // 1-2: Bad (Red)
    if (val <= 4) return "#FFA726";    // 3-4: Low (Orange)  
    if (val <= 6) return "#FFC107";    // 5-6: Neutral (Yellow)
    if (val <= 8) return "#20B2AA";    // 7-8: Good (Teal)
    return "#8BC34A";                    // 9-10: Great (Green)
  };

  const percentage = ((value - min) / (max - min)) * 100;
  const color = getMoodColor(value);

  return (
    <div className="relative w-full py-2">
      {/* Track */}
      <div className="relative h-4 rounded-full bg-gray-200">
        {/* Filled portion */}
        <div
          className="absolute h-full rounded-full transition-all duration-200"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
        
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-200"
          style={{
            left: `${percentage}%`,
          }}
        >
          <div
            className={`w-6 h-6 rounded-full border-4 bg-white shadow-lg transition-transform ${
              isDragging ? "scale-125" : "scale-100"
            }`}
            style={{
              borderColor: color,
            }}
          />
        </div>
      </div>

      {/* Input range (invisible but handles interaction) */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
      />

      {/* Value indicators */}
      <div className="flex justify-between mt-3 px-1">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`text-xs transition-all ${
              num === value ? "scale-125" : "opacity-40"
            }`}
            style={{
              color: num === value ? color : "#666",
            }}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
