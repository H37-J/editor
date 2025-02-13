import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { $applyNodeReplacement, createEditor, DecoratorNode } from 'lexical';
import { Suspense } from 'react';
import ImageComponent from '@/editor/plugins/ImagePlugin/ImageComponent';

export interface ImagePayload {
  altText?: string;
  className?: string;
  caption?: LexicalEditor;
  height?: number;
  key?: NodeKey;
  maxWidth?: number;
  showCaption?: boolean;
  src: string;
  width?: number;
  captionsEnabled?: boolean;
}

export type SerializedImageNode = Spread<
  {
    altText?: string;
    caption: SerializedEditor;
    height?: number;
    maxWidth: number;
    showCaption: boolean;
    src: string;
    width?: number;
  },
  SerializedLexicalNode
>;

function $convertImageElement(domNode: Node): null | DOMConversionOutput {
  const img = domNode as HTMLImageElement;
  if (img.src.startsWith('file:///')) {
    return null;
  }
  const {alt: altText, src, width, height} = img;
  const node = $createImageNode({altText, height, src, width});
  return {node};
}


export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string | undefined;
  __width: 'inherit' | number;
  __height: 'inherit' | number;
  __maxWidth: number;
  __showCaption: boolean;
  __caption: LexicalEditor;
  __className: string | undefined;
  __captionsEnabled: boolean;

  constructor(
    src: string,
    altText: string | undefined,
    maxWidth: number,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    showCaption?: boolean,
    caption?: LexicalEditor,
    className?: string | undefined,
    captionsEnabled?: boolean,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || 'inherit';
    this.__height = height || 'inherit';
    this.__showCaption = showCaption || false;
    this.__className = className;
    this.__caption =
      caption ||
      createEditor({
        nodes: [],
      });
    this.__captionsEnabled = captionsEnabled || captionsEnabled === undefined;
  }

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__className,
      node.__captionsEnabled,
      node.__key
    );
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText ?? '');
    element.setAttribute('width', this.__width.toString());
    element.setAttribute('height', this.__height.toString());
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: $convertImageElement,
        priority: 0,
      }),
    };
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      caption: this.__caption.toJSON(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      showCaption: this.__showCaption,
      src: this.getSrc(),
      type: 'image',
      version: 1,
      width: this.__width === 'inherit' ? 0 : this.__width,
    };
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const {altText, height, width, maxWidth, caption, src, showCaption} =
      serializedNode;
    const node = $createImageNode({
      altText,
      height,
      maxWidth,
      showCaption,
      src,
      width,
    });
    const nestedEditor = node.__caption;
    const editorState = nestedEditor.parseEditorState(caption.editorState);
    if (!editorState.isEmpty()) {
      nestedEditor.setEditorState(editorState);
    }
    return node;
  }

  setWidthAndHeight(
    width: 'inherit' | number,
    height: 'inherit' | number
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  setShowCaption(showCaption: boolean): void {
    const writable = this.getWritable();
    writable.__showCaption = showCaption;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText ?? '';
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <ImageComponent
          src={this.__src}
          altText={this.__altText}
          width={this.__width}
          height={this.__height}
          maxWidth={this.__maxWidth}
          showCaption={this.__showCaption}
          caption={this.__caption}
          className={this.__className}
          captionsEnabled={this.__captionsEnabled}
          resizable={true}
          nodeKey={this.getKey()}
        />
      </Suspense>
    );
  }
}

export const $createImageNode = ({
  altText,
  height,
  maxWidth = 360,
  captionsEnabled,
  src,
  width,
  showCaption,
  caption,
  className,
  key,
}: ImagePayload): ImageNode => {
  return $applyNodeReplacement(
    new ImageNode(
      src,
      altText,
      maxWidth,
      width,
      height,
      showCaption,
      caption,
      className,
      captionsEnabled,
      key
    )
  );
}

export const $isImageNode = (node: LexicalNode | null | undefined): node is ImageNode => {
  return node instanceof ImageNode;
}