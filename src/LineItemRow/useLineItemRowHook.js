import { useReducer, useEffect, useRef } from 'react';

const initialState = { status: 'reading', inputValue: 0 };
/**
 * Reducer for the LineItemRow component.
 * A LineItemRow may be in either the 'reading' or 'editing' states.
 */
function lineItemRowReducer(state, action) {
  switch (action.type) {
    case 'EDIT':
      return { status: 'editing', inputValue: action.value };
    case 'CHANGE':
      return { status: 'editing', inputValue: action.value };
    case 'BLUR':
      return { status: 'reading' };
    case 'COMMIT':
      return { status: 'reading' };
    case 'CANCEL':
      return { status: 'reading' };
    default:
      throw new Error();
  }
}

/**
 * Custom hook for the LineItemRow component.
 */
function useLineItemRowHook() {
  const [state, dispatch] = useReducer(lineItemRowReducer, initialState);

  // Auto-select (and focus) the input field value when moving into 'editing' status.
  const inputRef = useRef(null);
  useEffect(() => {
    if (state.status === 'editing') {
      inputRef.current.select();
    }
  }, [state.status]);

  return [state, dispatch, inputRef];
}

export default useLineItemRowHook;
