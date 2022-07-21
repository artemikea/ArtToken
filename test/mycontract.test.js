// test/MyContract.test.js

const { accounts, contract } = require('@openzeppelin/test-environment');

const { expect } = require('chai');

const MyContract = contract.fromArtifact('MyContract');

const [ owner, someone ] = accounts;

describe('MyContract', function () {
    let myContract;

    beforeEach(async function() {
        myContract = await MyContract.new({from: owner});
    });

    it('the deployer is the owner', async function () {
        expect(await myContract.owner()).to.equal(owner);
    });

    it('the deployer is not someone', async function () {
        expect(await myContract.owner()).to.not.equal(someone);
    });

    it('transfer ownership from owner to someone', async function () {
        await myContract.transferOwnership(someone, {from:owner});
        expect(await myContract.owner()).to.equal(someone);
    });

    it('transfer ownership not from owner to someone', async function () {
        await myContract.transferOwnership(someone, {form:someone});
        expect(await myContract.owner()).to.not.equal(someone);
    });

    it('owner set number', async function () {
        await myContract.setMyNumber(10, {from:owner});
        expect(await myContract.getMyNumber()).to.equal(10);
    });

    it('someone set number', async function () {
        await myContract.setMyNumber(10, {from:someone});
        expect(await myContract.getMyNumber()).to.not.equal(10);
    });
});