// test/MyContract.test.js

const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { balance, BN, constants, ether, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { assert, expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const ArtCoin = contract.fromArtifact('ArtCoin');

const [account1, account2, owner ] = accounts;
const SUPPLY1 = ether('400000000');
const SUPPLY2 = ether('250000000');

const initialAccounts = [account1, account2];
const initialBalances = [SUPPLY1, SUPPLY2];

describe('ArtCoin', function () {
    let artCoin;

    beforeEach(async function () {
        artCoin = await ArtCoin.new({from: owner});
    });

    it('check name is ArtCoin', async function () {
        expect(await artCoin.name()).to.equal("ArtCoin");
    });

    it('check symbol is AC', async function () {
        expect(await artCoin.symbol()).to.equal("AC");
    });

    it('check decimals is 18', async function () {
        expect(await artCoin.decimals()).to.be.bignumber.equal('18');
    });
});

describe('ArtCoin', async function () {
    let token;

    beforeEach(async function () {
        token = await ArtCoin.new(initialAccounts, initialBalances, { from: owner });
    });

    it('works', async function () {
        const amount = ether('400000000');
        expect(await token.balanceOf(account1)).to.be.bignumber.equal(amount);
    });

    describe('transfer', function () {
        it('works correctly', async function () {
            const balance1Before = await token.balanceOf(account1);
            const balance2Before = await token.balanceOf(account2);
            expect(await token.balanceOf(account1)).to.be.bignumber.equal(balance1Before);
            expect(await token.balanceOf(account2)).to.be.bignumber.equal(balance2Before);
            const amountToTransfer = ether('123321');
            await token.transfer(account2, amountToTransfer, { from: account1 });
            const balance1After = await token.balanceOf(account1);
            const balance2After = await token.balanceOf(account2);
            expect(balance1After).to.be.bignumber.equal(balance1Before.sub(amountToTransfer));
            expect(balance2After).to.be.bignumber.equal(balance2Before.add(amountToTransfer));
        });
    });
});