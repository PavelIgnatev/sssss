import { SingleValue } from "react-select";

export interface BaseSelectModel {
  options: { value: string; label: string }[];
  onChange: (newValue: SingleValue<{ value: string, label: string }>) => void;
  className: string;
  placeholder: string;
  disabled?: boolean;
  defaultValue?: string;
}
