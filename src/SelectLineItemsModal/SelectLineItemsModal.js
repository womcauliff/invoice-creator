import React from 'react';
import {
  Button,
  ButtonGroup,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import './SelectLineItemsModal.css';

/**
 * A modal from which the user can select which line items should be added to the invoice.
 */
function SelectLineItemsModal(props) {
  const { modalStatus, closeModal, lineItems, onSubmit, saveLineItem } = props;
  return (
    <Modal
      className="select-line-items-modal"
      isOpen={modalStatus === 'opened'}
      toggle={closeModal}
      returnFocusAfterClose={false}
    >
      <ModalHeader toggle={closeModal}>
        Select line items to add to invoice.
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={onSubmit}>
          <Container>
            <FormGroup>
              {lineItems.map(parentItem => {
                const { id, item, selectedDraft } = parentItem;
                // Read from / Make updates to the draft value of `selected`.
                return (
                  <FormGroup className="form-control-lg" check key={id}>
                    <Input
                      type="checkbox"
                      id={id}
                      checked={selectedDraft}
                      onChange={() =>
                        saveLineItem({
                          ...parentItem,
                          selectedDraft: !selectedDraft,
                        })
                      }
                    />
                    <Label check for={id}>
                      {item}
                    </Label>
                  </FormGroup>
                );
              })}
            </FormGroup>
            <FormGroup row>
              <ButtonGroup>
                <Button color="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button color="secondary" type="submit">
                  Save Line Items
                </Button>
              </ButtonGroup>
            </FormGroup>
          </Container>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default SelectLineItemsModal;
