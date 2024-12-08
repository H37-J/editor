import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical';
import { JSX, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createPageBreakNode, PageBreakNode } from '@/editor/plugins/PageBreakPlugin/PageBreakNode';
import { $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils';

export const INSERT_PAGE_BREAK: LexicalCommand<undefined> = createCommand();

const PageBreakPlugin = (): JSX.Element | null => {
  const [editor] = useLexicalComposerContext();


  useEffect(() => {
    if (!editor.hasNodes([PageBreakNode])) {
      throw new Error(
        'PageBreakPlugin: PageBreakNode is not registered on editor',
      );
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_PAGE_BREAK,
        () => {
          const selection = $getSelection();

          if (!$isRangeSelection(selection)) {
            return false;
          }

          const focusNode = selection.focus.getNode();
          if (focusNode !== null) {
            const pgBreak = $createPageBreakNode();
            $insertNodeToNearestRoot(pgBreak);
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  return null;
}

export default PageBreakPlugin;