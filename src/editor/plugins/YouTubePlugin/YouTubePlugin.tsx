import { COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { JSX, useEffect } from 'react';
import { $createYouTubeNode, YouTubeNode } from '@/editor/plugins/YouTubePlugin/YouTubeNode';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { useRouter } from 'next/router';
import api from '@/utils/api';


export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> = createCommand(
  'INSERT_YOUTUBE_COMMAND'
);

const YouTubePlugin = (): JSX.Element | null => {
  const [editor] = useLexicalComposerContext();


  useEffect(() => {
    if (!editor.hasNodes([YouTubeNode])) {
      throw new Error('YouTubePlugin: YouTubeNode not registered on editor');
    }

    return editor.registerCommand<string>(
      INSERT_YOUTUBE_COMMAND,
      (payload) => {
        const youTubeNode = $createYouTubeNode(payload);
        $insertNodeToNearestRoot(youTubeNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
};

export default YouTubePlugin;