import { ErrorMessage } from "formik";
import React, { useEffect, useState } from "react";

type CustomSelectProps<T> = React.ComponentPropsWithoutRef<"select"> & {
  label?: string;
  labelVisible?: boolean;
  name: string;
  value?: string;
  option: OptionData<T>[];
  isCompulsory?: boolean;
  selectBoxWidth?: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement> | undefined;
};

export type OptionData<T> = {
  id: number | string;
  name: string;
  data: T;
};

export default function CustomSelect<T>({
  label,
  labelVisible,
  isCompulsory,
  selectBoxWidth,
  ...props
}: CustomSelectProps<T>) {
  const [selectedValue, setSelectedValue] = useState<string | null>(
    props.value ?? "0"
  );
  useEffect(() => {
    if (props.value) setSelectedValue(props.value);
  }, [props.value]);

  return (
    <div style={{ width : selectBoxWidth}}>
      {label &&  labelVisible && <label htmlFor={props.name}>
        {label} <span className="text-danger">{isCompulsory ? "*" : ""}</span>
      </label>}
      <select
        onChange={(selected) => {
          setSelectedValue(selected.target.value);
          props.onChange && props.onChange(selected);
        }}
        name={props.name}
        value={selectedValue ?? "0"}
      >
        <option value={"0"} key={"0"}>
          --{label}--
        </option>
        {props.option.map((option) => (
          <option value={option.id} key={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <ErrorMessage name={props.name} component="div" className="error" />
    </div>
  );
}

export function convertData<T>(
  selected: React.ChangeEvent<HTMLSelectElement>,
  data: OptionData<T>[]
): T | undefined {
  const id = selected.target.value ?? "";
  const selectedOption = data.find((option) => option.id == id);
console.log("selected value",selectedOption)
  if (selectedOption) {
    return selectedOption.data!;
  } else {
  }
}
