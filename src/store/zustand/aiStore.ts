import { z } from 'zod';
import { StateCreator } from 'zustand/vanilla';
import { createSelectors } from '@/store/zustand/helper';
import { create } from 'zustand';

export const AiSchema = z.object({
  text: z.string()
});

export type AiModel = z.infer<typeof AiSchema> | null;


interface AiState {
  result: AiModel;
  loading: boolean;
  setResult: (result: AiModel) => void;
  setLoading: (loading: boolean) => void;
  resetState: () => void;
}

const initialState = {
  result: null,
  loading: false,
};

const createAiState: StateCreator<AiState> = (set) => {
  return {
    ...initialState,
    setResult: (result: AiModel) => {
      set(() => ({ result }));
    },
    setLoading: (loading: boolean) => {
      set(() => ({loading}));
    },
    resetState: () => {
      set(initialState);
    },
  };
};

export const useAiStore = createSelectors(
  create<AiState>()((...a) =>  ({
    ...createAiState(...a)
  }))
);