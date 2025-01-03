import { EditorState, LexicalEditor, NodeKey } from 'lexical';
import { StateCreator } from 'zustand/vanilla';
import { createSelectors } from '@/store/zustand/helper';
import { create } from 'zustand/index';
import { persist } from 'zustand/middleware';
interface state {
  editor: LexicalEditor | null;
  state: EditorState | null;
  title: string;
  selectedContent: string;
  selectedElementKey: NodeKey | null;
  showNote: boolean;
  setEditor: (editor: LexicalEditor) => void;
  setEditorState: (state: EditorState) => void;
  setTitle: (title: string) => void;
  setSelectedContent: (content: string) => void;
  setSelectedElementKey: (elementKey: NodeKey | null) => void;
  setShowNote: (showNote: boolean) => void,
}

const initialState = {
  editor: null,
  title: '',
  state: null,
  selectedContent: '',
  selectedElementKey: null,
  showNote: false,
};

const createEditorState: StateCreator<state> = (set) => {
  return {
    ...initialState,
    setEditor: (editor: LexicalEditor) => {
      set(() => ({ editor }));
    },
    setEditorState: (state: EditorState) => {
      set(() => ({ state }));
    },
    setTitle: (title: string) => {
      set(() => ({ title }));
    },
    setSelectedContent: (selectedContent: string) => {
      set(() => ({ selectedContent }));
    },
    setSelectedElementKey: (selectedElementKey: NodeKey | null) => {
      set(() => ({ selectedElementKey }));
    },
    setShowNote: (showNote: boolean) => {
      set(() => ({ showNote }));
    },
  };
};

export const  useEditorStore = createSelectors(
  create<state>()(
    persist((...a) => ({
      ...createEditorState(...a),
    }), {
      name: 'editor-storage',
    })
  )
);
