import { StateCreator } from 'zustand/vanilla';
import { createSelectors } from '@/store/zustand/helper';
import { create } from 'zustand';

interface myState {
  lang: string;
  setLang: (lang: string) => void;
}

const initialState = {
  lang: '',
}

const createMyState: StateCreator<myState> = (set) => {
  return {
   ...initialState,
    setLang: (lang: string) => {
      set(() => ({ lang }));
    },
  };
}

export const useMyStore = createSelectors(
  create<myState>()((...a) => ({
   ...createMyState(...a),
  }))
)
