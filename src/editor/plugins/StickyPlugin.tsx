import { JSX, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { StickyNode } from '@/editor/nodes/StickyNode';

const StickyPlugin = (): JSX.Element | null => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([StickyNode])) {
      throw new Error('StickyPlugin: StickyNode not registered on editor');
    }
  }, [editor]);
  return null;
}

export default StickyPlugin;