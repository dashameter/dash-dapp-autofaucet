const functions = require('firebase-functions');

const express = require('express');

const Dash = require('dash');

const cors = require('cors');

const app = express();

app.use(cors({ origin: true }));

const clientOpts = {
  network: 'testnet',
  wallet: {
        mnemonic:"<seed with balance>"
  }
};


app.get('/drip/:address', async (req, res) => {
  console.log("Drip requested by:", req.params.address)

  const client = new Dash.Client(clientOpts);
  const account = await client.wallet.getAccount();
  
  try {
      const address = account.getUnusedAddress().address
      
      const transaction = account.createTransaction({
        recipients: [
          {
            recipient: req.params.address, 
            satoshis: 1000000
          },
          {
            recipient: req.params.address, 
            satoshis: 1000000
          },
          {
            recipient: req.params.address, 
            satoshis: 1000000
          },
        ]
    });
    
    const result = await account.broadcastTransaction(transaction);
    
    console.log('Transaction broadcast!\nTransaction ID:', result);
    
    return res.status(200).send("drop: " + req.params.address);
  } catch (e) {
    console.error('Something went wrong:', e);
    return res.status(200).send(e.message);
  } finally {
    client.disconnect();
  }
});

exports.evofaucet = functions.https.onRequest(app);