import React from "react";

interface FinanceNoteCardProps {
  title: string;
  description: string;
}

const FinanceNoteCard: React.FC<FinanceNoteCardProps> = ({
  title,
  description,
}) => {
  return (
    <div className="mt-8 rounded-[10px] border border-orange-200 bg-orange-50 p-6 text-orange-900">
      <div className="flex items-center gap-3 text-lg font-semibold">
        {title}
      </div>
      <p className="mt-3 text-sm leading-6">{description}</p>
    </div>
  );
};

export default FinanceNoteCard;
