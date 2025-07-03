import { Input } from "@/components/ui/input"
import type { InputProps } from "@/components/ui/input"

const InputPulseBorder = (props: InputProps) => {
  return (
    <div className="relative">
      <div className="absolute top-0 flex w-full justify-center">
        <div className="h-[1px] animate-border-width rounded-full bg-gradient-to-r from-[rgba(17,17,17,0)] via-primary to-[rgba(17,17,17,0)] transition-all duration-1000" />
      </div>
      <Input
        className="block h-12 w-full rounded-md border border-gray-800 bg-background px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background"
        {...props}
      />
    </div>
  )
}

export default InputPulseBorder
