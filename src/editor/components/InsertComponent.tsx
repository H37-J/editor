import { RefClick } from '@/editor/utils/dom';
import React from 'react';
import Dropdown, { DropDownItem } from '@/pages/components/dropdown/Dropdown';
import { INSERT_EXCALIDRAW_COMMAND } from '@/editor/plugins/ExcalidrawPlugin/ExcalidrawPlugin';
import { $getRoot, LexicalEditor } from 'lexical';
import { INSERT_PAGE_BREAK } from '@/editor/plugins/PageBreakPlugin/PageBreakPlugin';
import { useModal } from '@/pages/components/modal/Modal';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import clsx from 'clsx';
import { formatCode } from '@/editor/plugins/CodePlugin/CodeComponent';
import { INSERT_CHECK_LIST_COMMAND } from '@lexical/list';
import { $createStickyNode } from '@/editor/plugins/StickyPlugin/StickyNode';

const InsertComponent = ({
  activeEditor,
  imageRef,
}: {
  activeEditor: LexicalEditor;
  imageRef: React.RefObject<HTMLInputElement>;
}) => {
  const [modal, showModal] = useModal();
  const formatCheckList = () => {
      activeEditor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
  };
  const sticky = () => {
    activeEditor.update(() => {
      const root = $getRoot();
      const stickyNode = $createStickyNode(0, 0);
      root.append(stickyNode);
    })
  }
  return (
    <>
      <Dropdown
        title="추가"
        buttonClassName="toolbar-item spaced space-x-1.5"
        text="추가"
        buttonIconClassNamePrefix="mt-0.5 format plus "
        buttonIconClassNamePost="format down"
      >
        <DropDownItem
          onClick={() => RefClick(imageRef)}
          className="text-sm"
          aria-label="plus"
        >
          <i className="mt-0 format image" />
          <span className="pt-0.5">이미지 업로드</span>
        </DropDownItem>
        <DropDownItem
          onClick={() => {
            activeEditor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined);
          }}
          className="text-sm"
        >
          <i className="icon format diagram" />
          <span className="text">스케치</span>
        </DropDownItem>
        <DropDownItem
          onClick={() => {
            activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, {
              columns: '5',
              rows: '5',
            });
          }}
          className="item"
        >
          <i className="icon format table" />
          <span className="text">테이블</span>
        </DropDownItem>
        <DropDownItem
          className="text-sm"
          onClick={() => formatCode(activeEditor)}
        >
          <i className="icon format code" />
          <span>코드 블록</span>
        </DropDownItem>
        <DropDownItem className="text-sm" onClick={sticky}>
          <i className="icon format sticky" />
          <span className="text">메모장</span>
        </DropDownItem>
        <DropDownItem
          className="toolbar-item spaced space-x-1 text-sm"
          onClick={() => formatCheckList()}
        >
          <i className="icon format check-list" />
          <span>체크 리스트</span>
        </DropDownItem>
        <DropDownItem
          onClick={() => {
            activeEditor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
          }}
          className="text-sm"
        >
          <i className="icon format scissors" />
          <span className="text">페이지 구분선</span>
        </DropDownItem>
      </Dropdown>
      {modal}
    </>
  );
};

export default InsertComponent;
