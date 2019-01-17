'use strict';

const Transaction = require("./Transaction"),
  conversion = require("../../utils/conversion"),
  config = require("../../config/constant"),
  gkeys = require("gallactickeys");

const BOND_TX_TYPE = config.transactionType.bond;

class BondTx extends Transaction {
  constructor(igc) {
    super(igc);
  }

  bond(publicKey, amount, privKey) {
    const fromAccount = gkeys.getAccountByPrivkey(privKey);
    const from = fromAccount.acAddress;
    const  toAccount = gkeys.getAccountByPubkey(publicKey);
    const to = toAccount.vaAddress;

    let obj = {};
    return this.getChainId()
      .then(chainId => {
        obj.chainId = chainId;
        return this.getSequence(from);
      })
      .then(sequence => {
        let txnObj = this.buildTxn(obj.chainId, from, to, publicKey, amount, sequence);
        const signatories = this.setSignatories(
          txnObj,
          privKey
        );
        return this.broadcast(obj.chainId, BOND_TX_TYPE, JSON.parse(txnObj).tx, signatories);
      });
  }

  buildTxn(chainId, from, to, publicKey, amountFrom, sequence) {
    const amount = conversion.toBoson(amountFrom, this.txnUnit).toNumber();
    const bondTxn = JSON.stringify({
      chainId : chainId,
      type : BOND_TX_TYPE,
      tx: {
        from: {
          address: from,
          amount: amount,
          sequence: sequence
        },
        to: {
          address: to,
          amount: amount
        },
        public_key: publicKey
      }
    });
    return bondTxn;
  }
}
module.exports = BondTx;