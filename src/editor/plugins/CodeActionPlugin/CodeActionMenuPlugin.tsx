import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from '@/editor/utils/utils';
import {
  $isCodeNode,
  CodeNode,
  getLanguageFriendlyName,
} from '@lexical/code';
import { $getNearestNodeFromDOMNode, $getNodeByKey, LexicalEditor } from 'lexical';
import CopyButton from '@/editor/plugins/CodeActionPlugin/CopyButton';
import { createPortal } from 'react-dom';
import Dropdown, { DropDownItem } from '@/pages/components/dropdown/DropDown';
import { CODE_LANGUAGE_OPTIONS } from '@/editor/plugins/CodePlugin/CodeComponent';
import { useEditorStore } from '@/store/zustand/editorStore';
import { onCodeLanguageSelect } from '@/editor/utils/editor';

const CODE_PADDING = 8;

type Position = {
  top: string;
  right: string;
};

const CodeActionMenuContainer = ({
  anchorElem,
}: {
  anchorElem: HTMLElement;
}): JSX.Element => {
  const [editor] = useLexicalComposerContext();
  const [lang, setLang] = useState('');
  const [isShown, setShown] = useState<boolean>(false);
  const [shouldListenMouseMove, setShouldListenMouseMove] =
    useState<boolean>(false);
  const [position, setPosition] = useState<Position>({
    right: '0',
    top: '0',
  });
  const codeSetRef = useRef<Set<string>>(new Set());
  const codeDOMNodeRef = useRef<HTMLElement | null>(null);

  const getCodeDOMNode = (): HTMLElement | null => {
    return codeDOMNodeRef.current;
  };

  const debouncedOnMouseMove = useDebounce(
    (event: MouseEvent) => {
      const { codeDOMNode, isOutside } = getMouseInfo(event);
      if (isOutside) {
        setShown(false);
        return;
      }

      if (!codeDOMNode) {
        return;
      }

      codeDOMNodeRef.current = codeDOMNode;

      let codeNode: CodeNode | null = null;
      let _lang = '';

      editor.update(() => {
        const maybeCodeNode = $getNearestNodeFromDOMNode(codeDOMNode);

        if ($isCodeNode(maybeCodeNode)) {
          codeNode = maybeCodeNode;
          _lang = codeNode.getLanguage() || '';
        }
      });

      if (codeNode) {
        const { y: editorElemY, right: editorElemRight } =
          anchorElem.getBoundingClientRect();
        const { y, right } = codeDOMNode.getBoundingClientRect();
        setLang(_lang);
        setShown(true);
        setPosition({
          right: `${editorElemRight - right + CODE_PADDING}px`,
          top: `${y - editorElemY}px`,
        });
      }
    },
    50,
    100
  );

  useEffect(() => {
    if (!shouldListenMouseMove) {
      return;
    }

    document.addEventListener('mousemove', debouncedOnMouseMove);

    return () => {
      setShown(false);
      document.removeEventListener('mousemove', debouncedOnMouseMove);
    };
  }, [shouldListenMouseMove, debouncedOnMouseMove]);

  useEffect(() => {
    return editor.registerMutationListener(
      CodeNode,
      (mutations) => {
        editor.getEditorState().read(() => {
          for (const [key, type] of mutations) {
            switch (type) {
              case 'created':
                codeSetRef.current.add(key);
                break;

              case 'destroyed':
                codeSetRef.current.delete(key);
                break;

              default:
                break;
            }
          }
        });
        setShouldListenMouseMove(codeSetRef.current.size > 0);
      },
      { skipInitialization: false }
    );
  }, [editor]);


  const codeFriendlyName = useMemo(() => {
    return getLanguageFriendlyName(lang);
  }, [lang])

  return (
    <>
      {isShown ? (
        <div className="code-action-menu-container" style={{ ...position }}>
          <Dropdown
            buttonClassName="code-highlight-language"
            direction="left"
            text={codeFriendlyName}
            textChildren={<span className="text">{codeFriendlyName}</span>}
          >
            {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
              return (
                <DropDownItem
                  className="toolbar-item spaced space-x-1 text-sm flex"
                  onClick={() => onCodeLanguageSelect(editor, value)}
                >
                  <span>{name}</span>
                </DropDownItem>
              )
            })}
          </Dropdown>
          <CopyButton editor={editor} getCodeDOMNode={getCodeDOMNode} />
        </div>
      ) : null}
    </>
  );
};

const getMouseInfo = (
  event: MouseEvent
): {
  codeDOMNode: HTMLElement | null;
  isOutside: boolean;
} => {
  const target = event.target;

  if (target && target instanceof HTMLElement) {
    const codeDOMNode = target.closest<HTMLElement>('code.editor-code');
    const isOutside = !(
      codeDOMNode ||
      target.closest<HTMLElement>('div.code-action-menu-container') ||
      target.closest<HTMLElement>('div.dropdown-container')
    );

    return { codeDOMNode, isOutside };
  } else {
    return { codeDOMNode: null, isOutside: true };
  }
};

const CodeActionMenuPlugin = ({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): React.ReactPortal | null => {
  return createPortal(
    <CodeActionMenuContainer anchorElem={anchorElem} />,
    anchorElem
  );
};

export default CodeActionMenuPlugin;
