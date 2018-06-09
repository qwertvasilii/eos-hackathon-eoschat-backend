const config = {
  eos: {
    keyProvider: "FaucetPrivKey",
    httpEndpoint: "http://localhost:8888",
    debug: true
  },
  chat: {
    faucetName: "faucet",
    contractName: "eoschat"
  }
};

module.exports = { config };
