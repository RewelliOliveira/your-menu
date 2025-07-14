import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  value: string;
  label: string;
};

type SelectDayProps = {
  label?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
};

export function SelectDay({ label, options, value, onChange }: SelectDayProps) {
  return (
    <div className="flex flex-col w-full gap-2 mb-4">
      {label && (
        <label className="text-sm font-semibold text-black">{label}</label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all">
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
  );
}
