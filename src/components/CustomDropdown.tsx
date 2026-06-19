import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

export type DropdownOption =
  | string
  | {
      id: string | number
      name: string
      classSection?: string
      classBatch?: string
    }

interface CustomDropdownProps {
  value: string
  placeholder: string
  options: DropdownOption[]
  onChange: (value: DropdownOption) => void
  searchable?: boolean
  disabled?: boolean
}

const CustomDropdown = ({
  value,
  placeholder,
  options,
  onChange,
  searchable = false,
  disabled = false,
}: CustomDropdownProps) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const getLabel = (option: DropdownOption) => {
    if (typeof option === "string") return option

    if (!option || typeof option !== "object" || !("name" in option)) return ""

    let label = option.name

    if (option.classSection) {
      label += `-${option.classSection}`
    }

    if (option.classBatch) {
      label += ` (${option.classBatch})`
    }

    return label
  }

  const getValue = (option: DropdownOption) => {
    if (typeof option === "string") return option
    if (!option || typeof option !== "object" || !("id" in option)) return ""
    return option.id
  }

  const filteredOptions =
    search.trim().length > 0
      ? options.filter((option) =>
          getLabel(option).toLowerCase().includes(search.toLowerCase()),
        )
      : options

  const displayValue = (() => {
    const selectedOption = options.find((option) => {
      if (typeof option === "string") {
        return option === value
      }

      return option && typeof option === "object" && "id" in option && option.id.toString() === value
    })

    if (!selectedOption) return ""

    if (typeof selectedOption === "string") {
      return selectedOption
    }

    let label = selectedOption.name

    if (selectedOption.classSection) {
      label += `-${selectedOption.classSection}`
    }

    if (selectedOption.classBatch) {
      label += ` (${selectedOption.classBatch})`
    }

    return label
  })()

  return (
    <div ref={dropdownRef} className="relative">
      {/* Input */}
      <input
        type="text"
        value={open ? search : displayValue}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => {
          setOpen(true)
          setSearch("")
        }}
        onChange={(e) => {
          if (searchable) {
            setSearch(e.target.value)
            setOpen(true)
          }
        }}
        readOnly={!searchable}
        className={`h-12 md:h-14 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 pr-10 outline-none ${
          disabled ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
        }`}
      />

      {/* Arrow */}
      <ChevronDown
        size={18}
        onClick={() => {
          if (!disabled) {
            setOpen((prev) => !prev)
            setSearch("")
          }
        }}
        className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform ${
          disabled ? "cursor-not-allowed text-gray-400" : "cursor-pointer"
        } ${open ? "rotate-180" : ""}`}
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-[#E5E5E5] bg-white shadow-lg">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={String(getValue(option))}
                type="button"
                onClick={() => {
                  onChange(option)
                  setSearch(getLabel(option))
                  setOpen(false)
                }}
                className="w-full px-4 py-3 text-left text-sm transition hover:bg-[#F5F5F5]"
              >
                {getLabel(option)}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CustomDropdown
