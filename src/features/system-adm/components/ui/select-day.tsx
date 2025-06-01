import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
type InputProps = React.ComponentProps<"input"> & {
  label?: string
}

export function SelectDay({label}: InputProps) {
  return (
    <Select>
      <label>{label}</label>
      <SelectTrigger>
        <SelectValue placeholder="Selecione o dia" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Dias</SelectLabel>
          <SelectItem value="Segunda">Segunda-feira</SelectItem>
          <SelectItem value="Terça">Terça-feira</SelectItem>
          <SelectItem value="Quarta">Quarta-feira</SelectItem>
          <SelectItem value="Quinta">Quinta-feira</SelectItem>
          <SelectItem value="Sexta">Sexta-feira</SelectItem>
          <SelectItem value="Sabado">Sabado</SelectItem>
          <SelectItem value="Domingo">Domingo</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
