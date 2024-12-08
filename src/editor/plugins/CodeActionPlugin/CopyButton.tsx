import { $getNearestNodeFromDOMNode, $getSelection, $setSelection, LexicalEditor } from 'lexical';
import { useState } from 'react';
import { useDebounce } from '@/editor/utils/utils';
import { $isCodeNode } from '@lexical/code';
import { useFlashMessageContext } from '@/context/FleshMessageContext';

type Props = {
  editor: LexicalEditor
  getCodeDOMNode: () => HTMLElement | null;
}

const CopyButton = ({ editor, getCodeDOMNode }: Props) => {
  const [isCopyCompleted, setCopyCompleted] = useState<boolean>(false);
  const showFlashMessage = useFlashMessageContext();

  const removeSuccessIcon = useDebounce(() => {
    setCopyCompleted(false);
  }, 1000);

  const handleClick = async(): Promise<void> => {
    const codeDOMNode = getCodeDOMNode();

    if (!codeDOMNode) {
      return;
    }

    let content = '';

    editor.update(() => {
      const codeNode = $getNearestNodeFromDOMNode(codeDOMNode);

      if ($isCodeNode(codeNode)) {
        content = codeNode.getTextContent();
      }

      const selection = $getSelection();
      $setSelection(selection);
    });

    try {
      await navigator.clipboard.writeText(content);
      setCopyCompleted(true);
      showFlashMessage('클립코드에 복사 되었습니다.', 2000);
      removeSuccessIcon()
    } catch (err) {
      console.error('복사가 실패 되었습니다.', err);
    }
  }

  return (
    <button className="menu-item" onClick={handleClick} aria-label="복사">
      {isCopyCompleted ? (
        <i className="format success"/>
      ): (
        <i className="format copy"/>
      )}
    </button>
  )
};

export default CopyButton;