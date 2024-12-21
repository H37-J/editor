import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import { useFlashMessageContext } from '@/context/FleshMessageContext';
import { docFromHash, shareDoc } from '@/editor/utils/doc';
import { editorStateFromSerializedDocument, serializedDocumentFromEditorState } from '@lexical/file';
import { $createTextNode, $getRoot, CLEAR_HISTORY_COMMAND } from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString
} from '@lexical/markdown';
import { MARKDOWN_TRANSFORMERS } from '@/editor/plugins/MakdownPlugin/MarkdownTransformers';
import { $createStickyNode } from '@/editor/plugins/StickyPlugin/StickyNode';
const ActionPlugin = ({
}: {
}): JSX.Element => {
  const [editor] = useLexicalComposerContext();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const showFlashMessage = useFlashMessageContext();

  useEffect(() => {
    docFromHash(window.location.hash).then((doc) => {
      if (doc) {
        editor.setEditorState(editorStateFromSerializedDocument(editor, doc));
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
      }
    });
  }, [editor]);
  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      })
    );
  }, [editor]);

  const handleMarkdownToggle = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();
      if ($isCodeNode(firstChild) && firstChild.getLanguage() === 'markdown') {
        $convertFromMarkdownString(
          firstChild.getTextContent(),
          MARKDOWN_TRANSFORMERS,
          undefined,
        );
      } else {
        const markdown = $convertToMarkdownString(
          MARKDOWN_TRANSFORMERS,
          undefined,
        );
        const codeNode = $createCodeNode('markdown');
        codeNode.append($createTextNode(markdown));
        root.clear().append(codeNode);
        if (markdown.length === 0) {
          codeNode.select();
        }
      }
    });
  }, [editor]);

  return (
    <div className="fixed bottom-12 right-0 md:bottom-0 md:right-0 m-4 space-x-3">
        <button
          title="공유"
          className="bg-zinc-900 p-3 rounded-xl"
          onClick={() => {
            shareDoc(serializedDocumentFromEditorState(editor.getEditorState())).then(
              () => showFlashMessage('주소가 복사 되었습니다')
            )
          }}>
          <i className="icon format lg share"/>
        </button>
      <button
        title="마크다운"
        className="bg-zinc-900 p-3 rounded-xl"
        onClick={handleMarkdownToggle}>
        <i className="icon format lg markdown"/>
      </button>
    </div>
  )
};

export default ActionPlugin;
