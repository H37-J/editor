import { $createTextNode, $getSelection, LexicalEditor } from 'lexical';

export const insertText = (editor:LexicalEditor, text: string) => {
  editor.update(() => {
    const selection = $getSelection();
    if (selection) {
      const textNode = $createTextNode(text);
      selection.insertNodes([textNode]);
    }
  });
};