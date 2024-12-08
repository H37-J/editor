import type {
  ReactNode} from 'react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
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
    <div className="flex justify-center items-center  fixed inset-0 bg-black bg-opacity-50">
      <div className="flex items-center justify-center h-full" ref={modalRef}>
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-lg font-bold text-black">{title}</h2>
          <p className="text-black">{children}</p>
          <div className="mt-4">
            <button
              id="closeModal"
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
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
    console.log(title, content)
    return (
      <Modal
        onClose={onClose}
        title={title}
        closeOnClickOutside={closeOnClickOutside}
      >
        {content}
      </Modal>
    );
  }, [modalContent, onClose]);

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

export const Modal = ({
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
  console.log(children, title)
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

const Page = () => {
  const [modal, showModal] = useModal();

  return (
    <>
      <button
        onClick={() => {
          {
            showModal('test', (onClose) => <div>모달 내용</div>);
          }
        }}
      >
        Modal Open
      </button>

      {modal}
    </>
  );
};

export default Page;
