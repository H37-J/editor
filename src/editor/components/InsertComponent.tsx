import { RefClick } from '@/editor/utils/dom';
import React from 'react';
import Dropdown, { DropDownItem } from '@/pages/components/dropdown/Dropdown';

const InsertComponent = ({
  imageRef,
}: {
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
        <i className="mt-0 format note" />
        <span className="pt-0.5">이미지 업로드</span>
      </DropDownItem>
    </Dropdown>
  );
};

export default InsertComponent;
