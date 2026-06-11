import { useState, useRef, useEffect } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

type DropdownOption = {
  label: string
  value: string
}

type DropdownProps = {
  options: DropdownOption[]
  value?: string
  onChange: (val: string) => void
  placeholder?: string
  label?: string
}

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="flex flex-col gap-1" ref={ref}>
      {label && <label className="text-sm text-gray-400">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-left
  text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
  transition-colors cursor-pointer flex items-center justify-between gap-3"
        >
          <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
            {selected ? selected.label : placeholder}
          </span>
          <span className="text-gray-500 flex-shrink-0">
            {isOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </span>
        </button>

        {isOpen && (
          <ul
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg
            shadow-lg overflow-hidden"
          >
            {options.map(opt => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className={`px-3 py-2 cursor-pointer transition-colors hover:bg-gray-50
  ${opt.value === value ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Dropdown
