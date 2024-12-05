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
    <div className="Input__wrapper">
      <label className="Input__label">{label}</label>
      <input
        type={type}
        className="Input__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
}

export default TextInput;