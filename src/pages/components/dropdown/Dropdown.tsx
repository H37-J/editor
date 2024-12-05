import React, {
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


type DropDownContextType = {
  registerItem: (ref: React.RefObject<HTMLButtonElement>) => void;
  onClose: () => void;
};

const DropDownContext = React.createContext<DropDownContextType | null>(null);

const dropDownPadding = 4;

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
        className={clsx(className, 'flex space-x-1.5 justify-start items-center w-full hover:bg-[#161616] rounded py-1.5 px-3 mt-0')}
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
        className="dropdown-container fixed items-start flex flex-col space-y-1 bg-[#141414] z-50 w-48 border border-zinc-900 "
        ref={dropDownRef}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </DropDownContext.Provider>
  );
};

const DropDown = ({
  text,
  disabled,
  buttonClassName,
  buttonIconClassNamePrefix,
  buttonIconClassNamePost,
  children,
  stopCloseOnClickSelf,
  direction = 'down',
  image,
}: {
  image?: StaticImageData;
  text?: string;
  disabled?: boolean;
  buttonClassName: string;
  buttonIconClassNamePrefix?: string;
  buttonIconClassNamePost?: string;
  buttonLabel?: string;
  children: ReactNode;
  stopCloseOnClickSelf?: boolean;
  direction?: 'down' | 'up' | 'left' | 'right';
}): JSX.Element => {
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [showDropDown, setShowDropDown] = useState(false);

  const handleClose = () => {
    setShowDropDown(false);
    if (buttonRef.current) {
      buttonRef.current!.focus();
    }
  };

  useEffect(() => {
   if (direction === 'down') {
     const button = buttonRef.current;
     const dropDown = dropDownRef.current;
     if (showDropDown && button !== null && dropDown !== null) {
       const { top, left } = button.getBoundingClientRect();
       dropDown.style.top = `${top + button.offsetHeight + dropDownPadding}px`;
       dropDown.style.left = `${Math.min(
         left,
         window.innerWidth - button.offsetWidth - 20
       )}px`;
     }
   } else if (direction === 'left') {
     const button = buttonRef.current;
     const dropDown = dropDownRef.current;
     if (showDropDown && button !== null && dropDown !== null) {
       const { top, left,right, bottom } = button.getBoundingClientRect();
       dropDown.style.top = `${top - dropDownPadding}px`;
       dropDown.style.left = `${left - dropDown.offsetWidth - dropDownPadding}px`
     }
   }
  }, [dropDownRef, buttonRef, showDropDown]);

  useEffect(() => {
    const button = buttonRef.current;

    if (button !== null && showDropDown) {
      const handle = (event: MouseEvent) => {
        const target = event.target;
        if (stopCloseOnClickSelf) {
          if (
            dropDownRef.current &&
            dropDownRef.current!.contains(target as Node)
          ) {
            return;
          }
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
  }, [dropDownRef, buttonRef, showDropDown, stopCloseOnClickSelf]);

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
  }, [buttonRef, dropDownRef, showDropDown]);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        className={buttonClassName}
        onClick={() => setShowDropDown(!showDropDown)}
        ref={buttonRef}
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
             <i className="icon format xl absolute color-picker"/>
           </>
        )}
        <span className="pt-0.5">{text}</span>
        {buttonIconClassNamePost && <i className={buttonIconClassNamePost} />}
      </button>

      {showDropDown &&
        createPortal(
          <DropDownItems dropDownRef={dropDownRef} onClose={handleClose}>
            {children}
          </DropDownItems>,
          document.body
        )}
    </>
  );
};

export default DropDown;
