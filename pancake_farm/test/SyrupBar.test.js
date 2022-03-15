const { advanceBlockTo } = require('@openzeppelin/test-helpers/src/time');
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SyrupBar", function () {
    let alice, bob, minter
    let cake, syrup

    beforeEach(async function () {
        [alice, bob, minter] = await ethers.getSigners()
        // contract
        const CakeToken = await ethers.getContractFactory('CakeToken')
        const SyrupBar = await ethers.getContractFactory('SyrupBar')

        // deploy tokens
        cake = await CakeToken.connect(minter).deploy()
        syrup = await SyrupBar.connect(minter).deploy(cake.address)
    })

    it('mint', async function () {
        await syrup.connect(minter).mint(alice.address, 1000)
        expect(await syrup.balanceOf(alice.address)).to.eq(1000)
    });

    it('burn', async () => {
        await advanceBlockTo('650');
        await syrup.connect(minter).mint(alice.address, 1000);
        await syrup.connect(minter).mint(bob.address, 1000);
        expect(await syrup.totalSupply()).to.eq(2000)
        await syrup.connect(minter).burn(alice.address, 200);
    
        expect(await syrup.balanceOf(alice.address)).to.eq(800)
        expect(await syrup.totalSupply()).to.eq(1800)
    });
    
    it('safeCakeTransfer', async () => {
        expect(await cake.balanceOf(syrup.address)).to.eq(0)
        await cake.connect(minter).mint(syrup.address, 1000);
        await syrup.connect(minter).safeCakeTransfer(bob.address, 200);
        expect(await cake.balanceOf(bob.address)).to.eq(200)
        expect(await cake.balanceOf(syrup.address)).to.eq(800)

        await syrup.connect(minter).safeCakeTransfer(bob.address, 2000);
        expect(await cake.balanceOf(bob.address)).to.eq(1000)
    });
});