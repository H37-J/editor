import { ReactNode } from 'react';


const Button = ({
  'data-test-id': dataTestId,
  children,
  className,
  onClick,
  disabled,
  small,
  title
}: {
  'data-test-id'?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  small?: boolean;
  title?: string;
}): JSX.Element => {
  return (
    <button
      disabled={disabled}
      className={className}
      onClick={onClick}
      title={title}
      aria-label={title}>
      {children}
    </button>
  )
}

export default Button;