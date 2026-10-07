import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type Option = string | { value: string; label: string }

function toOption(option: Option) {
  return typeof option === "string" ? { value: option, label: option } : option
}

/** Full-width Select for a flat list of options. */
export function OptionSelect({
  id,
  value,
  onChange,
  placeholder,
  options,
  invalid,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  options: ReadonlyArray<Option>
  invalid?: boolean
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="w-full" aria-invalid={invalid}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map(toOption).map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
