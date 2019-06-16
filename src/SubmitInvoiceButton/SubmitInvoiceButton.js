import React from 'react';
import { Button, Spinner } from 'reactstrap';
import './SubmitInvoiceButton.css';

/**
 * Button that the user clicks to submit an invoice.
 */
function SubmitInvoiceButton(props) {
  let buttonContents = '';
  let disabled = false;

  switch (props.postingStatus) {
    case 'ready':
      buttonContents = <span>Submit Invoice</span>;
      disabled = false;
      break;
    case 'posting':
    case 'inflight':
      buttonContents = (
        <>
          <span>Submitting Invoice... </span>
          <Spinner tag="span" color="light" />
        </>
      );
      disabled = true;
      break;
    // no default
  }

  // Regardless of the value of `postingStatus`,
  // disable the button when no line items have been selected.
  disabled = props.selectedLineItemsLength === 0;

  return (
    <Button
      className="submit-invoice-button"
      color="primary"
      disabled={disabled}
      type="submit"
    >
      {buttonContents}
    </Button>
  );
}

export default SubmitInvoiceButton;
