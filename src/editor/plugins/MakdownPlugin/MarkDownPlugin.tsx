import { FC } from "react";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
// @ts-ignore
import { TRANSFORMERS } from "@lexical/markdown";
export const MarkdownPlugin: FC = () => {
  return <MarkdownShortcutPlugin transformers={TRANSFORMERS} />;
};