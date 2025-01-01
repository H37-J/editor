import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useRouter } from 'next/router';
import api from '@/utils/api';
import { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/zustand/editorStore';
import { $getSelection, BaseSelection } from 'lexical';

const InitialStatePlugin = ({}: {}) => {
  const [editor] = useLexicalComposerContext();
  const router = useRouter();
  const slug = String(router.query.slug);
  const { data, isLoading } = api.post.findByUUId.useQuery(slug, {
    enabled: router.isReady,
  });



  useEffect(() => {
    if (data) {
      const state = editor.parseEditorState(data.content);
      editor.setEditorState(state);
    }
  }, [data]);

  return null;
};

export default InitialStatePlugin;
