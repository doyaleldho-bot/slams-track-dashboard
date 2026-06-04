import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

interface CustomDropdownProps {
  value: string
  placeholder: string
  options: string[]
  onChange: (value: string) => void
}

const CustomDropdown = ({
  value,
  placeholder,
  options,
  onChange,
}: CustomDropdownProps) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-12 md:h-14 w-full items-center justify-between rounded-xl border border-[#E5E5E5] bg-white px-4 text-left"
      >
        <span className={value ? "text-black" : "text-[#9CA3AF]"}>
          {value || placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-[#E5E5E5] bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
              className="w-full px-4 py-3 text-left text-sm transition hover:bg-[#F5F5F5]"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomDropdown
