const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
console.log("Faucet Private Key", process.env.FAUCET_PRIVATE_KEY);

const port = 5050;

const Dash = require("dash");

const cors = require("cors");

const app = express();

let client, account;

const smallDripAmount = 1000000;
const bigDripAmount = 100000000;

app.use(cors());

// console.log('process.env :>> ', process.env);

let clientOpts = {
  //   dapiAddresses: process.env.NUXT_DAPIADDRESSES
  //     ? JSON.parse(process.env.NUXT_DAPIADDRESSES)
  //     : undefined,
  dapiAddresses: ["127.0.0.1:3000"],
  wallet: {
    // mnemonic: process.env.NUXT_MNEMONIC
    privateKey: process.env.FAUCET_PRIVATE_KEY,
  },
};

// remove undefined keys
clientOpts = JSON.parse(JSON.stringify(clientOpts));

console.log("clientOpts :>> ", clientOpts);

async function init() {
  try {
    client = new Dash.Client(clientOpts);
    account = await client.wallet.getAccount();
    const address = account.getUnusedAddress().address;
    console.log("new faucet funding address:", address);
    const accBalTotal = account.getTotalBalance();
    const accBalUnconf = account.getUnconfirmedBalance();
    const accBalConf = account.getConfirmedBalance();
    console.log(`Total balance: ${accBalTotal}`);
    console.log(`Unconfirmed balance: ${accBalUnconf}`);
    console.log(`Confirmed balance: ${accBalConf}`);
  } catch (e) {
    console.log("Init error", e);
    process.exit(1);

    // throw e
  }
}

async function getDrip(amount, toAddress) {
  try {
    const address = account.getUnusedAddress().address;
    console.log("new faucet funding address:", address);
    const accBalTotal = account.getTotalBalance();
    const accBalUnconf = account.getUnconfirmedBalance();
    const accBalConf = account.getConfirmedBalance();
    console.log(`Total balance: ${accBalTotal}`);
    console.log(`Unconfirmed balance: ${accBalUnconf}`);
    console.log(`Confirmed balance: ${accBalConf}`);
    const transaction = account.createTransaction({
      recipients: [
        {
          recipient: toAddress,
          satoshis: amount,
        },
        //                {
        //                    recipient: toAddress,
        //                    satoshis: amount
        //                },
        //                {
        //                    recipient: toAddress,
        //                    satoshis: amount
        //                },
      ],
    });

    /*
        console.log('transaction:');
        console.dir(transaction);

        console.log('input script:');
        console.dir(transaction.inputs[0]._script);
         */
    console.log("transaction :>> ", transaction);
    const result = await account.broadcastTransaction(transaction);

    console.log("Transaction broadcast!\nTransaction ID:", result);

    return;
  } catch (e) {
    console.error("getDrip Error:", e);
    console.dir(e, { depth: 100 });

    throw e;
  }
  /*
    finally {
      client.disconnect();
    }
    */
}

app.get("/drip/:address", async (req, res) => {
  try {
    console.log("Regular Drip requested by:", req.params.address);
    await getDrip(smallDripAmount, req.params.address);
    res.status(200).send("Regular drop: " + req.params.address);
  } catch (e) {
    console.error("app.get() drip error:", e);
    console.dir(e, { depth: 100 });
    res.status(200).send(e.message);
    process.exit(1);
  }
});

app.get("/bigdrip/:address", async (req, res) => {
  try {
    console.log("Big Drip requested by:", req.params.address);
    await getDrip(bigDripAmount, req.params.address);
    res.status(200).send("Big drop: " + req.params.address);
  } catch (e) {
    console.error("app.get() bigdrip error:", e);
    console.dir(e, { depth: 100 });
    res.status(200).send(e.message);
    process.exit(1);
  }
});

app.listen(port, async () => {
  try {
    console.log("initialising");
    await init();
    console.log(`Autofaucet listening at http://localhost:${port}`);
  } catch (e) {
    console.log("Error caught from app.listen()", e);
    process.exit(1);
  }
});
