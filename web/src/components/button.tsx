import React from "react";
import { Trash2, Copy, Download, Loader2 } from "lucide-react";

type IconType = "trash" | "copy" | "download" | "spinner";

interface ButtonProps {
  icon: IconType;
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
  id?: string; // optional identifier if needed
}

export const Button: React.FC<ButtonProps> = ({
  icon,
  label,
  disabled = false,
  onClick,
}) => {
  const Icon = {
    trash: Trash2,
    copy: Copy,
    download: Download,
    spinner: Loader2,
  }[icon];

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        flex items-center ${label ? "gap-2" : ""} px-4 py-2 rounded-md border
        transition-all duration-200
        ${
          disabled
            ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-gray-200 text-gray-500  hover:bg-gray-200 hover:border-blue-base hover:text-gray-600 active:scale-95"
        }
      `}
    >
      <Icon className={`w-4 h-4 ${icon === "spinner" ? "animate-spin" : ""}`} />
      {label && <span>{label}</span>}
    </button>
  );
};
