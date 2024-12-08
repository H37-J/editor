import React from 'react';

export const dropDownActiveClass = (active: boolean) => {
  if (active) {
    return 'active dropdown-item-active';
  } else {
    return '';
  }
}

export const RefClick = <T>(ref: React.RefObject<HTMLInputElement>, callback?: () => void) => {
  ref.current?.click();
}
