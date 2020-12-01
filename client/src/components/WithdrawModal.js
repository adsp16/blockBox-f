import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const WithdrawModal = ({
  showModal,
  closeModal,
  modalLoading,
  withdrawFunds,
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState();

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Withdraw You Ether</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Withdraw Amount</Form.Label>
            <Form.Control
              type="number"
              required
              placeholder="Enter Amount"
              onChange={(event) => setWithdrawAmount(event.target.value)}
            />
            <Form.Text className="text-muted">
              Please enter your amount in Ether {withdrawAmount}
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button onClick={() => withdrawFunds(withdrawAmount)} variant="primary">
          Withdraw
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WithdrawModal;
