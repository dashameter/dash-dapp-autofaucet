const express = require('express')

const port = 5050

const Dash = require('dash');

const cors = require('cors');

const app = express();

let client, account;

const smallDripAmount = 1000000;
const bigDripAmount = 100000000;

app.use(cors());

const clientOpts = {
    network: 'evonet',
    wallet: {
        mnemonic: "wrist ladder salute build walk other scrap stumble true hotel layer treat"
    }
};

async function init() {
    client = new Dash.Client(clientOpts);
    account = await client.wallet.getAccount();
}

async function getDrip(amount, toAddress) {
    try {
        const address = account.getUnusedAddress().address

        const transaction = account.createTransaction({
            recipients: [
                {
                    recipient: toAddress,
                    satoshis: amount
                },
                {
                    recipient: toAddress,
                    satoshis: amount
                },
                {
                    recipient: toAddress,
                    satoshis: amount
                },
            ]
        });

        const result = await account.broadcastTransaction(transaction);

        console.log('Transaction broadcast!\nTransaction ID:', result);

        return;
    } catch (e) {
        throw e;
    }
    /*
    finally {
      client.disconnect();
    }
    */

}

app.get('/drip/:address', async (req, res) => {
    try{
    console.log("Regular Drip requested by:", req.params.address)
    await getDrip(smallDripAmount, req.params.address);
    res.status(200).send("Regular drop: " + req.params.address)
    }
    catch(e){
        console.error('Something went wrong:', e);
        return res.status(200).send(e.message);
    }
})

app.get('/bigdrip/:address', async (req, res) => {
    try{
    console.log("Big Drip requested by:", req.params.address)
    await getDrip(bigDripAmount, req.params.address);
    res.status(200).send("Big drop: " + req.params.address)
    }
    catch(e){
        console.error('Something went wrong:', e);
        return res.status(200).send(e.message);
    }
})

app.listen(port, async () => {
    try {
        console.log('initialising');
        await init();
        console.log(`Example app listening at http://localhost:${port}`);
    }
    catch (e) {
        console.log(e);
    }
})