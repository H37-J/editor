import { $getSelection, LexicalEditor } from 'lexical';
import { useCallback } from 'react';
import { $patchStyleText } from '@lexical/selection';
import Dropdown, { DropDownItem } from '@/pages/components/dropdown/Dropdown';
import { FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS } from '@/editor/utils/constant';

const FontDropDown = ({
  editor,
  value,
  style,
  disabled = false,
}: {
  editor: LexicalEditor;
  value: string;
  style: string;
  disabled?: boolean;
}) : JSX.Element => {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style],
  );

  return (
    <Dropdown
      text={value}
      disabled={disabled}
      buttonClassName={'toolbar-item min-w-32 ' + style}
      buttonIconClassNamePrefix={
        style === 'font-family' ? 'icon format font-family' : ''
      }
      >
      {(style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(
        ([option, text]) => (
          <DropDownItem
            className={`item ${
              style === 'font-size' ? 'fontsize-item' : ''
            }`}
            onClick={() => handleClick(option)}
            key={option}>
            <span className="text">{text}</span>
          </DropDownItem>
        ),
      )}
    </Dropdown>
  );
}

export default FontDropDown;