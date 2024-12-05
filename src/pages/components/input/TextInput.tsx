import { HTMLInputTypeAttribute } from 'react';

type Props = Readonly<{
  label: string;
  onChange: (val: string) => void;
  placeholder?: string;
  value: string;
  type?: HTMLInputTypeAttribute;
}>;

const TextInput = ({
  label,
  onChange,
  placeholder,
  value,
  type,
} : Props): JSX.Element => {
  return (
    <>
      <label>{label}</label>
      <input
        type={type}
        className=""
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </>
  );
}

export default TextInput;