import {
  LayoutDashboard,
  UserCog,
  GraduationCap,
  Users,
  FileSpreadsheet,
  Landmark,

  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useState, useRef } from "react";
import logo from "../assets/logo.png"

type MenuItem = {
  label: string;
  path: string;
  icon: React.ElementType;
};
const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Staff Management", icon: UserCog, path: "/StaffManagement" },
  { label: "Academic Management", icon: GraduationCap, path: "/AcademicManagement" },
  { label: "Student Management", icon: Users, path: "/StudentManagement" },
  { label: "Attendance", icon: FileSpreadsheet, path: "/Attendance" },
  { label: "Finance", icon: Landmark, path: "/finance" },

  { label: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHovered(null);
    }, 100);
  };

  return (
    <>
      {/* MOBILE TOGGLE */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
        className="lg:hidden fixed top-7 left-4 z-50 bg-[#083b9a] text-white p-2 rounded-md"
      >
        <FiMenu size={20} />
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          w-[260px] h-screen
          bg-[#083b9a] text-white
          flex flex-col justify-between
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-1 border-b border-white/10">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="logo"
                className="w-16 h-16 object-contain"
              />

              <div>
                <p className="text-[20px] font-semibold leading-tight">
                  Dashboard
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
              className="lg:hidden text-white"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* MENU */}
          <nav className="mt-10 flex flex-col gap-5 pl-[15px] flex-1 overflow-y-auto pr-3 no-scrollbar">
            {menuItems.map(({ label, icon: Icon, path }) => (<NavLink key={label} to={path} onClick={() => setOpen(false)}>
              {({ isActive }) => (
                <div
                  onMouseEnter={() => handleMouseEnter(label)}
                  onMouseLeave={handleMouseLeave}
                  className={`
                        flex items-center gap-3 px-3 py-4
                        rounded-md text-[14px]
                        w-full
                        transition-all duration-200
                        ${isActive || hovered === label
                      ? "w-full bg-white text-[#083b9a] font-medium"
                      : "text-white/90 hover:bg-white/30"
                    }
                      `}
                >
                  <Icon
                    size={20}
                    className={`transition-all duration-200 ${isActive || hovered === label
                      ? "text-[#083b9a]"
                      : "text-white"
                      }`}
                  />
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
                </div>
              )}
            </NavLink>
            ))}
          </nav>
        </div>

        {/* HELP CARD */}
        <div className="p-4">
          
          <div className="bg-[#0a4cc4] rounded-lg p-4">
            <p className="text-sm font-medium">Need Help?</p>
            <p className="text-xs text-white/80 mt-1">
              Contact Support Team
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
