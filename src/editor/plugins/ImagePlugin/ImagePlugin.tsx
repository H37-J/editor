import { $createImageNode, $isImageNode, ImageNode, ImagePayload } from '@/editor/plugins/ImagePlugin/ImageNode';
import { $wrapNodeInElement, CAN_USE_DOM, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode, $createRangeSelection, $getSelection,
  $insertNodes, $isNodeSelection,
  $isRootOrShadowRoot, $setSelection,
  COMMAND_PRIORITY_EDITOR, COMMAND_PRIORITY_HIGH, COMMAND_PRIORITY_LOW,
  createCommand, DRAGOVER_COMMAND, DRAGSTART_COMMAND, DROP_COMMAND,
  LexicalCommand,
  LexicalEditor,
} from 'lexical';
import React, {  RefObject, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useRouter } from 'next/router';
import { useGallery } from '@/hooks/useGallery';

export type InsertImagePayload = Readonly<ImagePayload>;

const getDOMSelection = (targetWindow: Window | null): Selection | null =>
  CAN_USE_DOM ? (targetWindow?.getSelection() ?? null) : null;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand('INSERT_IMAGE_COMMAND');


export const ImageDialog = React.forwardRef((
  {
    editor,
  }: {
    editor: LexicalEditor;
  },
  ref: React.ForwardedRef<HTMLInputElement>,
) => {
  const galleryUtils = useGallery();
  const router = useRouter();
  const loadImage = (files: FileList | null) => {
    const reader = new FileReader();
    reader.onload = function() {
      if (typeof reader.result === 'string') {
        onClick({src: reader.result})
        const target = ref as RefObject<HTMLInputElement>;
        if (target.current) {
          target.current.value = '';
        }
      }
      return '';
    };
    if (files !== null) {
      reader.readAsDataURL(files[0] as Blob);
    }
  };

  const onClick = async (payload: InsertImagePayload) => {
    await galleryUtils.createGallery({
      image: payload.src,
      postUUid: String(router.query.slug!),
    })
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
  };

  return (
    <>
      <input
        ref={ref as RefObject<HTMLInputElement>}
        type="file"
        accept="image/*"
        onChange={(e) => loadImage(e.target.files)}
        data-test-id="image-modal-file-upload"
      />
    </>
  )
});


const $getImageNodeInSelection = (): ImageNode | null => {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) {
    return null;
  }
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isImageNode(node) ? node : null;
};

const $onDragStart = (event: DragEvent): boolean => {
  const node = $getImageNodeInSelection();
  const TRANSPARENT_IMAGE =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const img = document.createElement('img');
  img.src = TRANSPARENT_IMAGE;
  if (!node) {
    return false;
  }
  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) {
    return false;
  }
  dataTransfer.setData('text/plain', '_');
  dataTransfer.setDragImage(img, 0, 0);
  dataTransfer.setData(
    'application/x-lexical-drag',
    JSON.stringify({
      data: {
        altText: node.__altText,
        caption: node.__caption,
        height: node.__height,
        key: node.getKey(),
        maxWidth: node.__maxWidth,
        showCaption: node.__showCaption,
        src: node.__src,
        width: node.__width,
      },
      type: 'image',
    }),
  );
  return true;
}

const canDropImage = (event: DragEvent): boolean => {
  const target = event.target;
  return !!(
    target &&
      target instanceof HTMLElement &&
      !target.closest('code, span.editor-image') &&
      target.parentElement
      // && target.parentElement.closest('div.ContentEditable__root')
  );
}

const $onDragover = (event: DragEvent): boolean => {
  const node = $getImageNodeInSelection();
  if (!node) {
    return false;
  }
  if (!canDropImage(event)) {
    event.preventDefault();
  }
  return true;
}

const getDragImageData = (event: DragEvent): null | InsertImagePayload => {
  const dragData = event.dataTransfer?.getData('application/x-lexical-drag');
  if (!dragData) {
    return null;
  }
  const {type, data} = JSON.parse(dragData);
  if (type !== 'image') {
    return null;
  }

  return data;
}

declare global {
  interface DragEvent {
    rangeOffset?: number;
    rangeParent?: Node;
  }
}

const getDragSelection = (event: DragEvent): Range | null | undefined => {
  let range: Range | null | undefined;
  const target = event.target as null | Element | Document;
  const targetWindow =
    target == null
      ? null
      : target.nodeType === 9
        ? (target as Document).defaultView
        : (target as Element).ownerDocument.defaultView;
  const domSelection = getDOMSelection(targetWindow);
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
    range = domSelection.getRangeAt(0);
  } else {
    throw Error(`Cannot get the selection when dragging`);
  }

  return range;
}

const $onDrop = (event: DragEvent, editor: LexicalEditor): boolean =>{
  const node = $getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const data = getDragImageData(event);
  if (!data) {
    return false;
  }
  event.preventDefault();
  if (canDropImage(event)) {
    const range = getDragSelection(event);
    node.remove();
    const rangeSelection = $createRangeSelection();
    if (range !== null && range !== undefined) {
      rangeSelection.applyDOMRange(range);
    }
    $setSelection(rangeSelection);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
  }
  return true;
}

const ImagePlugin = (): JSX.Element | null => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            // @ts-ignore
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand<DragEvent>(
        DRAGSTART_COMMAND,
        (event) => {
          return $onDragStart(event);
        },
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand<DragEvent>(
        DRAGOVER_COMMAND,
        (event) => {
          return $onDragover(event);
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<DragEvent>(
        DROP_COMMAND,
        (event) => {
          return $onDrop(event, editor);
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor]);

  return null;
}

export default ImagePlugin;