const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
const util = require('util');
// const { Decimal } = require("decimal.js");

let cryptoPunksMarket;
let deployerSigner, user1Signer, user2Signer, user3Signer, user4Signer;
let deployer, user1, user2, user3, user4;

describe("TestCryptoPunksMarket", function() {

  const accounts = [];
  const accountNames = {};

  function addAccount(account, accountName) {
    accounts.push(account);
    accountNames[account.toLowerCase()] = accountName;
    console.log("      Mapping " + account + " => " + getShortAccountName(account));
  }

  function getShortAccountName(address) {
    if (address != null) {
      var a = address.toLowerCase();
      var n = accountNames[a];
      if (n !== undefined) {
        return n + ":" + address.substring(0, 6);
      }
    }
    return address;
  }

  function printEvents(contract, receipt) {
    receipt.logs.forEach((log) => {
      var data = contract.interface.parseLog(log);
      var result = data.name + "(";
      let separator = "";
      data.eventFragment.inputs.forEach((a) => {
        result = result + separator + a.name + ": ";
        if (a.type == 'address') {
          result = result + getShortAccountName(data.args[a.name].toString());
        } else {
          result = result + data.args[a.name].toString();
        }
        separator = ", ";
      });
      result = result + ")";
      console.log("        + " + result);
    });
  }

  async function printCryptoPunksMarketDetails(header = false) {
    console.log("        --- CryptoPunksMarket ---");
    if (header) {
      // console.log("      - owner: " + getShortAccountName(await hoprDistributor.owner()));
      console.log("        - standard: " + await cryptoPunksMarket.standard());
      console.log("        - name: " + await cryptoPunksMarket.name());
      console.log("        - symbol: " + await cryptoPunksMarket.symbol());
      console.log("        - decimals: " + await cryptoPunksMarket.decimals());
      console.log("        - totalSupply: " + await cryptoPunksMarket.totalSupply());
    }
    // console.log("        - nextPunkIndexToAssign(NOTUSED): " + await cryptoPunksMarket.nextPunkIndexToAssign());
    console.log("        - allPunksAssigned: " + await cryptoPunksMarket.allPunksAssigned());
    console.log("        - punksRemainingToAssign: " + await cryptoPunksMarket.punksRemainingToAssign());

    for (let i = 0; i < 6; i = parseInt(i) + 1) {
      const owner = await cryptoPunksMarket.punkIndexToAddress(i);
      console.log("        - token " + i + " has owner: " + getShortAccountName(owner));
    }
    var checkAccounts = [deployer, user1, user2, user3, user4];
    for (let i = 0; i < checkAccounts.length; i++) {
      console.log("        - " + getShortAccountName(checkAccounts[i]) + ".balance: " + await cryptoPunksMarket.balanceOf(checkAccounts[i]));
    }

    // console.log("      - totalToBeMinted: " + ethers.utils.formatUnits(await hoprDistributor.totalToBeMinted(), 18));
    // console.log("      - totalMinted: " + ethers.utils.formatUnits(await hoprDistributor.totalMinted(), 18));
    // console.log("      - startTime: " + await hoprDistributor.startTime());
    // console.log("      - getSchedule('test'): " + JSON.stringify((await hoprDistributor.getSchedule('test')).map((x) => { return x.toString(); })));
    // const allocation0 = await hoprDistributor.allocations(user0, 'test');
    // console.log("      - allocations(user0, 'test') - amount: " + ethers.utils.formatUnits(allocation0.amount, 18) + ", claimed: " + ethers.utils.formatUnits(allocation0.claimed, 18) + ", lastClaim: " + allocation0.lastClaim + ", revoked: " + allocation0.revoked);
    // const allocation1 = await hoprDistributor.allocations(user1, 'test');
    // console.log("      - allocations(user1, 'test') - amount: " + ethers.utils.formatUnits(allocation1.amount, 18) + ", claimed: " + ethers.utils.formatUnits(allocation1.claimed, 18) + ", lastClaim: " + allocation1.lastClaim + ", revoked: " + allocation1.revoked);
    // try {
    //   console.log("      - getClaimable(user0, 'test'): " + ethers.utils.formatUnits(await hoprDistributor.getClaimable(user0, 'test'), 18));
    //   console.log("      - getClaimable(user1, 'test'): " + ethers.utils.formatUnits(await hoprDistributor.getClaimable(user1, 'test'), 18));
    // } catch (e) {
    // }
  }


  it("TestCryptoPunksMarket - #0", async function() {

    [deployerSigner, user1Signer, user2Signer, user3Signer, user4Signer] = await ethers.getSigners();
    [deployer, user1, user2, user3, user4] = await Promise.all([deployerSigner.getAddress(), user1Signer.getAddress(), user2Signer.getAddress(), user3Signer.getAddress(), user4Signer.getAddress()]);
    addAccount("0x0000000000000000000000000000000000000000", "null");
    addAccount(deployer, "deployer");
    addAccount(user1, "user1");
    addAccount(user2, "user2");
    addAccount(user3, "user3");
    addAccount(user4, "user4");

    CryptoPunksMarket = await ethers.getContractFactory("CryptoPunksMarket");

    console.log("        --- Setup 1 - Deploy CryptoPunksMarket ---");
    const setup1 = [];
    setup1.push(CryptoPunksMarket.deploy());
    [cryptoPunksMarket] = await Promise.all(setup1);
    addAccount(cryptoPunksMarket.address, "CryptoPunksMarket");
    const deployTransactionReceipt = await cryptoPunksMarket.deployTransaction.wait();
    console.log("        CryptoPunksMarket deployment - gasUsed: " + deployTransactionReceipt.gasUsed.toString());
    printEvents(cryptoPunksMarket, deployTransactionReceipt);

    console.log("        --- Setup 2 - Set Initial Owners ---");
    const setup2 = [];
    setup2.push(cryptoPunksMarket.setInitialOwner(user1, 0));
    setup2.push(cryptoPunksMarket.setInitialOwner(user2, 1));
    setup2.push(cryptoPunksMarket.setInitialOwner(user3, 2));
    const [setup2a, setup2b, setup2c] = await Promise.all(setup2);
    const [setup2aReceipt, setup2bReceipt, setup2cReceipt] = [await setup2a.wait(), await setup2b.wait(), await setup2c.wait()];
    printEvents(cryptoPunksMarket, setup2aReceipt);
    printEvents(cryptoPunksMarket, setup2bReceipt);
    printEvents(cryptoPunksMarket, setup2cReceipt);

    console.log("        --- Setup 3 - All Initial Owners Assigned ---");
    const allInitialOwnersAssigned1 = await cryptoPunksMarket.allInitialOwnersAssigned();
    const allInitialOwnersAssigned1Receipt = await allInitialOwnersAssigned1.wait();
    printEvents(cryptoPunksMarket, allInitialOwnersAssigned1Receipt);

    console.log("        --- Setup 4 - Set Initial Owners ---");
    const setup4 = [];
    setup4.push(cryptoPunksMarket.connect(user1Signer).getPunk(3));
    setup4.push(cryptoPunksMarket.connect(user2Signer).getPunk(4));
    setup4.push(cryptoPunksMarket.connect(user3Signer).getPunk(5));
    const [setup4a, setup4b, setup4c] = await Promise.all(setup4);
    const [setup4aReceipt, setup4bReceipt, setup4cReceipt] = [await setup4a.wait(), await setup4b.wait(), await setup4c.wait()];
    printEvents(cryptoPunksMarket, setup4aReceipt);
    printEvents(cryptoPunksMarket, setup4bReceipt);
    printEvents(cryptoPunksMarket, setup4cReceipt);

    await printCryptoPunksMarketDetails(true);

    // setup5.push(ogToken.connect(data.user1Signer).approve(data.optinoGov.address, approveTokens));

    // setup2.push(ogToken.setPermission(data.optinoGov.address, ROLE.SETPERMISSION, true, 0));
    // setup2.push(ogToken.setPermission(data.optinoGov.address, ROLE.SETCONFIG, true, 0));
    // setup2.push(ogToken.setPermission(data.optinoGov.address, ROLE.MINTTOKENS, true, ethers.utils.parseUnits("123456789", 18)));
    // setup2.push(ogToken.setPermission(data.optinoGov.address, ROLE.BURNTOKENS, true, 0));
    // setup2.push(ogdToken.setPermission(data.deployer, ROLE.SETCONFIG, true, 0));
    // setup2.push(ogdToken.setPermission(data.optinoGov.address, ROLE.SETPERMISSION, true, 0));
    // setup2.push(ogdToken.setPermission(data.optinoGov.address, ROLE.SETCONFIG, true, 0));
    // setup2.push(ogdToken.setPermission(data.optinoGov.address, ROLE.MINTTOKENS, true, ethers.utils.parseUnits("123456789", 18)));
    // setup2.push(ogdToken.setPermission(data.optinoGov.address, ROLE.BURNTOKENS, true, 0));

    // const _from = parseInt(new Date().getTime()/1000);
    // const _to = parseInt(_from) + SECONDS_PER_YEAR * 2;
    // const amount = 1000000;
    // const _amount = ethers.utils.parseUnits(amount.toString(), 18);
    //
    // for (let date = _from; date < _to; date += (SECONDS_PER_DAY * 23.13)) {
    //   console.log("        date: " + new Date(date * 1000).toUTCString());
    //   const term = date - _from;
    //   for (let rate = 0; rate < 3; rate = parseFloat(rate) + 0.231345) {
    //     const exp = Decimal.exp(new Decimal(rate).mul(term).div(SECONDS_PER_YEAR).div(100));
    //     // console.log("      > exp: " + exp.toPrecision(30));
    //     const expectedFV = exp.mul(_amount.toString());
    //     const _rate = ethers.utils.parseUnits(rate.toString(), 16);
    //     const [fv, gasUsed] = await testInterestUtils.futureValue_(_amount, BigNumber.from(_from), BigNumber.from(date), _rate);
    //     const _diff = fv.sub(expectedFV.toFixed(0));
    //     const diff = ethers.utils.formatUnits(_diff, 18);
    //     console.log("          rate: " + rate + " => fv: " + ethers.utils.formatUnits(fv, 18) + " vs expectedFV: " + ethers.utils.formatUnits(expectedFV.toFixed(0), 18) + ", diff: " + ethers.utils.formatUnits(_diff.toString(), 18) + ", gasUsed: " + gasUsed);
    //     expect(parseFloat(diff.toString())).to.be.closeTo(0, 0.000000001, "Diff too large");
    //   }
    // }

    console.log("        --- Test Completed ---");
    console.log("");
  });
});
