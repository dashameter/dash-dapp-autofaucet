
const express = require('express')

const port = 5050

const Dash = require('dash');

const cors = require('cors');

const app = express();
  const { NodeForage } = require('nodeforage');
  const nodeforage = new NodeForage({name:'walletdbjs'});

let client, account;

const smallDripAmount = 1000000;
const bigDripAmount = 100000000;

app.use(cors());

// console.log('process.env :>> ', process.env);

 let clientOpts = {
         network: "testnet",
    wallet: {
            mnemonic: "fuel cook network know minimum chief dad tomato glass reveal amused flip", // yamRLtpUbL4BfrGDTfiN5yn4d1Woz3qNhr
            adapter: nodeforage
    }
};

// remove undefined keys
clientOpts = JSON.parse(JSON.stringify(clientOpts))

console.log('clientOpts :>> ', clientOpts);

async function init() {
    try {
        client = new Dash.Client(clientOpts);
 account = await client.wallet.getAccount();
        const address = account.getUnusedAddress().address
        console.log('new faucet funding address:', address);
        const accBalTotal = account.getTotalBalance();
        const accBalUnconf = account.getUnconfirmedBalance()
        const accBalConf = account.getConfirmedBalance()
        console.log(`Total balance: ${accBalTotal}`)
        console.log(`Unconfirmed balance: ${accBalUnconf}`)
        console.log(`Confirmed balance: ${accBalConf}`)
    }
    catch (e) {
        console.log('Init error', e)
        process.exit(1)

        // throw e
    }
}

async function getDrip(amount, toAddress) {
    try {
        const address = account.getUnusedAddress().address
        console.log('new faucet funding address:', address);
        const accBalTotal = account.getTotalBalance();
        const accBalUnconf = account.getUnconfirmedBalance()
        const accBalConf = account.getConfirmedBalance()
        console.log(`Total balance: ${accBalTotal}`)
        console.log(`Unconfirmed balance: ${accBalUnconf}`)
        console.log(`Confirmed balance: ${accBalConf}`)
        const transaction = account.createTransaction({
            recipients: [
                {
                    recipient: toAddress,
                    satoshis: amount
                },]})
        const result = await account.broadcastTransaction(transaction);

        console.log('Transaction broadcast!\nTransaction ID:', result);

        return;
    } catch (e) {
        console.error('getDrip Error:',e)
        console.dir(e, { depth: 100})

        throw e;
    }


}


app.get('/drip/:address', async (req, res) => {
    try {
        console.log("Regular Drip requested by:", req.params.address)
        await getDrip(smallDripAmount, req.params.address);
        res.status(200).send("Regular drop: " + req.params.address)
    }
    catch (e) {
        console.error('app.get() drip error:', e);
        console.dir(e, {depth:100})
        res.status(200).send(e.message);
        process.exit(1)
    }
})



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
