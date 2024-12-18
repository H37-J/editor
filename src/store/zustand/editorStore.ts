import { LexicalEditor, NodeKey } from 'lexical';
import { StateCreator } from 'zustand/vanilla';
import { createSelectors } from '@/store/zustand/helper';
import { create } from 'zustand/index';

interface EditorState {
  editor: LexicalEditor | null;
  title: string;
  selectedContent: string;
  selectedElementKey: NodeKey | null;
  setEditor: (editor: LexicalEditor) => void;
  setTitle: (title: string) => void;
  setSelectedContent: (content: string) => void;
  setSelectedElementKey: (elementKey: NodeKey | null) => void;
}

const initialState = {
  editor: null,
  title: '',
  selectedContent: '',
  selectedElementKey: null,
};

const createEditorState: StateCreator<EditorState> = (set) => {
  return {
    ...initialState,
    setEditor: (editor: LexicalEditor) => {
      set(() => ({ editor }));
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
  };
};

export const useEditorStore = createSelectors(
  create<EditorState>()((...a) => ({
    ...createEditorState(...a),
  }))
);
