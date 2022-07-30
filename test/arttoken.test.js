// test/MyContract.test.js

const { accounts, contract} = require('@openzeppelin/test-environment');
const { expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const ArtToken = contract.fromArtifact('ArtToken');

const [account1, account2, owner ] = accounts;

describe('test constants', function () {
    let token;

    beforeEach(async function () {
        token = await ArtToken.new({from: owner});
    });

    it('check name is ArtToken', async function () {
        expect(await token.name()).to.equal("ArtToken");
    });

    it('check symbol is AT', async function () {
        expect(await token.symbol()).to.equal("AT");
    });

    it('check decimals is 18', async function () {
        expect(await token.decimals()).to.be.bignumber.equal('18');
    });
});

describe('test functions', async function () {

    describe('mint', async function() {
        let token;

        beforeEach(async function () {
            token = await ArtToken.new({ from: owner });
        });

        it('not working if called not by owner', async function () {
            expect(await token.balanceOf(account1)).to.be.bignumber.equal('0');
            await expectRevert(token.mint(account1, 400000000, { from: account1 }),
                "Ownable: caller is not the owner");
        });
        it('working if called by owner ', async function () {
            expect(await token.balanceOf(account1)).to.be.bignumber.equal('0');
            await token.mint(account1, 400000000, { from: owner });
            expect(await token.balanceOf(account1)).to.be.bignumber.equal('400000000');
        });
    });

    describe('transfer', function () {
        let token;

        beforeEach(async function () {
            token = await ArtToken.new({ from: owner });
        });

        it('not working if value > balance', async function () {
            await token.mint(account1, 500, { from: owner });
            await token.mint(account2, 300, { from: owner });
            const balance1Before = await token.balanceOf(account1);
            const balance2Before = await token.balanceOf(account2);
            expect(await token.balanceOf(account1)).to.be.bignumber.equal(balance1Before);
            expect(await token.balanceOf(account2)).to.be.bignumber.equal(balance2Before);
            await expectRevert(token.transfer(account2, 501, {from: account1}),
                "revert not enough balance");
        });

        it('working', async function () {
            await token.mint(account1, 500, { from: owner });
            await token.mint(account2, 300, { from: owner });
            const balance1Before = await token.balanceOf(account1);
            const balance2Before = await token.balanceOf(account2);
            expect(await token.balanceOf(account1)).to.be.bignumber.equal(balance1Before);
            expect(await token.balanceOf(account2)).to.be.bignumber.equal(balance2Before);
            await token.transfer(account2, 100, {from: account1});
            expect(await token.balanceOf(account1)).to.be.bignumber.equal('400');
            expect(await token.balanceOf(account2)).to.be.bignumber.equal('400');
        });
    });

    describe('transferFrom', function () {
        let token;

        beforeEach(async function () {
            token = await ArtToken.new({ from: owner });
        });

        it('not working if not allowed', async function () {
            await token.mint(account1, 500, { from: owner });
            await expectRevert(token.transferFrom(account1, account2, 100),
                "revert");
        });

        it('not working if value > allowed', async function () {
            await token.mint(account1, 500, { from: owner });
            await token.approve(account2, 100, { from: account1});
            await expectRevert(token.transferFrom(account1, account2, 101),
                "try better");
        });

        it('not working if value > balance', async function () {
            await token.mint(account1, 50, { from: owner });
            expect(await token.balanceOf(account1)).to.be.bignumber.equal('50');
            await token.approve(account2, 1000, { from: account1});
            expect(await token.allowance(account1, account2)).to.be.bignumber.equal('1000');
            await expectRevert(token.transferFrom(account1, account2, 900), "try better");
        });

        it('working', async function () {
            await token.mint(account1, 50, { from: owner });
            expect(await token.balanceOf(account1)).to.be.bignumber.equal('50');
            await token.approve(account2, 40, { from: account1});
            expect(await token.allowance(account1, account2)).to.be.bignumber.equal('40');
        });
    });
    describe('approve', function () {
        let token;

        beforeEach(async function () {
            token = await ArtToken.new({ from: owner });
        });

        it('working', async function () {
            await token.approve(account2, 1000, { from: account1});
            expect(await token.allowance(account1, account2)).to.be.bignumber.equal('1000');
        });
    });
});