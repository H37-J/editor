import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import {registerCodeHighlighting} from '@lexical/code';

const CodeHighlightPlugin = (): JSX.Element | null => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // @ts-ignore
    return registerCodeHighlighting(editor);
  }, [editor]);

  return null;
}

export default CodeHighlightPlugin;