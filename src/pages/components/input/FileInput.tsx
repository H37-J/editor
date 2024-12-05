import React from 'react';


type Props = Readonly<{
  className?: string;
  'data-test-id'?: string;
  accept?: string;
  label?: string;
  onChange: (files: FileList | null) => void;
}>

const FileInput = React.forwardRef(
  (
    { className, accept, label, onChange, 'data-test-id': dataTestId }: Props,
    ref: React.ForwardedRef<any>
  ): JSX.Element => {
    return (
      <>
        <label>{label}</label>
        <input
          ref={ref}
          type="file"
          accept={accept}
          className={className}
          onChange={(e) => onChange(e.target.files)}
          data-test-id={dataTestId}
        />
      </>
    );
  }
);

export default FileInput;