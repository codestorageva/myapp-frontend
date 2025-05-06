// components/TextField.tsx
import React from "react";
import CustomLabel from "./label";

interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  name: string;
  isCompulsory?: boolean;
  readOnly?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false, 
  className = "",
  isCompulsory=false,
  name,
  readOnly=false
}) => {
  return (
    <div className="w-full">
      {label && (
        <CustomLabel title={label} isCompulsory={isCompulsory}/>
      )}
      <input
        name={name}
        readOnly={readOnly}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`block w-full rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 ${className} mt-1 font-inter`}
      />
    </div>
  );
};

export default TextField;
