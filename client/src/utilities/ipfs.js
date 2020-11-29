const ipfsClient = require("ipfs-http-client");

export const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});
