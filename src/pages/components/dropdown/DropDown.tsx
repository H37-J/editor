import React, {
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';
import dropDown from '@/pages/components/dropdown/DropDown';


type DropDownContextType = {
  registerItem: (ref: React.RefObject<HTMLButtonElement>) => void;
  onClose: () => void;
};

const DropDownContext = React.createContext<DropDownContextType | null>(null);

const dropDownPadding = 6;

export const DropDownItem = ({
  children,
  className,
  buttonIconClassNamePrefix,
  onClick,
  title,
}: {
  children: React.ReactNode;
  className: string;
  buttonIconClassNamePrefix?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
}) => {
  const ref = useRef<HTMLButtonElement | null>(null);

  const dropDownContext = React.useContext(DropDownContext);

  if (dropDownContext === null) {
    throw new Error('DropDownItem must be used within a Dropdown');
  }

  const { registerItem } = dropDownContext;

  useEffect(() => {
    if (ref && ref.current) {
      registerItem(ref);
    }
  }, [ref, registerItem]);

  return (
    <>
      {buttonIconClassNamePrefix && (
        <i className={clsx(buttonIconClassNamePrefix)} />
      )}
      <button
        className={clsx(className, 'flex space-x-2 justify-start items-center w-full hover:bg-[#161616] rounded py-2.5 px-3 mt-0 text-sm')}
        onClick={onClick}
        ref={ref}
        title={title}
        type="button"
      >
        {children}
      </button>
    </>
  );
};

const DropDownItems = ({
  children,
  dropDownRef,
  onClose,
}: {
  children: ReactNode;
  dropDownRef: React.Ref<HTMLDivElement>;
  onClose: () => void;
}): JSX.Element => {
  const [items, setItems] = useState<React.RefObject<HTMLButtonElement>[]>();
  const [highlightedItem, setHighlightedItem] =
    useState<React.RefObject<HTMLButtonElement>>();

  const registerItem = useCallback(
    (itemRef: React.RefObject<HTMLButtonElement>) => {
      setItems((prev) => (prev ? [...prev, itemRef] : [itemRef]));
    },
    [setItems]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!items) {
      return;
    }

    const key = event.key;
    if (['Escape', 'ArrowUp', 'ArrowDown', 'Tab'].includes(key)) {
      event.preventDefault();
    }

    if (key === 'Escape' || key === 'Tab') {
      onClose();
    } else if (key === 'ArrowUp') {
      setHighlightedItem((prev) => {
        if (!prev) {
          return items[0];
        }
        const index = items.indexOf(prev) - 1;
        return items[index === -1 ? items.length - 1 : index];
      });
    } else if (key === 'ArrowDown') {
      setHighlightedItem((prev) => {
        if (!prev) {
          return items[0];
        }
        return items[items.indexOf(prev) + 1];
      });
    }
  };

  const contextValue = useMemo(() => {
    return { registerItem, onClose };
  }, [registerItem, onClose]);

  useEffect(() => {
    if (items && !highlightedItem) {
      setHighlightedItem(items[0]);
    }

    if (highlightedItem && highlightedItem.current) {
      highlightedItem.current.focus();
    }
  }, [items, highlightedItem]);

  return (
    <DropDownContext.Provider value={contextValue}>
      <div
        className="dropdown-container fixed flex flex-col bg-[#141414] z-50 w-48 border border-zinc-900"
        ref={dropDownRef}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </DropDownContext.Provider>
  );
};

const DropDown = ({
  title,
  text,
  disabled,
  buttonClassName,
  buttonIconClassNamePrefix,
  buttonIconClassNamePost,
  children,
  textChildren,
  stopCloseOnClickSelf,
  direction = 'down',
  image,
  color,
}: {
  title?: string;
  image?: StaticImageData;
  text?: string;
  disabled?: boolean;
  buttonClassName: string;
  buttonIconClassNamePrefix?: string;
  buttonIconClassNamePost?: string;
  buttonLabel?: string;
  children: ReactNode;
  textChildren?: ReactNode;
  stopCloseOnClickSelf?: boolean;
  direction?: 'down' | 'up' | 'left' | 'right';
  color?: string;
}): JSX.Element => {
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [right, setRight] = useState(0);
  const handleClose = () => {
    setShowDropDown(false);
    if (buttonRef.current) {
      buttonRef.current!.focus();
    }
  };

  useEffect(() => {
    const button = buttonRef.current;
    const dropDown = dropDownRef.current;
    const { top, left, right } = button?.getBoundingClientRect()!;
   if (direction === 'down') {
     if (showDropDown && button !== null && dropDown !== null) {
       dropDown.style.top = `${top + button.offsetHeight + dropDownPadding}px`;
       dropDown.style.left = `${Math.min(
         left,
         window.innerWidth - button.offsetWidth - 20
       )}px`;
     }
   } else if (direction === 'left') {
     if (showDropDown && button !== null && dropDown !== null) {
       dropDown.style.top = `${top - dropDownPadding}px`;
       dropDown.style.left = `${left - dropDown.offsetWidth - dropDownPadding}px`
     }
   } else if (direction === 'right') {
     if (showDropDown && button !== null && dropDown !== null) {
       dropDown.style.top = `${top}px`;
       dropDown.style.left = `${right + 4}px`
     }
   }
  }, [dropDownRef, buttonRef, showDropDown]);

  useEffect(() => {
    const button = buttonRef.current;
    const dropDown = dropDownRef.current;
    if (button !== null && showDropDown) {
      const handle = (event: MouseEvent) => {
        const target = event.target;
        if (target instanceof HTMLElement && target?.getAttribute('data-direction') === 'right') {
          return;
        }
        if (!button.contains(target as Node)) {
          setShowDropDown(false);
        }
      };
      document.addEventListener('click', handle);
      return () => {
        document.removeEventListener('click', handle);
      };
    }
  }, [buttonRef, dropDownRef, showDropDown]);

  useEffect(() => {
    const handleButtonPositionUpdate = () => {
      if (showDropDown) {
        const button = buttonRef.current;
        const dropDown = dropDownRef.current;
        if (button !== null && dropDown !== null) {
          const { top } = button.getBoundingClientRect();
          const newPosition = top + button.offsetHeight + dropDownPadding;
          if (newPosition !== dropDown.getBoundingClientRect().top) {
            dropDown.style.top = `${newPosition}px`;
          }
        }
      }
    };

    document.addEventListener('scroll', handleButtonPositionUpdate);

    return () => {
      document.removeEventListener('scroll', handleButtonPositionUpdate);
    };
  }, [buttonRef, dropDownRef, showDropDown, color]);

  const toggle = () => {
    const arr = document.querySelectorAll('[data-direction="right"][data-open="true"]');
    [...arr].forEach((item) => {
      const button = item as HTMLButtonElement;
      button.click();
    })
    setShowDropDown(!showDropDown);
  }

  return (
    <>
      <button
        id="dropdown"
        title={title}
        type="button"
        disabled={disabled}
        className={clsx(buttonClassName, 'dropdown')}
        onClick={() => {
          toggle();
        }}
        ref={buttonRef}
        data-open={showDropDown}
        data-direction={direction}
      >
        {buttonIconClassNamePrefix && (
          <i className={buttonIconClassNamePrefix} />
        )}
        {image && (
          <>
            <Image
              className="pt-0.5"
              src={image}
              alt="Color"
              width={28}
              height={28}
            />
            <i
              style={{ backgroundColor: color }}
              className={`icon format xl absolute color-picker`}
            />
          </>
        )}
        {textChildren ? (
          textChildren
        ) : (
          <span data-direction={direction} className="dropdown pt-0.5 text-sm">{text}</span>
        )}
        {buttonIconClassNamePost && <i className={buttonIconClassNamePost} />}
      </button>

      {showDropDown &&
        createPortal(
          <DropDownItems dropDownRef={dropDownRef} onClose={() => handleClose()}>
            {children}
          </DropDownItems>,
          document.body
        )}
    </>
  );
};

export default DropDown;
