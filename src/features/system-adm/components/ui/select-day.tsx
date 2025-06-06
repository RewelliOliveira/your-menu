import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
type Option = {
  value: string
  label: string
}

type SelectDayProps = {
  label?: string
  options: Option[]
  onChange?: (value: string) => void
}

export function SelectDay({ label, options, onChange }: SelectDayProps) {
  return (
    <div>
      {label && <label>{label}</label>}
      <Select onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma opção" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}