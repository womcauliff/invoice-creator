import { useReducer, useEffect } from 'react';
import { $, in$ } from 'moneysafe';
// import { getItems, postInvoice } from './utils';
import { getItems, postInvoice } from './utils/__mocks__';

/**
 * Determines if a given value is a valid quantity
 * (a floating-point number and non-negative).
 */
function isValidQuantityValue(quantity) {
  return !Number.isNaN(quantity) && quantity >= 0;
}
const initialState = {
  selectionModalStatus: 'closed',
  toastStatus: 'closed',
  lineItems: [],
  postingStatus: 'ready',
};
/**
 * Reducer for the invoice generator application.
 */
function reducer(state, action) {
  switch (action.type) {
    case 'POPULATE_LINE_ITEMS':
      return {
        ...state,
        lineItems: action.lineItemsAPI.map(lineItem => ({
          ...lineItem,
          selected: false,
          selectedDraft: false,
          quantity: 0,
        })),
      };
    case 'OPEN_SELECTION_MODAL':
      return {
        ...state,
        selectionModalStatus: 'opened',
      };
    case 'DISCARD_SELECTION_DRAFT':
      return {
        ...state,
        selectionModalStatus: 'closed',
        lineItems: state.lineItems.map(lineItem => ({
          ...lineItem,
          selectedDraft: lineItem.selected,
        })),
      };
    case 'COMMIT_SELECTION_DRAFT':
      return {
        ...state,
        selectionModalStatus: 'closed',
        lineItems: state.lineItems.map(lineItem => ({
          ...lineItem,
          selected: lineItem.selectedDraft,
        })),
      };
    case 'EDIT_LINE_ITEM':
      return {
        ...state,
        lineItems: state.lineItems.map(lineItem => {
          if (lineItem.id !== action.lineItem.id) {
            // Ignore line items that do not match id
            return lineItem;
          }
          // For the existing line item with matching id,
          // merge with action's line item.
          return {
            ...lineItem,
            ...action.lineItem,
            // Ignore quantity updates if they are not valid
            quantity: isValidQuantityValue(action.lineItem.quantity)
              ? action.lineItem.quantity
              : lineItem.quantity,
          };
        }),
      };
    case 'SUBMIT_INVOICE':
      return { ...state, postingStatus: 'posting' };
    case 'POST_IN_FLIGHT':
      return { ...state, postingStatus: 'inflight' };
    case 'POST_SUCCEEDED':
      return {
        ...state,
        lineItems: state.lineItems.map(lineItem => ({
          ...lineItem,
          // Reset line items, clearing all selections
          selected: false,
          selectedDraft: false,
          quantity: 0,
        })),
        toastStatus: 'opened.postsuccess',
        postingStatus: 'ready',
      };
    case 'POST_FAILED':
      return {
        ...state,
        toastStatus: 'opened.postfail',
        postingStatus: 'ready',
      };
    case 'CLOSE_TOAST':
      return {
        ...state,
        toastStatus: 'closed',
      };
    default:
      throw new Error();
  }
}

/** Action Creators */

export function openModal() {
  return { type: 'OPEN_SELECTION_MODAL' };
}
export function closeModal() {
  return { type: 'DISCARD_SELECTION_DRAFT' };
}
export function closeToast() {
  return { type: 'CLOSE_TOAST' };
}
export function commitSelectionDraft() {
  return { type: 'COMMIT_SELECTION_DRAFT' };
}
export function editLineItem(lineItem) {
  return { type: 'EDIT_LINE_ITEM', lineItem };
}
export function submitInvoice() {
  return { type: 'SUBMIT_INVOICE' };
}

/**
 * A custom hook for the App component.
 */
export default function useAppHook(SALESTAX) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { lineItems, postingStatus } = state;
  const [
    msSubTotal, // in Money object form
    msTaxableSubTotal, // in Money object form
    selectedLineItems,
  ] = calculateInvoiceSubtotals(lineItems);
  const subTotal = in$(msSubTotal).toFixed(2);
  const msTax = msTaxableSubTotal * SALESTAX;
  const tax = in$(msTax).toFixed(2);
  const grandTotal = in$(msSubTotal.add(msTax)).toFixed(2);

  useEffect(() => {
    const fetchLineItems = async () => {
      try {
        const response = await getItems();
        dispatch({
          type: 'POPULATE_LINE_ITEMS',
          lineItemsAPI: response.data.data,
        });
      } catch (error) {
        console.log(error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      }
    };
    fetchLineItems();
  }, [dispatch]);

  useEffect(() => {
    // Only post invoice data when in 'posting' state (after user clicks submit button)
    if (postingStatus === 'posting') {
      console.log('sending Post');
      // Update `postingStatus` to `inflight` to prevent multiple POST requests.
      dispatch({ type: 'POST_IN_FLIGHT' });

      const submitInvoice = async () => {
        try {
          await postInvoice(selectedLineItems, tax, subTotal, grandTotal);
          dispatch({ type: 'POST_SUCCEEDED' });
        } catch (error) {
          console.log(error);
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
          console.log(error.config);
          dispatch({ type: 'POST_FAILED' });
        }
      };
      submitInvoice();
    }
  }, [postingStatus, selectedLineItems, subTotal, tax, grandTotal]);

  return [{ ...state, selectedLineItems, subTotal, tax, grandTotal }, dispatch];
}

/**
 * Calculates the subtotals of the selected line items on an invoice.
 * @param lineItems The array of available invoice line items.
 * @returns The result array contains three elements:
 * - [0] The calculated subtotal of **selected** line items, in Money object form.
 * - [1] The calculated subtotal of **selected** and **taxable** line items, in Money object form.
 * - [2] Array of **selected** line items, which each item containing its calculated total in cents.
 */
function calculateInvoiceSubtotals(lineItems) {
  return lineItems.reduce(
    (acc, currentItem) => {
      const [subTotal, taxableSubTotal, selectedLineItems] = acc;
      const { selected, price, quantity, is_taxable } = currentItem;

      // Only calculate invoice values using selected line items.
      if (!selected) {
        // Ignore line items which are not selected
        return acc;
      }

      // Using moneysafe lib, calculate total (in cents)
      const itemTotal = $(price) * quantity;

      // Update accumulator
      return [
        // Add current item total to overall selected item subtotal
        subTotal.add(itemTotal),

        // If the selected line item is also taxable
        // Add current item total to overall taxable item subtotal
        is_taxable ? taxableSubTotal.add(itemTotal) : taxableSubTotal,

        // Add current item (with calculated total) to selected line items array
        [
          ...selectedLineItems,
          {
            ...currentItem,
            itemTotal,
          },
        ],
      ];
    },
    [$(0), $(0), []]
  );
}
