import React, { useState } from "react";
import { Search } from "lucide-react";

interface StudentSearchBarProps {
  onSearch?: (query: string) => void;
}

const StudentSearchBar: React.FC<StudentSearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <div
      className="relative flex items-center bg-white rounded-[6px] border border-gray-300 shadow-sm flex-1"
      style={{
        height: "36px",
        borderWidth: "1.25px",
        paddingLeft: "40px",
        paddingRight: "12px",
        paddingTop: "4px",
        paddingBottom: "4px",
      }}
    >
      <Search className="absolute left-3 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search by name "
        value={searchQuery}
        onChange={handleChange}
        className="w-full h-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
      />
    </div>
  );
};

export default StudentSearchBar;
