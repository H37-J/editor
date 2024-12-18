import React from 'react';


export const RefClick = <T>(ref: React.RefObject<HTMLInputElement>, callback?: () => void) => {
  ref.current?.click();
}
