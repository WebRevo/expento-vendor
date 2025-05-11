
import React from "react";
import { cn } from "@/lib/utils";

const colorOptions = [
  { name: "White", value: "#FFFFFF" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#FF0000" },
  { name: "Green", value: "#008000" },
  { name: "Blue", value: "#0000FF" },
  { name: "Yellow", value: "#FFFF00" },
  { name: "Purple", value: "#800080" },
  { name: "Pink", value: "#FFC0CB" },
  { name: "Orange", value: "#FFA500" },
  { name: "Brown", value: "#A52A2A" },
  { name: "Gray", value: "#808080" },
  { name: "Navy", value: "#000080" },
  { name: "Teal", value: "#008080" },
  { name: "Olive", value: "#808000" },
  { name: "Maroon", value: "#800000" },
  { name: "Beige", value: "#F5F5DC" },
];

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
  className?: string;
}

const ColorPicker = ({ selectedColor, onChange, className }: ColorPickerProps) => {
  return (
    <div className={cn("grid grid-cols-4 gap-2", className)}>
      {colorOptions.map((color) => (
        <button
          key={color.value}
          type="button"
          title={color.name}
          className={cn(
            "h-8 w-8 rounded-full border transition-all",
            selectedColor === color.value ? "ring-2 ring-primary ring-offset-2" : "hover:scale-110"
          )}
          style={{ backgroundColor: color.value }}
          onClick={() => onChange(color.value)}
        />
      ))}
    </div>
  );
};

export { ColorPicker, colorOptions };
