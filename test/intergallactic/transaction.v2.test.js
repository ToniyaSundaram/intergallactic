"use strict";

var Intergallactic =
  typeof window !== "undefined"
    ? window.Intergallactic
    : require("../../index");
var chai = typeof window !== "undefined" ? window : require("chai");
var expect = chai.expect;
var assert = chai.assert;
var tnet = "http://127.0.0.1:1337/rpc";

const testAcc = {
    Private_key:
      "skMrJDE3ZwD8KEMjF5APLW9615GhRNizLxkW5JQAnCFkKRZ5yamjXWQHSYng7kYTBM2dpQfcF1qiuCSgd7ZfRXm8H9T5rhM",
    Public_key: "pkkvZ4zgyre2b3LKjWJET44zC9CDrnB1nc4bVrUhjTghFAzGRob",
    Account_address: "acCxzUX83Aqg45ZiVDmhoYjozPyfBG1zhtQ",
    Validator_address: "vaFgxF2yCa3HfkzyofCK39bA9mm9yKZU61e"
  },
  testAcc1 = {
    Private_key:
      "skeAH9ww5BtpVGtWz16CvgAFAimzQH8LUjkyhoF1oKajDqoSDXbGjaupEnBSAf6BBgmusazkP7bHnuvRwxqb8F1eWCP36Aa",
    Public_key: "pkjLErBkGHHf2Ymd2JcgeQsLkstYnBfPaiMZVPogzSFx5YW6zpp",
    Account_address: "acHMzy386dCc9ytkw4RRBvb8bSxAn5Y73hW",
    Validator_address: "vaL5xjYyG2QDmfL2FVr2RXSUkpjfa8o3W4n"
  };

describe("Intergallactic Transactions", function() {
  let igc;

  before("instantiate intergallactic", function() {
    igc = new Intergallactic({ url: tnet, protocol: "jsonrpc" });
  });

  it('"send" should send the transaction', async function() {
    let to = testAcc1.Account_address;
    let amount = 3;
    let private_key = testAcc.Private_key;

    let newTxn = new igc.Send();
    let res = await newTxn.send(to, amount, private_key);
    
  });

  it("Should complete bond transaction", async function() {
    let publicKey = testAcc.Public_key;
    let amount = 3;
    let privKey =
      testAcc.Private_key;
    let newTxn = new igc.Bond();
    let res = await newTxn.bond(publicKey, amount, privKey);
    console.log("res", res);
  });

  it("Should complete unbond transaction", async function() {
    let to = "acB8phfvWuZ2Wtantp1fuP6nv34y7d6Ekko";
    let amount = 3;
    let privKey =
      "skMrJDE3ZwD8KEMjF5APLW9615GhRNizLxkW5JQAnCFkKRZ5yamjXWQHSYng7kYTBM2dpQfcF1qiuCSgd7ZfRXm8H9T5rhM";
    let newTxn = new igc.Unbond();
    let res = await newTxn.unbond(to, amount, privKey);
    console.log("res", res);
  });

  it("Should give persmission to an account", async function() {
    let address = "acULkay8JdUeYo2NbJpMYTKkXTrUas8XTtm";
    let perm_value = "0x1ff";
    let privKey =
      "skMrJDE3ZwD8KEMjF5APLW9615GhRNizLxkW5JQAnCFkKRZ5yamjXWQHSYng7kYTBM2dpQfcF1qiuCSgd7ZfRXm8H9T5rhM";
    let newTxn = new igc.Permission();
    let res = await newTxn.permission(address, perm_value, privKey);
    console.log("res", res);
  });

  it.only("Should deploy a contract", async function() {
    let toAddress = "";
    let amount = 0;
    let data = "0xf34";
    let gasLimit = 1;
    let privKey =
      "skMrJDE3ZwD8KEMjF5APLW9615GhRNizLxkW5JQAnCFkKRZ5yamjXWQHSYng7kYTBM2dpQfcF1qiuCSgd7ZfRXm8H9T5rhM";

    let newTxn = new igc.Call();
    let res = await newTxn.call(toAddress, amount, data, gasLimit, privKey);
    console.log("res", res);
  });

  //   describe("Tests for Offline Transaction", async function() {
  //     let newTxn;
  //     before("Should instantiate Transaction", function() {
  //       newTxn = new igc.Transaction();
  //     });

  //     it.only("Should have a signTransaction function upon instantiate", function() {
  //       expect(newTxn.signTransaction).to.be.a("function");
  //     });

  //     it.only("Should have a broadcast function upon instantiate", function() {
  //       expect(newTxn.broadcast).to.be.a("function");
  //     });

  //     it('Should signTransaction and return transaction object', async function() {
  //         await newTxn.signTransaction(testAcc.privKey)
  //     })
  //   });
 
});
