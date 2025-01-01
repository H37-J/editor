import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import React, { useEffect, useRef, useState } from 'react';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import EditorTheme from '@/editor/theme/EditorTheme';
import OnChangePlugin from '@/editor/plugins/OnChangePlugin';
import ToolbarPlugin from '@/editor/plugins/ToolbarPlugin';
import ImagePlugin from '@/editor/plugins/ImagePlugin/ImagePlugin';
import YouTubePlugin from '@/editor/plugins/YouTubePlugin/YouTubePlugin';
import EditorNode from '@/editor/nodes/EditorNodes';
import CodeHilightPlugin from '@/editor/plugins/CodePlugin/CodeHilightPlugin';
import CodeActionMenuPlugin from '@/editor/plugins/CodeActionPlugin/CodeActionMenuPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { MarkdownPlugin } from '@/editor/plugins/MakdownPlugin/MarkDownPlugin';
import AutoEmbedPlugin from '@/editor/plugins/AutoEmbedPlugin';
import ActionPlugin from '@/editor/plugins/ActionPlugin';
import StickyPlugin from '@/editor/plugins/StickyPlugin/StickyPlugin';
import LexicalAutoLinkPlugin from '@/editor/plugins/AutoLinkPlugin';
import DragDropPastePlugin from '@/editor/plugins/DragDropPastePlugin';
import EmojiPickerPlugin from '@/editor/plugins/EmojiPlugin/EmojiPlugin';
import ExcalidrawPlugin from '@/editor/plugins/ExcalidrawPlugin/ExcalidrawPlugin';
import PageBreakPlugin from '@/editor/plugins/PageBreakPlugin/PageBreakPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import TableActionMenuPlugin from '@/editor/plugins/TablePlugin/TableActionMenuPlugin';
import TableHoverActionsPlugin from '@/editor/plugins/TablePlugin/TableHoverActionsContainer';
import TableCellResizerPlugin from '@/editor/plugins/TablePlugin/TableCellResizer';
import { useRouter } from 'next/router';
import api from '@/utils/api';
import { usePost } from '@/hooks/usePost';
import useAuth from '@/hooks/useAuth';
import InitialStatePlugin from '@/editor/plugins/InitialStatePlugin';
import SideNoteList from '@/pages/components/ui/note/SideNoteList';
import LinkPlugin from '@/editor/plugins/LinkPlugin';
import { useModal } from '@/pages/components/modal/Modal';
import { useEditorStore } from '@/store/zustand/editorStore';
import NavBar from '@/pages/components/layout/NavBar';

export const editorConfig = {
  namespace: 'Editor',
  theme: EditorTheme,
  nodes: [...EditorNode],
  onError: (error: Error) => {
    throw error;
  },
};

const Editor = () => {
  const { session } = useAuth();
  const [title, setTitle] = useState('');
  const [focus, setFocus] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [modal, showModal] = useModal();
  const postUtils = usePost();
  const router = useRouter();
  const slug = String(router.query.slug);
  const note = useEditorStore.use.showNote();

  const { data: post, isLoading } = api.post.findByUUId.useQuery(slug, {
    enabled: router.isReady,
  });

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const onChange = async (editorState: { toJSON: () => any }) => {
    if (isLoading || !focus) {
      return false;
    }
    const state = JSON.stringify(editorState.toJSON());
    await postUtils.updateContent({
      uuid: slug,
      content: state,
    });
  };

  const save = async (e) => {
    const title = e.target.value;
    setTitle(title);
    await postUtils.updateTitle({
      uuid: slug,
      title: title === '' ? '제목 없음' : title,
    });
  };

  useEffect(() => {
    if (post) {
      setTitle(post.title! === '제목 없음' ? '' : post.title!);
    }
  }, [post]);

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  if (isLoading) {
    return null;
  }

  return (
    <div className="flex h-full">
      {modal}
      {note && viewportSize.width <= 768 ? <></> : <SideNoteList />}
      {router.query.slug && post && (
        <>
          <LexicalComposer initialConfig={editorConfig}>
            <div className="editor-container w-screen shadow-xl shadow-zinc-900 md:ml-1">
              <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
              <InitialStatePlugin />
              <div className="flex flex-col flex-1">
                <textarea
                  ref={titleRef}
                  autoFocus={false}
                  onFocus={() => setFocus(true)}
                  placeholder="제목"
                  value={title}
                  className="p-1 pb-0 px-2 bg-[#141414] py-3 text-3xl outline-0 resize-none outline-none"
                  rows={1}
                  onChange={(e) => save(e)}
                />
                <RichTextPlugin
                  contentEditable={
                    <div className="editor-scroller">
                      <div className="editor" ref={onRef}>
                        <ContentEditable
                          ref={editorRef}
                          onClick={() => setFocus(true)}
                          className="editor-content pb-12"
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
                <ClickableLinkPlugin />
                <LexicalAutoLinkPlugin />
                <CodeHilightPlugin />
                <YouTubePlugin />
                <LinkPlugin />
                <DragDropPastePlugin />
                <AutoEmbedPlugin />
                <ListPlugin />
                <CheckListPlugin />
                <MarkdownPlugin />
                <ActionPlugin />
                <EmojiPickerPlugin />
                <ExcalidrawPlugin />
                <PageBreakPlugin />
                <StickyPlugin />
                {floatingAnchorElem && (
                  <>
                    <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                    <TableActionMenuPlugin anchorElem={floatingAnchorElem} />
                    <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
                  </>
                )}
                <TablePlugin />
                <TableCellResizerPlugin />
              </div>
              <NavBar editor={true} />
            </div>
          </LexicalComposer>
        </>
      )}
    </div>
  );
};

export default Editor;
