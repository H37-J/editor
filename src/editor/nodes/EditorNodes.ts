import type {Klass, LexicalNode} from 'lexical';
import { ImageNode } from '@/editor/plugins/ImagePlugin/ImageNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import {ListItemNode, ListNode} from '@lexical/list';
import {MarkNode} from '@lexical/mark';
// @ts-ignore
import {AutoLinkNode, LinkNode} from '@lexical/link';
import { YouTubeNode } from '@/editor/plugins/YouTubePlugin/YouTubeNode';
import { StickyNode } from '@/editor/plugins/StickyPlugin/StickyNode';
import { ExcaliDrawNode } from '../plugins/ExcalidrawPlugin/ExcaliDrawNode';
import { PageBreakNode } from '@/editor/plugins/PageBreakPlugin/PageBreakNode';
// @ts-ignore
const EditorNode: Array<Klass<LexicalNode>> = [
  ImageNode,
  HeadingNode,
  CodeNode as unknown as Klass<LexicalNode>,
  CodeHighlightNode as unknown as Klass<LexicalNode>,
  ListNode,
  ListItemNode,
  QuoteNode,
  LinkNode,
  StickyNode,
  YouTubeNode,
  AutoLinkNode,
  ExcaliDrawNode,
  PageBreakNode,
  MarkNode as unknown as Klass<LexicalNode>,
]

export default EditorNode