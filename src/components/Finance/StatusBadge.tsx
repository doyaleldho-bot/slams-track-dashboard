import React from "react";

interface StatusBadgeProps {
  label: string;
  variant?: "active" | "inactive" | "paid" | "pending" | "failed";
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = "inactive",
  className = "",
}) => {
  const base =
    "inline-flex items-center justify-center rounded-[10px] h-9 min-w-[96px] px-3 text-sm font-semibold border bg-white text-center truncate";
  const variants: Record<string, string> = {
    active: "border-emerald-500 text-emerald-600",
    inactive: "border-orange-500 text-orange-600",
    paid: "border-emerald-500 text-emerald-600",
    pending: "border-amber-500 text-amber-600",
    partial: "border-amber-500 text-amber-600",
    failed: "border-red-500 text-red-600",
  };

  return (
    <span
      className={`${base} ${variants[variant] || variants.inactive} ${className}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
