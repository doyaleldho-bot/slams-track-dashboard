import React from "react"
import { BadgeInfo } from "lucide-react"

const UnderMain: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col  gap-4 rounded-lg border border-[#D9824B] bg-[#F8F8F8] p-10">
      <div className="flex  text-[16px] font-medium text-[#D9824B] gap-2">
        <BadgeInfo />

        <h2 className="text-[20px]  text-[#A23E00]"> Important Note </h2>
      </div>
      <p className="text-[20px] text-[#A23E00] pl-8">
        This Page is Under Construction.
      </p>
    </div>
  )
}

export default UnderMain
