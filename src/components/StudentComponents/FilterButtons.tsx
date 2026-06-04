import React, { useState } from "react";

interface FilterButtonsProps {
  onFilterChange?: (filter: "All" | "Present" | "Absent") => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState<"All" | "Present" | "Absent">(
    "All"
  );

  const filters: Array<"All" | "Present" | "Absent"> = ["All", "Present", "Absent"];

  const handleFilterClick = (filter: "All" | "Present" | "Absent") => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  return (
    <div className="flex gap-3">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleFilterClick(filter)}
          className={`rounded-md font-medium text-sm transition-colors duration-200 flex items-center justify-center px-6`}
          style={{
            height: "36px",
            backgroundColor: activeFilter === filter ? "#1F2937" : "#F3F4F6",
            color: activeFilter === filter ? "#FFFFFF" : "#374151",
            border: activeFilter === filter ? "none" : "1px solid #E5E7EB",
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
