import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';
import { $createExcalidrawNode, ExcaliDrawNode } from '@/editor/plugins/ExcalidrawPlugin/ExcaliDrawNode';
import ExcalidrawModal, { ExcalidrawInitialElements } from '@/editor/components/ExcalidrawModal';
import { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';
import { $wrapNodeInElement } from '@lexical/utils';

export const INSERT_EXCALIDRAW_COMMAND: LexicalCommand<void> = createCommand(
  'INSERT_EXCALIDRAW_COMMAND',
);

const ExcalidrawPlugin = (): JSX.Element | null => {
  const [editor] = useLexicalComposerContext();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!editor.hasNodes([ExcaliDrawNode])) {
      throw new Error(
        'ExcalidrawPlugin: ExcaliDrawNode not registered on editor',
      );
    }

    return editor.registerCommand(
      INSERT_EXCALIDRAW_COMMAND,
      () => {
        setModalOpen(true);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  const onClose = () => {
    setModalOpen(false);
  };

  const onDelete = () => {
    setModalOpen(false);
  };

  const onSave = (
    elements: ExcalidrawInitialElements,
    appState: Partial<AppState>,
    files: BinaryFiles,
  ) => {
    editor.update(() => {
      const excalidrawNode = $createExcalidrawNode();
      excalidrawNode.setData(
        JSON.stringify({
          appState,
          elements,
          files,
        }),
      );
      $insertNodes([excalidrawNode]);
      if ($isRootOrShadowRoot(excalidrawNode.getParentOrThrow())) {
        $wrapNodeInElement(excalidrawNode, $createParagraphNode).selectEnd();
      }
    });
    setModalOpen(false);
  };

  return isModalOpen ? (
    <ExcalidrawModal
      initialElements={[]}
      initialAppState={{} as AppState}
      initialFiles={{}}
      isShown={isModalOpen}
      onDelete={onDelete}
      onClose={onClose}
      onSave={onSave}
      closeOnClickOutside={false}
    />
  ) : null;
}

export default ExcalidrawPlugin;