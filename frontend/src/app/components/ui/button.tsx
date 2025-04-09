import { ButtonHTMLAttributes, ReactNode } from "react"

export function Button({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
    return (
      <button
        {...props}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {children}
      </button>
    )
  }
  
