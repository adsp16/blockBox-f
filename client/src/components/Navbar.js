import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import BlockLogo from "../blocks.svg";
import WithdrawModal from "../components/WithdrawModal";
import "./Navbar.css";

const Navigation = ({
  account,
  balance,
  closeModal,
  openModal,
  showModal,
  withdrawFunds,
}) => {
  return (
    <React.Fragment>
      <Navbar bg="light" expand="lg">
        <WithdrawModal
          closeModal={closeModal}
          showModal={showModal}
          withdrawFunds={withdrawFunds}
        />
        <Navbar.Brand href="#home">
          <img alt="logo" className="navbar-logo" src={BlockLogo} />
          BlockBox
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
          <Nav.Link disabled>{account.account}</Nav.Link>
          <Nav.Link disabled>{`BlockBox Balance : ${balance} eth`}</Nav.Link>
          <Nav.Link>
            <Button onClick={openModal} variant="primary">
              Withdraw
            </Button>
          </Nav.Link>
        </Navbar.Collapse>
      </Navbar>
    </React.Fragment>
  );
};

export default Navigation;
