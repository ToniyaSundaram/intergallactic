'use strict'

const Transaction = require("./Transaction"),
  conversion = require("../../utils/conversion"),
  config = require("../../config/constant"),
  gkeys = require("gallactickeys");

  const UNBOND_TX_TYPE = config.transactionType.ubnd;;

  class UnBondTx extends Transaction {
      constructor(igc) {
          super(igc)
      }

      unbond(to, amount, privKey) {
        const account = gkeys.getAccountByPrivkey(privKey);
        const from = account.vaAddress;

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
            return this.broadcast(obj.chainId, UNBOND_TX_TYPE, JSON.parse(txnObj).tx, signatories);
          });
      }

      buildTxn(chainId, from, to, amountFrom, sequence) {
        const amount = conversion.toBoson(amountFrom, this.txnUnit).toNumber();
        const unbondTxn = 
        JSON.stringify({
          chainId: chainId,
          type: UNBOND_TX_TYPE,
          tx: {
            from: {
              address: from,
              amount: amount,
              sequence: sequence
            },
            to: {
              address: to,
              amount: amount
            }
          }
        });
        return unbondTxn;
      }
  }
module.exports = UnBondTx;