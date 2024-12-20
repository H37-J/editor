import React, { ReactNode, useEffect } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AiModel, useAiStore } from '@/store/zustand/aiStore';
import { ImSpinner2 } from 'react-icons/im';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { insertText, onCodeLanguageSelect } from '@/editor/utils/editor';
import { useFlashMessageContext } from '@/context/FleshMessageContext';
import { post } from '@/utils/api-utils';
import { useEditorStore } from '@/store/zustand/editorStore';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { formatCode } from '@/editor/plugins/CodePlugin/CodeComponent';
import { useCode } from '@/hooks/useCode';
import { save } from '@excalidraw/excalidraw/types/components/icons';
import CodeModal from '@/pages/components/modal/CodeModal';

const PortalImpl = ({
  onClose,
  children,
  title,
  closeOnClickOutside,
}: {
  children: ReactNode;
  closeOnClickOutside: boolean;
  onClose: () => void;
  title: string;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (modalRef.current !== null) {
      modalRef.current!.focus();
    }
  }, [modalRef]);

  useEffect(() => {
    let modalOverlayElement: HTMLElement | null = null;

    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const clickOutSideHandler = (event: MouseEvent) => {
      const target = event.target;
      console.log(modalRef, target, closeOnClickOutside);
      if (
        modalRef.current !== null &&
        !modalRef.current!.contains(target as Node) &&
        closeOnClickOutside
      ) {
        onClose();
      }
    };

    const modalElement = modalRef.current;
    if (modalElement !== null) {
      modalOverlayElement = modalElement.parentElement;
      if (modalOverlayElement !== null) {
        modalOverlayElement.addEventListener('click', clickOutSideHandler);
      }
    }

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
      if (modalOverlayElement !== null) {
        modalOverlayElement.removeEventListener('click', clickOutSideHandler);
      }
    };
  }, [closeOnClickOutside, onClose]);

  return (
    <div className="flex justify-center items-center fixed inset-0 bg-opacity-50 bg-black z-50 w-full h-full">
      <div ref={modalRef}>
        {children}
      </div>
    </div>
  );
};

export const CodingAiModal = ({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) => {
  const [editor] = useLexicalComposerContext();
  const [prompt, setPrompt] = useState('');
  const result = useAiStore.getState().result;
  const loading = useAiStore.use.loading();
  const [modal, showModal] = useModal();
  const codeUtils = useCode()
  const showFlashMessage = useFlashMessageContext();
  const ref = useRef<HTMLParagraphElement>(null);
  const str = result?.text.replace(/(?:\r\n|\r|\n)/g, '<br/>');
  const create = async () => {
    const data = await post<AiModel>('/api/code', {
      prompt,
    });
    useAiStore.getState().setResult(data);
    useAiStore.getState().setLoading(false);
  };
  const copy = async () => {
    await navigator.clipboard.writeText(result?.text!);
    showFlashMessage('클립보드에 복사 되었습니다.', 2000);
  };

  const insert = async () => {
    onClose();
    insertText(editor, result?.text!);
    formatCode(editor);
  };
  

  const save = async () => {
    showModal('test', (onClose) => (
      <CodeModal content={result?.text!} onClose={onClose} />
    ))

  };

  useEffect(() => {}, []);

  return (
    <>
      {modal}
      <div className="flex flex-col md:w-[600px] w-96 bg-[#141414] border rounded border-neutral-800 shadow-xl absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 md:top-14 md:right-6 md:translate-x-0 md:translate-y-0 overflow-auto">
        <div className="p-2 px-5 space-y-2">
          <div className="flex justify-between">
            <div className="flex items-center space-x-0.5">
              <i className="icon format ai-start" />
              <span className="text-lg ai-text">AI 편집</span>
            </div>
            <button className="text-sm" onClick={() => onClose()}>
              <i className="icon format cancel hover:bg-gray-400" />
            </button>
          </div>
          <div className="text-sm pl-0.5">{title}</div>
        </div>
        <div className="border-t border-neutral-800"></div>
        <textarea
          placeholder="ex) 자바스크립트로 피보나치 수열 코드 작성 해줘"
          autoFocus={true}
          className="p-3 pb-0 px-6 bg-[#141414] outline-0 resize-none outline-none"
          rows={1}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="p-3 px-5">
          {loading ? (
            <div className="flex justify-center">
              <ImSpinner2 className="animate-spin" />
            </div>
          ) : (
            result && (
              // <code ref={ref} className="text-sm text-gray-300 leading-6"></code>
              <SyntaxHighlighter language="javascript" style={atomDark}>
                {result?.text!}
              </SyntaxHighlighter>
            )
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 pt-1.5 mt-4 mb-2">
            <button
              disabled={loading}
              onClick={() => create()}
              className="p-2 px-12 rounded bg-teal-500 sm hover:bg-teal-600"
            >
              생성
            </button>
            {!loading && result && (
              <>
                <button
                  disabled={loading}
                  onClick={() => insert()}
                  className="p-2 px-12 rounded bg-sky-500 sm hover:bg-sky-600"
                >
                  추가
                </button>
                <button
                  disabled={loading}
                  onClick={() => save()}
                  className="p-2 px-12 rounded bg-rose-500 sm hover:bg-rose-600"
                >
                  저장
                </button>
                <button
                  disabled={loading}
                  onClick={() => copy()}
                  className="p-2 px-12 rounded bg-indigo-500 sm hover:bg-indigo-600"
                >
                  복사
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const AiModal = ({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) => {
  const [editor] = useLexicalComposerContext();
  const result = useAiStore.use.result();
  const loading = useAiStore.use.loading();
  const showFlashMessage = useFlashMessageContext();
  const ref = useRef<HTMLParagraphElement>(null);
  const str = result?.text
    .replace(/(?:\r\n|\r|\n)/g, '<br/>')
    .replaceAll('*', '');

  const edit = () => {
    insertText(editor, result?.text!.replaceAll('*', '')!);
    onClose();
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result?.text!.replaceAll('*', '')!);
    showFlashMessage('클립보드에 복사 되었습니다.', 2000);
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = str!;
    }
  }, [str]);

  return (
    <>
      <div className="flex flex-col md:w-[550px] w-96 bg-[#141414] border rounded border-neutral-800 shadow-xl absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 md:top-14 md:right-6 md:translate-x-0 md:translate-y-0 overflow-auto">
        <div className="p-2 px-5 space-y-2">
          <div className="flex justify-between">
            <div className="flex items-center space-x-0.5">
              <i className="icon format ai-start" />
              <span className="text-lg ai-text">AI 편집</span>
            </div>
            <button className="text-sm" onClick={() => onClose()}>
              <i className="icon format cancel hover:bg-gray-400" />
            </button>
          </div>
          <div className="text-sm pl-0.5">{title}</div>
        </div>
        <div className="border-t border-neutral-800"></div>
        <div className="p-3 px-5 space-y-6 markdown overflow-auto">
          {loading ? (
            <ImSpinner2 className="animate-spin" />
          ) : (
            <p ref={ref} className="text-sm text-gray-300 leading-6 overflow-y-auto max-h-96"></p>
          )}
          <div className="flex justify-end space-x-1.5">
            <button
              disabled={loading}
              onClick={() => edit()}
              className="p-2 px-12 rounded bg-teal-500 sm hover:bg-teal-600"
            >
              추가
            </button>
            <button
              disabled={loading}
              onClick={() => copy()}
              className="p-2 px-12 rounded bg-indigo-500 sm hover:bg-indigo-600"
            >
              복사
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const useModal = (): [
  JSX.Element | null,
  (title: string, showModal: (onClose: () => void) => JSX.Element) => void,
] => {
  const [modalContent, setModalContent] = useState<null | {
    closeOnClickOutside: boolean;
    content: JSX.Element;
    title: string;
  }>(null);

  const onClose = useCallback(() => {
    setModalContent(null);
  }, []);

  const modal = useMemo(() => {
    if (modalContent === null) {
      return null;
    }
    const { title, content, closeOnClickOutside } = modalContent;
    return (
      <Modal
        onClose={onClose}
        title={title}
        closeOnClickOutside={closeOnClickOutside}
      >
        {content}
      </Modal>
    );
  }, [modalContent]);

  const showModal = useCallback(
    (
      title: string,
      getContent: (onClose: () => void) => JSX.Element,
      closeOnClickOutside = true
    ) => {
      setModalContent({
        closeOnClickOutside,
        content: getContent(onClose),
        title,
      });
    },
    [onClose]
  );

  return [modal, showModal];
};

const Modal = ({
  onClose,
  children,
  title,
  closeOnClickOutside = false,
}: {
  children: ReactNode;
  closeOnClickOutside?: boolean;
  onClose: () => void;
  title: string;
}): JSX.Element => {
  return createPortal(
    <PortalImpl
      onClose={onClose}
      title={title}
      closeOnClickOutside={closeOnClickOutside}
    >
      {children}
    </PortalImpl>,
    document.body
  );
};

export default Modal;
