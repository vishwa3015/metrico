import * as React from "react"
import { cn } from "./utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 transition-[color,box-shadow] outline-none",
        "placeholder:text-slate-400",
        "focus-visible:border-teal-400 focus-visible:ring-2 focus-visible:ring-teal-200",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-400 aria-invalid:ring-2 aria-invalid:ring-red-100",
        className,
      )}
      {...props}
    />
  )
}

export { Input }