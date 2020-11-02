const Dash = require('dash');

const clientOpts = {
    network: 'evonet',
    wallet: {
        mnemonic: "nominee bulb antenna various sheriff maid umbrella sure fun boss angle cattle"
    }
};




async function sendFunds(amount, toAddress) {
    try {

        const client = new Dash.Client(clientOpts);
        const account = await client.wallet.getAccount();
        console.log(`retrieved account`)
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
                }
            ]
        });
        const result = await account.broadcastTransaction(transaction);
        console.log('Transaction broadcast!\nTransaction ID:', result);

        return;
    } catch (e) {
        throw e;
    }


}

(async () => {
    await sendFunds(1000000, 'yQwjgYuioLb9CBKJAmvQuP5HZYj3HtpRmW')
})()