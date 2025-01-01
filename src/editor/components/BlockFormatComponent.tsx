import { JSX } from 'react';
import { blockTypeToBlockName } from '@/editor/utils/constant';
import { $createParagraphNode, $getSelection, $isRangeSelection, LexicalEditor } from 'lexical';
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text';
// @ts-ignore
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
// @ts-ignore
import { $setBlocksType } from '@lexical/selection';
import clsx from 'clsx';
import DropDown, { DropDownItem } from '@/pages/components/dropdown/DropDown';

const BlockFormatComponent = ({
  editor,
  blockType,
  disabled = false,
}: {
  editor: LexicalEditor;
  blockType: keyof typeof blockTypeToBlockName;
  disabled?: boolean;
}): JSX.Element => {

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  }

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  }

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  }

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  }

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
  }

  return (
    <DropDown
      disabled={disabled}
      buttonClassName="toolbar-item block-controls flex items-center"
      buttonIconClassNamePrefix={"icon format " + blockType}
      buttonIconClassNamePost="format down"
      text={blockTypeToBlockName[blockType]}>
      <DropDownItem
        className={clsx("toolbar-item spaced space-x-1 text-sm", blockType === 'paragraph'? 'bg-[#161616]' : '')}
        onClick={formatParagraph} aria-label="Format text as bold">
        <i className="icon format paragraph" />
        <span>일반 텍스트</span>
      </DropDownItem>
      <DropDownItem
        className={clsx("toolbar-item spaced space-x-1 text-sm", blockType === 'h1'? 'bg-[#161616]' : '')}
        onClick={() => formatHeading('h1')}>
        <i className="icon format h1" />
        <span>큰 헤더</span>
      </DropDownItem>
      <DropDownItem
        className={clsx("toolbar-item spaced space-x-1 text-sm", blockType === 'h2'? 'bg-[#161616]' : '')}
        onClick={() => formatHeading('h2')}>
        <i className="icon format h2" />
        <span>중간 헤더</span>
      </DropDownItem>
      <DropDownItem
        className={clsx("toolbar-item spaced space-x-1 text-sm", blockType === 'h3'? 'bg-[#161616]' : '')}
        onClick={() => formatHeading('h3')}>
        <i className="icon format h3" />
        <span>작은 헤더</span>
      </DropDownItem>
      <DropDownItem
        className={clsx("toolbar-item spaced space-x-1 text-sm", blockType === 'bullet'? 'bg-[#161616]' : '')}
        onClick={() => formatBulletList()}>
        <i className="icon format bullet-list" />
        <span>글머리 목록</span>
      </DropDownItem>
      <DropDownItem
        className={clsx("toolbar-item spaced space-x-1 text-sm", blockType === 'number'? 'bg-[#161616]' : '')}
        onClick={() => formatNumberedList()}>
        <i className="icon format numbered-list" />
        <span>번호 목록</span>
      </DropDownItem>
      <DropDownItem
        className={clsx("toolbar-item spaced space-x-1 text-sm", blockType === 'quote'? 'bg-[#161616]' : '')}
        onClick={() => formatQuote()}>
        <i className="icon format quote" />
        <span>인용</span>
      </DropDownItem>
    </DropDown>
  )
}

export default BlockFormatComponent;