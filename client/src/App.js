import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getBlockBox } from "./utilities/getContract";
import { ipfs } from "./utilities/ipfs";
import { Container } from "react-bootstrap";
import Main from "./components/Main";
import Navigation from "./components/Navbar";
import getWeb3 from "./utilities/getWeb3";

import "./App.css";

const App = () => {
  const [account, setAccount] = useState({ account: "" });
  const [loading, setLoading] = useState(false);
  const [blockBoxJS, setblockBoxJS] = useState(null);
  const [w3, setw3] = useState();
  const [files, setFiles] = useState([]);
  const [balance, setBalance] = useState(0.0);
  const [message, setMessage] = useState();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileLink, setFileLink] = useState("");
  const [success, setSuccess] = useState("");
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState();

  const coffeePrice = "1.2";

  useEffect(() => {
    loadWeb3();
  }, []);

  const loadWeb3 = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();

      setw3(web3);

      setAccount({
        account: accounts[0],
      });

      const blockBox = await getBlockBox(web3);
      setblockBoxJS(blockBox);
      const fileCount = await blockBox.methods.fileCount().call();

      for (let i = 1; i <= fileCount; i++) {
        const file = await blockBox.methods.files(i).call();
        setFiles((prevState) => [...prevState, file]);
      }

      const balance = await blockBox.methods.balances(accounts[0]).call();
      const ethBal = web3.utils.fromWei(balance, "ether");
      setBalance(ethBal);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    const reader = new window.FileReader();

    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setUploadedFile((prevState) => ({
        ...prevState,
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name,
        size: file.size,
      }));
    };
  };

  const uploadFile = (e) => {
    e.preventDefault();
    console.log("Uploading to the inter planetary file system...");
    const option = e.target.one.value;
    const ipfsUrl = "https://ipfs.infura.io/ipfs/";
    setMessage(e.target.message.value);
    setFileLink(null);
    setLoading(true);

    ipfs
      .add(uploadedFile.buffer)
      .then((result) => {
        if (option === "Get Link") {
          setFileLink(`${ipfsUrl}${result.path}`);
        }

        if (option === "IPFS & BlockChain") {
          setShow(true);
          setSuccess("Done!");
        }

        if (uploadedFile.type === "") {
          setUploadedFile((prevState) => ({
            ...prevState,
            type: "none",
          }));
        }

        blockBoxJS.methods
          .uploadFile(
            result.path,
            uploadedFile.type,
            result.size,
            uploadedFile.name
          )
          .send({ from: account.account })
          .then((result) => {
            setLoading(false);
            setShow(true);
            setSuccess("File Uploaded");
          })
          .catch((err) => {
            window.alert("Transaction rejected");
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        return;
      });
  };

  const sendCoffee = async (hash) => {
    blockBoxJS.methods
      .payHash(hash)
      .send({
        from: account.account,
        to: blockBoxJS.options.address,
        value: w3.utils.toWei(coffeePrice, "ether"),
      })
      .then((result) => {
        alert("Coffee Sent");
      })
      .catch((err) => {
        alert("Transaction Failed");
        console.log(err);
      });
  };

  const withdrawFunds = (amount) => {
    if (amount) {
      const amountInWei = w3.utils.toWei(amount.toString());
      console.log(amountInWei);
      blockBoxJS.methods
        .withdraw(amountInWei)
        .send({ from: account.account })
        .then((result) => {})
        .catch((err) => console.log(err));
    }
  };

  const copyToClip = () => {
    navigator.clipboard.writeText(fileLink);
    setShow(true);
    setSuccess("Copied To Clipboard!");
  };

  const closeShow = () => {
    setShow(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <React.Fragment>
      <Navigation
        account={account}
        balance={balance}
        showModal={showModal}
        closeModal={closeModal}
        openModal={handleOpenModal}
        withdrawFunds={withdrawFunds}
      />
      <Container>
        <Main
          getFile={getFile}
          uploadFile={uploadFile}
          fileLink={fileLink}
          success={success}
          copy={copyToClip}
          show={show}
          close={closeShow}
          loading={loading}
          files={files}
          sendCoffee={sendCoffee}
        />
      </Container>
    </React.Fragment>
  );
};

export default App;
