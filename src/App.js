import React, { useEffect, useReducer } from 'react';
import {
  Button,
  ButtonGroup,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Table,
} from 'reactstrap';
import './App.css';
import getItems from './utils/getItems';

import SelectLineItemsModal from './SelectLineItemsModal';
import LineItemTable from './LineItemTable';

/**
 * Determines if a given value is a valid quantity
 * (a floating-point number and non-negative).
 */
function isValidQuantityValue(quantity) {
  return !Number.isNaN(quantity) && quantity >= 0;
}
const initialState = {
  selectionModalStatus: 'closed',
  lineItems: [],
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
    default:
      throw new Error();
  }
}
const SALESTAX = 0.07;
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function openModal() {
    dispatch({ type: 'OPEN_SELECTION_MODAL' });
  }
  function closeModal() {
    dispatch({ type: 'DISCARD_SELECTION_DRAFT' });
  }
  function onModalSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'COMMIT_SELECTION_DRAFT' });
  }
  function saveLineItem(lineItem) {
    dispatch({
      type: 'EDIT_LINE_ITEM',
      lineItem,
    });
  }

  useEffect(() => {
    const fetchLineItems = async () => {
      try {
        const response = await getItems();
        console.log(response, response.data);
        dispatch({
          type: 'POPULATE_LINE_ITEMS',
          lineItemsAPI: [
            ...response.data.data.map(lineItem => ({
              ...lineItem,
              selected: false,
              selectedDraft: false,
            })),
          ],
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
  }, []);

  const { lineItems, selectionModalStatus } = state;
  const selectedLineItems = lineItems.filter(({ selected }) => selected);
  const subTotal = selectedLineItems.reduce(
    (subTotal, { price, quantity }) => subTotal + price * quantity,
    0
  );
  const taxableTotal = selectedLineItems
    .filter(({ is_taxable }) => is_taxable)
    .reduce(
      (taxableTotal, { price, quantity }) => taxableTotal + price * quantity,

      0
    );
  const tax = taxableTotal * SALESTAX;
  return (
    <Container>
      <div className="py-5 text-center">
        <h1>Invoice Creator</h1>
      </div>
      <Row>
        <Col>
          <h2>Line Items</h2>

          <LineItemTable
            saveLineItem={saveLineItem}
            selectedLineItems={selectedLineItems}
          />

          <Table striped className="text-right font-weight-bold">
            <tbody>
              <tr>
                <th scope="row">Subtotal</th>
                <td>{`$${subTotal.toFixed(2)}`}</td>
              </tr>
              <tr>
                <th scope="row">Tax ({(SALESTAX * 100).toFixed(2) + '%'})</th>
                <td>{`$${tax.toFixed(2)}`}</td>
              </tr>

              <tr>
                <th scope="row">Total</th>
                <td>{`$${(subTotal + tax).toFixed(2)}`}</td>
              </tr>
            </tbody>
          </Table>

          <Form>
            <FormGroup row>
              <ButtonGroup>
                <Button color="primary" onClick={openModal}>
                  Add Line Item(s)
                </Button>
                <Button
                  color="primary"
                  disabled={selectedLineItems.length === 0}
                  type="submit"
                >
                  Submit Invoice
                </Button>
              </ButtonGroup>
            </FormGroup>
          </Form>
        </Col>
      </Row>

      <SelectLineItemsModal
        lineItems={lineItems}
        modalStatus={selectionModalStatus}
        closeModal={closeModal}
        onSubmit={onModalSubmit}
        saveLineItem={saveLineItem}
      ></SelectLineItemsModal>
    </Container>
  );
}

export default App;
