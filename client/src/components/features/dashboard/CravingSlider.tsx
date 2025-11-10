import { useState } from "react";

interface CravingSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function CravingSlider({ value, onChange, min = 1, max = 10 }: CravingSliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const getSliderColor = (val: number) => {
    if (val <= 3) return "#E0E0E0";
    if (val <= 5) return "#FFA726";
    if (val <= 7) return "#FF7043";
    return "#D9534F";
  };

  const percentage = ((value - min) / (max - min)) * 100;
  const color = getSliderColor(value);

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
