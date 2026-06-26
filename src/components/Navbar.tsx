// import NotificationPanel from "../components/NotificationPanel";
// import { useState } from "react";
import { Building } from "lucide-react"
import { Link } from "react-router-dom"

import { useAppSelector } from "../redux/hooks"

import { getInitials } from "../utils/getInitialsLetters"
import { BASE_URL } from "./settings/Profile"

const Navbar = () => {
  const { profile, loading } = useAppSelector((s) => s.profile)

  return (
    <header className= "h-[90px] w-full bg-[#FCFCFC] border-b border-gray-200 pl-4 md:pl-14 sm:pl-14 flex items-center justify-between pr-6" >
    {/* LEFT */ }
    < div className = "flex items-center gap-[10px] min-w-fit" >
      <Building size={ 24 } className = "text-[#474747]" />

        <div className="leading-tight hidden sm:block " >
          <p className="text-[#2F2F2F] text-[20px] font-medium leading-[16px] tracking-[0.08em]" >
            Jyothi Public School Kottayam
              </p>
              </div>
              </div>

  {/* RIGHT */ }
  <div className="relative" >
    <div className="flex items-center gap-6 lg:gap-[60px] min-w-fit pr-4 md:pr-6" >
      {/* NOTIFICATION */ }
  {/* <div className="relative cursor-pointer"
      onClick={() => setIsOpen(true)}
    >
      <FiBell size={25} className="text-[#000000]" />
      <span className="absolute -top-0 -right-0 w-2 h-2 bg-[#6CEA0C] text-white text-[10px] rounded-full flex items-center justify-center">
      </span>
    </div> */}

  {/* PROFILE */ }
  <Link
            to="/settings"
  className = " group relative flex items-center gap-[10px] cursor-pointer overflow-hidden rounded-xl border border-gray-300 px-2 py-1 transition-all duration-300 hover:border-transparent"
    >
    <div className=" absolute inset-0 -z-0 bg-gradient-to-r from-[#2B7FFF] via-[#9810FA] to-[#2B7FFF] bg-[length:200%_200%] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-gradient " />

    {
      profile?.profile_photo?(
              <img
                src = {`${BASE_URL}${profile?.profile_photo?.replace(/^\/+/, "")}`}
  className = "relative z-10 h-10 w-10 rounded-full object-cover"
  alt = "Profile"
    />
            ) : (
  <div className= " relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#2B7FFF] to-[#9810FA] font-semibold text-white transition-all duration-300 group-hover:scale-95 group-hover:bg-transp" >
  { getInitials(profile?.fullname) }
  </div>
            )}

<div className="relative z-10 hidden leading-tight sm:block" >
  <p className=" text-[14px] font-medium text-black transition-colors duration-300 group-hover:text-white" >
    { profile?.fullname || "User"}
</p>

  < p className = " text-xs text-gray-500 transition-colors duration-300 group-hover:text-white/80" >
    { profile?.role || ""}
</p>
  </div>
  </Link>

{/* <NotificationPanel
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    /> */}
</div>

{/*  {open && (
          <div className="absolute right-0 top-14 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        )
}
        */}
</div>
  </header>
  )
}

export default Navbar
