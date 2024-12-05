import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useRef, useState } from 'react';

import EditorTheme from '@/editor/theme/EditorTheme';
import OnChangePlugin from '@/editor/plugins/OnChangePlugin';
import ToolbarPlugin from '@/editor/plugins/ToolbarPlugin';
import ImagePlugin from '@/editor/plugins/ImagePlugin/ImagePlugin';
import YouTubePlugin from '@/editor/plugins/YouTubePlugin';
import EditorNode from '@/editor/nodes/EditorNodes';
import CodeHilightPlugin from '@/editor/plugins/CodePlugin/CodeHilightPlugin';
import CodeActionMenuPlugin from '@/editor/plugins/CodeActionPlugin/CodeActionMenuPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { MarkdownPlugin } from '@/editor/plugins/MakdownPlugin/MarkDownPlugin';
import AutoEmbedPlugin from '@/editor/plugins/AutoEmbedPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { blockTypeToBlockName } from '@/editor/utils/constant';
import { ElementFormatType, NodeKey } from 'lexical';
import ActionPlugin from '@/editor/plugins/ActionPlugin';
import StickyPlugin from '@/editor/plugins/StickyPlugin';
import LexicalAutoLinkPlugin from '@/editor/plugins/AutoLinkPlugin';

const onError = (err: any) => {
  console.error(err);
};

const editorConfig = {
  namespace: 'Editor',
  theme: EditorTheme,
  nodes: [...EditorNode],
  onError: (error: Error) => {
    throw error;
  },
};

const Editor = () => {
  const [editorState, setEditorState] = useState<string>();
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };
  const onChange = (editorState: { toJSON: () => any }) => {
    setEditorState(JSON.stringify(editorState.toJSON()));
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container flex flex-1 flex-col">
        <ToolbarPlugin  setIsLinkEditMode={setIsLinkEditMode}/>
        <div className="editor-inner flex flex-col flex-1">
          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller">
                <div className="editor" ref={onRef}>
                  <ContentEditable
                    className="editor-content"
                    aria-placeholder={'내용을 입력해 주세요'}
                    placeholder={
                      <div className="editor-placeholder">
                        {'내용을 입력해 주세요'}
                      </div>
                    }
                  />
                </div>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ImagePlugin />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <LexicalAutoLinkPlugin/>
          <CodeHilightPlugin />
          <YouTubePlugin />
          <AutoEmbedPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <MarkdownPlugin />
          <ActionPlugin/>
          <StickyPlugin/>
          {floatingAnchorElem && (
            <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
          )}
        </div>
      </div>
    </LexicalComposer>
  );
};

export default Editor;
