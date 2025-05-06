// ? Write Every types 
export type tUserID = string | unknown;
export type tToken = string | unknown;

export type OnValueFunction<T> = (
  value: T,
  selected: React.ChangeEvent<HTMLSelectElement>
) => void;
