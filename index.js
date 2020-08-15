const express = require('express')

const port = 5050

const Dash = require('dash');

const cors = require('cors');

const app = express();

app.use(cors());

const clientOpts = {
  network: 'evonet',
  wallet: {
        mnemonic:"wrist ladder salute build walk other scrap stumble true hotel layer treat"
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
