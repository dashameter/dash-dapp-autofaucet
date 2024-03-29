const Dash = require('dash');

const recipient = "ygv9AGM4P6XfpMPg5ndKVpBzX1hjo5Sw2T"

const satoshis = 1e6

const maxRetryCount = 20

let retryCounter = 0

let client, account;

const timeFunction = async (promiseToTime) => {
  const timingStart = Date.now()

  const promiseResult = await promiseToTime

  const timing = (Date.now() - timingStart) / 1000

  console.log(promiseResult, ` finished in ${timing}:>> `)

  return promiseResult
}

let clientOpts = {
    network: "testnet",
    unsafeOptions: {
      skipSynchronizationBeforeHeight: 495209,
    },
//     dapiAddresses: [
//     '34.220.41.134',
//     '18.236.216.191',
//     '54.191.227.118',
//   ],
    wallet: {
        // mnemonic: null
        mnemonic: 'fever empty hotel donor chase funny photo honey economy near filter confirm' //receiving address yhehrX13jHPPanTxWiXxGEbz4S8RZ7PsbW
        // mnemonic: 'best ridge office initial ski luggage flee kiwi basket brush pave number' // receiving address ygv9AGM4P6XfpMPg5ndKVpBzX1hjo5Sw2T
    }
};

console.log('clientOpts :>> ', clientOpts);

const sleep =  (ms) => new Promise((resolve)=>{setTimeout(resolve,ms)})

const sendTxLoop = async() => {
    sendTx()
    await sleep(60000)
    sendTxLoop()
}

async function init() {
    try {
        retryCounter = 0

        client = new Dash.Client(clientOpts);
        
        console.log('mnemonic: ', client.wallet.exportWallet())
        
        account = await timeFunction(client.wallet.getAccount());
        
        const address = account.getUnusedAddress().address
        
        console.log('receiving address:', address);
        
        const accBalTotal = account.getTotalBalance();
        
        const accBalUnconf = account.getUnconfirmedBalance()
        
        const accBalConf = account.getConfirmedBalance()
        
        console.log(`Total balance: ${accBalTotal}`)
        console.log(`Unconfirmed balance: ${accBalUnconf}`)
        console.log(`Confirmed balance: ${accBalConf}`)
        console.log(Date(), "Staring sendTxLoop")
        sendTxLoop()
    }
    catch (e) {
        console.error(Date(), 'Init error', e)
        console.dir(e, {depth: 100})
        process.exit(1)
    }
}

const sendTx = async () => {
    try {
        const accBalTotal = account.getTotalBalance();
        
        const accBalUnconf = account.getUnconfirmedBalance()
        
        const accBalConf = account.getConfirmedBalance()
        
        console.log(`Total balance: ${accBalTotal}`)
        console.log(`Unconfirmed balance: ${accBalUnconf}`)
        console.log(`Confirmed balance: ${accBalConf}`)
        
        const transaction = account.createTransaction({
            recipients: [
                {
                    recipient,
                    satoshis
                },
            ]
        });

        const result = await timeFunction(account.broadcastTransaction(transaction))
        
        console.log('broadcasting transaction... :>> ', transaction);

        console.log(Date(), 'Transaction broadcast!\nTransaction ID:', result);

        return;
    } catch (e) {
        console.error(Date(),'sendTx Error',e)
        console.dir(e, { depth: 100})
        console.log('retryCounter :>> ', retryCounter);
        retryCounter += 1
        if (retryCounter >= maxRetryCount) {
            process.exit(1)
        } else {
          console.log("Waiting 10 seconds until retry...")
          await sleep(10000)
          sendTx()
        }
    }
}

init()
