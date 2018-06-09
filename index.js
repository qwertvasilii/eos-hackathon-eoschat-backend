const express = require("express");
const Eos = require("eosjs");
const app = express();
const { config } = require("./config-dev");

eos = Eos(config.eos);

app.get("/", (req, res) => res.send("Hello EOSIO chat"));
app.get("/signup/:nick/:activekey/:ownerkey", (req, res) => {
  const nick = req.params.nick;
  const activeKey = req.params.activekey;
  const ownerKey = req.params.ownerkey;
  eos
    .transaction(tr => {
      tr.newaccount({
        creator: config.chat.faucetName,
        name: nick,
        owner: ownerKey,
        active: activeKey
      });
      tr.transfer({
        from: config.chat.faucetName,
        to: nick,
        quantity: "10 EOS",
        memo: "faucet giveaway"
      });
      tr.transaction({
        actions: [
          {
            account: config.chat.contractName,
            name: "signup",
            authorization: [
              {
                actor: nick,
                permission: "active"
              }
            ],
            data: {
              account: nick,
              username: nick
            }
          }
        ]
      });
    })
    .then(result => {
      console.log("res", result);
      res.json({ ok: true });
    })
    .catch(err => {
      console.log("err", err);
      res.json({ ok: false });
    });
});

app.listen(3000, () =>
  console.log("EOS chat listening on http://localhost:3000/")
);
