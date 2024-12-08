import { createStore } from 'redux';

type Type = {
  count: number;
};

const initialState: Type = {
  count: 0,
};

export type CounterActionType = {
  type: 'INCREMENT' | 'DECREMENT';
  payload: number;
};

const reducer = (state = initialState, action: CounterActionType) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1
      };
    default:
      return state;
  }
};

