import { RefClick } from '@/editor/utils/dom';
import React from 'react';
import Dropdown, { DropDownItem } from '@/pages/components/dropdown/Dropdown';
import { INSERT_EXCALIDRAW_COMMAND } from '@/editor/plugins/ExcalidrawPlugin/ExcalidrawPlugin';
import { LexicalEditor } from 'lexical';
import { INSERT_PAGE_BREAK } from '@/editor/plugins/PageBreakPlugin/PageBreakPlugin';

const InsertComponent = ({
  activeEditor,
  imageRef,
}: {
  activeEditor: LexicalEditor;
  imageRef: React.RefObject<HTMLInputElement>;
}) => {
  return (
    <Dropdown
      buttonClassName="toolbar-item spaced space-x-1.5"
      text="추가"
      buttonIconClassNamePrefix="mt-0.5 format plus "
      buttonIconClassNamePost="format down"
    >
      <DropDownItem
        onClick={() => RefClick(imageRef)}
        className="toolbar-item spaced "
        aria-label="plus"
      >
        <i className="mt-0 format image" />
        <span className="pt-0.5">이미지 업로드</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          activeEditor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
        }}
        className="item"
      >
        <i className="icon format scissors" />
        <span className="text">페이지 구분선</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          activeEditor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined);
        }}
        className="item"
      >
        <i className="icon format diagram" />
        <span className="text">스케치</span>
      </DropDownItem>
    </Dropdown>
  );
};

export default InsertComponent;
