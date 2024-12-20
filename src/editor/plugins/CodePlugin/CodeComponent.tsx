import {
  $createCodeNode, $isCodeNode,
} from '@lexical/code';
import { $getNodeByKey, $getSelection, $isRangeSelection, LexicalEditor } from 'lexical';
// @ts-ignore
import { $setBlocksType } from '@lexical/selection';
import { useEditorStore } from '@/store/zustand/editorStore';

export const CODE_LANGUAGE_FRIENDLY_NAME_MAP: Record<string, string> = {
  c: 'C',
  clike: 'C++',
  css: 'CSS',
  cpp: 'HTML',
  java: 'Java',
  js: 'JavaScript',
  markdown: 'Markdown',
  Plain: 'Plain Text',
  py: 'Python',
  rust: 'Rust',
  sql: 'SQL',
  typescript: 'TypeScript',
  xml: 'XML',
};

export const CODE_LANGUAGE_LIST = [
  'C',
  'C++',
  'C#',
  'HTML',
  'CSS',
  'GO',
  'Java',
  'JavaScript',
  'JSON',
  'PHP',
  'Spring',
  'React',
  'NextJs',
  'Vue',
  'Python',
  'SQL',
  'TypeScript',
  'Kotlin',
]


const getCodeLanguageOption = (): [string, string][] => {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP
  )) {
    options.push([lang, friendlyName]);
  }
  return options;
};

export const CODE_LANGUAGE_OPTIONS = getCodeLanguageOption();

export const formatCode = (editor: LexicalEditor) => {
  editor.update(() => {
    let selection = $getSelection();

    if (selection !== null) {
      if (selection.isCollapsed()) {
        $setBlocksType(selection, () => $createCodeNode());
      } else {
        const textContent = selection.getTextContent();
        const codeNode = $createCodeNode();
        // @ts-ignore
        selection.insertNodes([codeNode]);
        selection = $getSelection();
          selection?.insertRawText(textContent);
        codeNode.setLanguage('java')
      }
    }
  });
};

