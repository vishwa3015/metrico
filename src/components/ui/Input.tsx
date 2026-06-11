type InputProps = {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  type?: string
  label?: string
  error?: string
  disabled?: boolean
}

const Input = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  label,
  error,
  disabled,
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-600 font-medium">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`px-3 py-2 rounded-lg bg-white border text-gray-900 placeholder-gray-400
  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors
  ${error ? 'border-red-500' : 'border-gray-300'}
  ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
`}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
}

export default Input
