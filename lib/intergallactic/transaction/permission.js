'use strict'

const Transaction = require("./Transaction"),
  conversion = require("../../utils/conversion"),
  config = require("../../config/constant"),
  gkeys = require("gallactickeys");

  const PERM_TX_TYPE = config.transactionType.perm;;

  class PermissionTx extends Transaction {
      constructor(igc) {
          super(igc)
      }

      permission(address, permValue, privKey) {
        const account = gkeys.getAccountByPrivkey(privKey);
        const from = account.acAddress;

        let obj = {};
        return this.getChainId()
          .then(chainId => {
            obj.chainId = chainId;
            return this.getSequence(from);
          })
          .then(sequence => {
            let txnObj = this.buildTxn(obj.chainId, from, address, permValue, sequence);
            const signatories = this.setSignatories(
              txnObj,
              privKey
            );
            return this.broadcast(obj.chainId, PERM_TX_TYPE, JSON.parse(txnObj).tx, signatories);
          });
      }

      buildTxn(chainId, modifier, modified, permValue, sequence) {
        const permTxn = 
        JSON.stringify({
          chainId: chainId,
          type: PERM_TX_TYPE,
          tx: {
            modifier: {
              address: modifier,
              amount: 0,
              sequence: sequence
            },
            modified: {
              address: modified,
              amount: 0
            },
            permissions : permValue,
            set : true
          }
        });
        return permTxn;
      }
  }
module.exports = PermissionTx;