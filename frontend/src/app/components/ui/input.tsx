import { InputHTMLAttributes } from "react"

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
    return (
      <input
        {...props}
        className="border rounded px-3 py-2 w-full text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    )
  }
  