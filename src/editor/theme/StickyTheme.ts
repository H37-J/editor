import type {EditorThemeClasses} from 'lexical';

import baseTheme from './EditorTheme';

const StickyTheme: EditorThemeClasses = {
  ...baseTheme,
  paragraph: 'StickyEditorTheme__paragraph',
};

export default StickyTheme;
