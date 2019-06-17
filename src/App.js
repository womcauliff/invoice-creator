import React from 'react';
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
import useAppHook, {
  openModal,
  closeModal,
  closeToast,
  commitSelectionDraft,
  editLineItem,
  submitInvoice,
} from './useAppHook';
import './App.css';

import SelectLineItemsModal from './SelectLineItemsModal';
import LineItemTable from './LineItemTable';
import SubmitInvoiceButton from './SubmitInvoiceButton';
import Toast from './Toast';

const SALESTAX = 0.07;
export default function App() {
  const [state, dispatch] = useAppHook(SALESTAX);
  const {
    lineItems,
    selectedLineItems,
    selectionModalStatus,
    postingStatus,
    toastStatus,
    subTotal,
    tax,
    grandTotal,
  } = state;

  /** Event handlers to dispatch action creators */
  function onOpenModal() {
    dispatch(openModal());
  }
  function onCloseModal() {
    dispatch(closeModal());
  }
  function onCloseToast() {
    dispatch(closeToast());
  }
  function onModalSubmit(e) {
    e.preventDefault();
    dispatch(commitSelectionDraft());
  }
  function onSaveLineItem(lineItem) {
    dispatch(editLineItem(lineItem));
  }
  function onInvoiceSubmit(e) {
    e.preventDefault();
    dispatch(submitInvoice());
  }

  return (
    <Container>
      <Toast closeToast={onCloseToast} toastStatus={toastStatus} />

      <div className="py-5 text-center">
        <h1>Invoice Creator</h1>
      </div>
      <Row>
        <Col>
          <h2>Line Items</h2>

          <LineItemTable
            saveLineItem={onSaveLineItem}
            selectedLineItems={selectedLineItems}
          />

          <Table striped className="text-right font-weight-bold">
            <tbody>
              <tr>
                <th scope="row">Subtotal</th>
                <td>{`$${subTotal}`}</td>
              </tr>
              <tr>
                <th scope="row">Tax ({(SALESTAX * 100).toFixed(2) + '%'})</th>
                <td>{`$${tax}`}</td>
              </tr>

              <tr>
                <th scope="row">Total</th>
                <td>{`$${grandTotal}`}</td>
              </tr>
            </tbody>
          </Table>

          <Form onSubmit={onInvoiceSubmit}>
            <FormGroup row>
              <ButtonGroup>
                <Button color="primary" onClick={onOpenModal}>
                  Add Line Item(s)
                </Button>
                <SubmitInvoiceButton
                  selectedLineItemsLength={selectedLineItems.length}
                  postingStatus={postingStatus}
                />
              </ButtonGroup>
            </FormGroup>
          </Form>
        </Col>
      </Row>

      <SelectLineItemsModal
        lineItems={lineItems}
        modalStatus={selectionModalStatus}
        closeModal={onCloseModal}
        onSubmit={onModalSubmit}
        saveLineItem={onSaveLineItem}
      ></SelectLineItemsModal>
    </Container>
  );
}
