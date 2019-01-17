"use strict";

const Transaction = require("./Transaction"),
  conversion = require("../../utils/conversion"),
  config = require("../../config/constant"),
  gkeys = require("gallactickeys");

const SEND_TX_TYPE = config.transactionType.send;

class SendTx extends Transaction {
  constructor(igc) {
    super(igc);
  }

  send(to, amount, privKey) {
    const account = gkeys.getAccountByPrivkey(privKey);
    const from = account.acAddress;

    let obj = {};
    return this.getChainId()
      .then(chainId => {
        obj.chainId = chainId;
        return this.getSequence(from);
      })
      .then(sequence => {
        let txnObj = this.buildTxn(obj.chainId, from, to, amount, sequence);        
        const signatories = this.setSignatories(
          txnObj,
          privKey
        );
        return this.broadcast(obj.chainId, SEND_TX_TYPE, JSON.parse(txnObj).tx, signatories);
      });
  }

  buildTxn(chainId, from, to, amountFrom, sequence) {
    const amount = conversion.toBoson(amountFrom, this.txnUnit).toNumber();
    const sendTxn = JSON.stringify({
      chainId: chainId,
      type: SEND_TX_TYPE,
      tx: {
        senders: [
          {
            address: from,
            amount: amount,
            sequence: sequence
          }
        ],
        receivers: [
          {
            address: to,
            amount: amount
          }
        ]
      }
    });
    return sendTxn;
  }
}

module.exports = SendTx;
