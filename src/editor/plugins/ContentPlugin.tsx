import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useRouter } from 'next/router';
import api from '@/utils/api';
import { useEffect } from 'react';

const ContentPlugin = ({content} : {content: string}) => {
  const [editor] = useLexicalComposerContext();
  let check= true;
  const state = editor.parseEditorState(content);
  state._nodeMap.forEach((node, key) => {
    if (node.__type === 'sticky') {
      check = false;
    }
  })

  if (check) {
    editor.setEditorState(state);
  }


  return null;
};

export default ContentPlugin;
