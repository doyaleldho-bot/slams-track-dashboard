import React from 'react'
import {Info} from "lucide-react";
const Notice = () => {
  return (
    <div className='border  border-[#D9824B] rounded-xl px-4 py-4'>
        <div className="flex justify-content items-center text-[#A23E00]">
            <Info size={22} className="inline-block mr-2" />
           <p className="font-medium text-[20px]">Important Note</p>
        </div>
        <p className="text-[#A23E00] text-[14px] mt-2">
Teachers cannot mark their own attendance. Only Admin or authorized staff can manage teacher attendance.        </p>
    
    </div>
  )
}

export default Notice