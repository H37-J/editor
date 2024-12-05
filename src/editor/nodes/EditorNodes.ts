import type {Klass, LexicalNode} from 'lexical';
import { ImageNode } from '@/editor/nodes/ImageNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import {ListItemNode, ListNode} from '@lexical/list';
import {MarkNode} from '@lexical/mark';
// @ts-ignore
import {AutoLinkNode, LinkNode} from '@lexical/link';
import { YouTubeNode } from '@/editor/nodes/YouTubeNode';
import { StickyNode } from '@/editor/nodes/StickyNode';
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
  MarkNode as unknown as Klass<LexicalNode>,
]

export default EditorNode