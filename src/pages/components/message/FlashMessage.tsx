import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type FlashMessageProps = {
  children: ReactNode;
}

const FlashMessage = ({
  children,
}: FlashMessageProps) => {
  return createPortal(
    <div className="FlashMessage__overlay" role="dialog">
      <p className="FlashMessage__alert" role="alert">
        {children}
      </p>
    </div>,
    document.body,
  );
}

export default FlashMessage;