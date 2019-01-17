'use strict';

const Transaction = require("./Transaction"),
  conversion = require("../../utils/conversion"),
  config = require("../../config/constant"),
  gkeys = require("gallactickeys"),
  GOLANG_NULL  = "<nil>";


const CALL_TX_TYPE = config.transactionType.call;

class CallTx extends Transaction {
  constructor(igc) {
    super(igc);
  }

  call(toAddress, amount, data, gasLimit, privKey) {
    const fromAccount = gkeys.getAccountByPrivkey(privKey);
    const from = fromAccount.acAddress;
    
    let obj = {};
    return this.getChainId()
      .then(chainId => {
        obj.chainId = chainId;
        return this.getSequence(from);
      })
      .then(sequence => {
        let txnObj = this.buildTxn(obj.chainId, from, toAddress, amount, data, gasLimit, sequence);
        const signatories = this.setSignatories(
          txnObj,
          privKey
        );
        return this.broadcast(obj.chainId, CALL_TX_TYPE, JSON.parse(txnObj).tx, signatories);
      });
  }

  buildTxn(chainId, caller, toAddress, amountFrom, data, gasLimit, sequence) {
    const amount = conversion.toBoson(amountFrom, this.txnUnit).toNumber();
    const bondTxn = JSON.stringify({
      chainId: chainId,
      type: CALL_TX_TYPE,
      tx: {
        caller: {
          address: caller,
          amount: amount,
          sequence: sequence
        },
        callee: {
          address: (toAddress === GOLANG_NULL) ? null : toAddress,
          amount: amount
        },
        gasLimit: gasLimit,
        data: data
      }
    });
    return bondTxn;
  }
}
module.exports = CallTx;