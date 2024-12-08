import * as React from 'react';
import DropDown from '@/pages/components/dropdown/Dropdown';
import ColorPicker from '@/editor/components/ColorPickerComponent';
import { StaticImageData } from 'next/image';

type Props = {
  disabled?: boolean;
  image?: StaticImageData;
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconClassName?: string;
  buttonIconClassNamePost?: string;
  buttonLabel?: string;
  title?: string;
  stopCloseOnClickSelf?: boolean;
  color: string;
  onChange?: (color: string, skipHistoryStack: boolean) => void;
};

const DropdownColorPicker = ({
  disabled = false,
  stopCloseOnClickSelf = true,
  color,
  buttonIconClassNamePost,
  onChange,
  ...rest
}: Props) => {
  return (
    <DropDown
      {...rest}
      color={color}
      disabled={disabled}
      stopCloseOnClickSelf={stopCloseOnClickSelf}
    >
      <ColorPicker color={color} onChange={onChange} />
    </DropDown>
  );
};

export default DropdownColorPicker;
