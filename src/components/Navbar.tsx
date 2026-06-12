import { ChevronDown } from "lucide-react"
// import NotificationPanel from "../components/NotificationPanel";
// import { useState } from "react";
import { FiBell } from "react-icons/fi"
import { Building } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import api from "../api/axios"
import { toast } from "react-toastify"

const Navbar = () => {
  // const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");

      await api.post("/logout/", {
        refresh: refreshToken,
      });
      localStorage.clear();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);

      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="h-[90px] w-full bg-[#FCFCFC] border-b border-gray-200 pl-4 md:pl-14 sm:pl-14 flex items-center justify-between pr-6">
      {/* LEFT */}
      <div className="flex items-center gap-[10px] min-w-fit">
        <Building size={24} className="text-[#474747]" />

        <div className="leading-tight hidden sm:block ">
          <p className="text-[#2F2F2F] text-[20px] font-medium leading-[16px] tracking-[0.08em]">
            Jyothi Public School Kottayam
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative">
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-6 lg:gap-[60px] min-w-fit pr-4 md:pr-6"
        >
          {/* NOTIFICATION */}
          {/* <div className="relative cursor-pointer"
      onClick={() => setIsOpen(true)}
    >
      <FiBell size={25} className="text-[#000000]" />
      <span className="absolute -top-0 -right-0 w-2 h-2 bg-[#6CEA0C] text-white text-[10px] rounded-full flex items-center justify-center">
      </span>
    </div> */}

          {/* PROFILE */}
          <Link
            to="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-[10px] cursor-pointer border border-gray-300 rounded-xl px-2 py-1 hover:bg-gray-50 transition-colors"
          >
            <img
              src="https://i.pravatar.cc/40?img=3"
              className="rounded-[50px] object-cover w-10 h-10"
              alt="User"
            />

            <div className="leading-tight hidden sm:block">
              <p className="font-medium text-[14px] text-[#000000]">
                Admin User
              </p>
            </div>

            <ChevronDown
              size={20}
              className={`hidden sm:block transition-transform ${open ? "rotate-180" : ""
                }`}
            />
          </Link>

          {/* <NotificationPanel
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    /> */}
        </div>

        {open && (
          <div className="absolute right-0 top-14 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>


    </header>
  )
}

export default Navbar
