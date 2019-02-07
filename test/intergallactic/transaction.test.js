"use strict";

const fs = require('fs');
var glOrWd = typeof window !== "undefined" ? window : global;
var Intergallactic = glOrWd.Intergallactic;
var expect = glOrWd.expect;

const accounts = require('./accounts_list.json');  ;

before("instantiate Intergallactic", function() {
  new Intergallactic({ url: glOrWd.tnet, protocol: "jsonrpc" });
});

describe("Intergallactic.Transaction", function() {
  const igc = new Intergallactic({ url: glOrWd.tnet, protocol: "jsonrpc" });
  const newTxn = new igc.Transaction();
  const sendTxn = new igc.Send();
  const bondTxn = new igc.Bond();
  const unbondTxn = new igc.Unbond();
  const permTxn = new igc.Permission();
  const callTxn = new igc.Call();

  let signedTxn;

  it('should have "signSync" function upon instantiate', function() {
    expect(newTxn.signTransaction).to.be.a("function");
  });

  it('should have "sign" function upon instantiate', function() {
    expect(newTxn.broadcast).to.be.a("function");
  });

  it('should have "send" function upon instantiate', function() {
    expect(sendTxn.send).to.be.a("function");
  });

  it('should have "call" function upon instantiate', function() {
    expect(callTxn.call).to.be.a("function");
  });

  it('should have "bond" function upon instantiate', function() {
    expect(bondTxn.bond).to.be.a("function");
  });

  it('should have "unbond" function upon instantiate', function() {
    expect(unbondTxn.unbond).to.be.a("function");
  });

  it('should have "permission" function upon instantiate', function() {
    expect(permTxn.permission).to.be.a("function");
  });

  it('"sign",should sign the transaction and return the signed transaction object', async function() {
    const newTxn = new igc.Transaction();
    let seq = await newTxn.getSequence(accounts[0].Account_address);
    let chainId = await newTxn.getChainId();
    let txnObject = await sendTxn.buildTxn(
      chainId,
      accounts[0].Account_address,
      accounts[6].Account_address,
      3,
      seq
    );
    signedTxn = await newTxn.signTransaction(
      accounts[0].Private_key,
      txnObject
    );
    expect(signedTxn).to.be.a("string");
  });

  it.skip('"broadcast", should broadcast the transaction after signing', async function () {
    const newTxn = new igc.Transaction();
    // Builds a raw transaction 
    let seq = await newTxn.getSequence(accounts[1].Account_address);
    let chainId = await newTxn.getChainId();
    let txnObj = await bondTxn.buildTxn(
      chainId,
      accounts[1].Account_address,
      accounts[6].Validator_address,
      accounts[6].Public_key,
      33,
      seq
    );
    
    // Signs and sets signatories 
    let signatories = await newTxn.setSignatories(txnObj, accounts[1].Private_key);

    //broadcasts the transaction
    let res = await newTxn.broadcast(chainId, 'BondTx', JSON.parse(txnObj).tx, signatories);
    expect(res.statusCode).to.equal(200);
    expect(res.body.error).to.equal(undefined);
    expect(res.body.result).to.be.an("object");
    expect(res.body.result.TxHash).to.be.a("string");
    expect(res.body.result.TxHash.length).to.equal(28);
    setTimeout(myFunc, 4000, 'delaying');
  });

  it('"send", should send the transaction', async function() {
    let to = accounts[7].Account_address;
    let amount = 3;
    let private_key = accounts[0].Private_key;

    let newTxn = new igc.Send();
    let res = await newTxn.send(to, amount, private_key);
    
    expect(res.statusCode).to.equal(200);
    expect(res.body.error).to.equal(undefined);
    expect(res.body.result).to.be.an("object");
    expect(res.body.result.TxHash).to.be.a("string");
    expect(res.body.result.TxHash.length).to.equal(28);
  });

  it.skip('"call", should call the given transaction', async function () {
    let toAddress = "";
    let amount = 0;
    let data ; //TODO
    let gasLimit = 1;
    let privKey =
    accounts[1].Private_key;

    let newTxn = new igc.Call();
    let res = await newTxn.call(toAddress, amount, data, gasLimit, privKey);
    console.log("res",res);
    
    // expect(res.statusCode).to.equal(200);
    // expect(res.body.error).to.equal(undefined);
    // expect(res.body.result).to.be.an("object");
    // expect(res.body.result.TxHash).to.be.a("string");
    // expect(res.body.result.TxHash.length).to.equal(28);
  });
  
  it.only('"Bond, Should bond a given transaction', function(done) {
    let publicKey = accounts[7].Public_key;
    let amount = 22;
    let privKey =
    accounts[3].Private_key;
    let newTxn = new igc.Bond();
    newTxn.bond(publicKey, amount, privKey).then(res => {
      console.log("res",res)
    })
    this.timeout(2000)
    setTimeout(done, 2000);
  })

  it.only('"unbond", should unbond the given transaction',async function () {
    let to = accounts[7].Account_address;
    let amount = 22;
    let privKey =
    accounts[7].Private_key;
    let newTxn = new igc.Unbond();
    let res = await newTxn.unbond(to, amount, privKey);
    console.log("res",res);
  });

  it('"permission", should do permission transaction',async function () {
    let address = accounts[3].Account_address;
    let perm_value = "0x1ff";
    let privKey =
      accounts[6].Private_key;
    let newTxn = new igc.Permission();
    let res = await newTxn.permission(address, perm_value, privKey);
    console.log("permission", res);
  });

});