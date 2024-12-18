import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useRouter } from 'next/router';
import api from '@/utils/api';
import { useEffect } from 'react';

const ContentPlugin = ({content} : {content: string}) => {
  const [editor] = useLexicalComposerContext();

  const state = editor.parseEditorState(content);
  editor.setEditorState(state);


  return null;
};

export default ContentPlugin;
