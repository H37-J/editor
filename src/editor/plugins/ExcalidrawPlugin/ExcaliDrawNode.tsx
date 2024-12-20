import React, { JSX, Suspense } from 'react';
import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput, DOMExportOutput,
  EditorConfig,
  LexicalEditor, LexicalNode, NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import { DecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';

type Dimension = number | 'inherit';

const ExcalidrawComponent = React.lazy(() => import('./ExcalidrawComponent'));

export type SerializedExcalidrawNode = Spread<
  {
    data: string;
    width?: Dimension;
    height?: Dimension;
  },
  SerializedLexicalNode
>;

const $convertExcalidrawElement = (
  domNode: HTMLElement,
): DOMConversionOutput | null => {
  const excalidrawData = domNode.getAttribute('data-lexical-excalidraw-json');
  const styleAttributes = window.getComputedStyle(domNode);
  const heightStr = styleAttributes.getPropertyValue('height');
  const widthStr = styleAttributes.getPropertyValue('width');
  const height =
    !heightStr || heightStr === 'inherit' ? 'inherit' : parseInt(heightStr, 10);
  const width =
    !widthStr || widthStr === 'inherit' ? 'inherit' : parseInt(widthStr, 10);

  if (excalidrawData) {
    const node = $createExcalidrawNode(excalidrawData, width, height);
    return {
      node,
    };
  }
  return null;
}

export class ExcaliDrawNode extends DecoratorNode<JSX.Element> {
  __data: string;
  __width: Dimension;
  __height: Dimension;

  static getType(): string {
    return 'excalidraw';
  }

  static clone(node: ExcaliDrawNode): ExcaliDrawNode {
    return new ExcaliDrawNode(
      node.__data,
      node.__width,
      node.__height,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedExcalidrawNode): ExcaliDrawNode {
    return new ExcaliDrawNode(
      serializedNode.data,
      serializedNode.width ?? 'inherit',
      serializedNode.height ?? 'inherit',
    );
  }

  exportJSON(): SerializedExcalidrawNode {
    return {
      data: this.__data,
      height: this.__height === 'inherit' ? undefined : this.__height,
      type: 'excalidraw',
      version: 1,
      width: this.__width === 'inherit' ? undefined : this.__width,
    };
  }

  constructor(
    data = '[]',
    width: Dimension = 'inherit',
    height: Dimension = 'inherit',
    key?: NodeKey,
  ) {
    super(key);
    this.__data = data;
    this.__width = width;
    this.__height = height;
  }

  // View
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

  static importDOM(): DOMConversionMap<HTMLSpanElement> | null {
    return {
      span: (domNode: HTMLSpanElement) => {
        if (!domNode.hasAttribute('data-lexical-excalidraw-json')) {
          return null;
        }
        return {
          conversion: $convertExcalidrawElement,
          priority: 1,
        };
      },
    };
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement('span');

    element.style.display = 'inline-block';

    const content = editor.getElementByKey(this.getKey());
    if (content !== null) {
      const svg = content.querySelector('svg');
      if (svg !== null) {
        element.innerHTML = svg.outerHTML;
      }
    }

    element.style.width =
      this.__width === 'inherit' ? 'inherit' : `${this.__width}px`;
    element.style.height =
      this.__height === 'inherit' ? 'inherit' : `${this.__height}px`;

    element.setAttribute('data-lexical-excalidraw-json', this.__data);
    return {element};
  }

  setData(data: string): void {
    const self = this.getWritable();
    self.__data = data;
  }

  getWidth(): Dimension {
    return this.getLatest().__width;
  }

  setWidth(width: Dimension): void {
    const self = this.getWritable();
    self.__width = width;
  }

  getHeight(): Dimension {
    return this.getLatest().__height;
  }

  setHeight(height: Dimension): void {
    const self = this.getWritable();
    self.__height = height;
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return (
      <Suspense fallback={null}>
        <ExcalidrawComponent
          nodeKey={this.getKey()}
          data={this.__data}
          width={this.__width}
          height={this.__height}
        />
      </Suspense>
    );
  }
}

export const $createExcalidrawNode = (
  data: string = '[]',
  width: Dimension = 'inherit',
  height: Dimension = 'inherit',
): ExcaliDrawNode => {
  return new ExcaliDrawNode(data, width, height);
}

export const $isExcalidrawNode = (
  node: LexicalNode | null | undefined,
): node is ExcaliDrawNode => {
  return node instanceof ExcaliDrawNode;
}