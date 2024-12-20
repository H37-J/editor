import {
  $createRangeSelection,
  $createTextNode,
  $getNodeByKey,
  $getSelection,
  $setSelection,
  LexicalEditor,
} from 'lexical';
import { useEditorStore } from '@/store/zustand/editorStore';
import { $isCodeNode } from '@lexical/code';

export const insertText = (editor:LexicalEditor, text: string) => {
  editor.update(() => {
    const selection = $getSelection();
    if (selection) {
      const textNode = $createTextNode(text);
      selection.insertNodes([textNode]);
    } else {
      const textNode = $createTextNode(text);
      const rangeSelection = $createRangeSelection();
      $setSelection(rangeSelection)
      const selection = $getSelection();
      selection?.insertNodes([textNode])
    }
  });
};

export const onCodeLanguageSelect = (editor: LexicalEditor, language: string) => {
  editor.update(() => {
    if (useEditorStore.getState().selectedElementKey !== null) {
      const node = $getNodeByKey(useEditorStore.getState().selectedElementKey!);
      if ($isCodeNode(node)) {
        node.setLanguage(language);
      }
    }
  })
}