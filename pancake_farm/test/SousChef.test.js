const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SousChef", function () {
    let alice, bob, carol, dev, minter
    let chef, token

    beforeEach(async function () {
        [alice, bob, carol, dev, minter] = await ethers.getSigners()
        // contract
        const MockBEP20 = await ethers.getContractFactory('MockBEP20')
        const SousChef = await ethers.getContractFactory('SousChef')
        // deploy tokens
        token = await MockBEP20.connect(minter).deploy("BCA", "BC",1000000)
        chef = await SousChef.connect(minter).deploy(token.address, 40, 300, 400)
    })

    it('sous chef now', async function () {
        await token.connect(minter).transfer(bob.address, 1000)
        await token.connect(minter).transfer(carol.address, 1000)
        await token.connect(minter).transfer(alice.address, 1000)
        expect(await token.balanceOf(bob.address)).to.eq(1000)

        await token.connect(bob).approve(chef.address, 1000);
        await token.connect(alice).approve(chef.address, 1000);
        await token.connect(carol).approve(chef.address, 1000);
        
        await chef.connect(bob).deposit(10)
        expect(await token.balanceOf(chef.address)).to.eq(10)

        await time.advanceBlockTo('300')
        
        await chef.connect(alice).deposit(30)
        expect(await token.balanceOf(chef.address)).to.eq(40)
        expect(await chef.connect(bob).pendingReward(bob.address)).to.eq(40)
        
        await time.advanceBlockTo('302');
        expect(await chef.connect(bob).pendingReward(bob.address)).to.eq(50)
        expect(await chef.connect(alice).pendingReward(alice.address)).to.eq(30)
    
        await chef.connect(carol).deposit(40)
        expect(await token.balanceOf(chef.address)).to.eq(80)
        await time.advanceBlockTo('304');
        //  bob 10, alice 30, carol 40
        expect(await chef.connect(bob).pendingReward(bob.address)).to.eq(65)
        expect(await chef.connect(alice).pendingReward(alice.address)).to.eq(75)
        expect(await chef.connect(carol).pendingReward(carol.address)).to.eq(20)
    
        await chef.connect(alice).deposit(20) // 305 bob 10, alice 50, carol 40
        await chef.connect(bob).deposit(30) // 306  bob 40, alice 50, carol 40
    
        expect(await chef.connect(bob).pendingReward(bob.address)).to.eq(74)
        expect(await chef.connect(alice).pendingReward(alice.address)).to.eq(110)
    
        await time.advanceBlockTo('307');
        expect(await chef.connect(bob).pendingReward(bob.address)).to.eq(86)
        expect(await chef.connect(alice).pendingReward(alice.address)).to.eq(125)
        
        await chef.connect(alice).withdraw(20) // 308 bob 40, alice 30, carol 40
        await chef.connect(bob).withdraw(30) // 309  bob 10, alice 30, carol 40
    
        await time.advanceBlockTo('310');
        expect(await chef.connect(bob).pendingReward(bob.address)).to.eq(118)
        expect(await chef.connect(alice).pendingReward(alice.address)).to.eq(166)
        expect(await token.balanceOf(chef.address)).to.eq(80)
    
        await time.advanceBlockTo('400');
        expect(await chef.connect(bob).pendingReward(bob.address)).to.eq(568)
        expect(await chef.connect(alice).pendingReward(alice.address)).to.eq(1516)
        expect(await chef.connect(carol).pendingReward(carol.address)).to.eq(1915)
    
        await time.advanceBlockTo('420');
        expect(await chef.connect(bob).pendingReward(bob.address)).to.eq(568)
        expect(await chef.connect(alice).pendingReward(alice.address)).to.eq(1516)
        expect(await chef.connect(carol).pendingReward(carol.address)).to.eq(1915)
    
        await chef.connect(bob).withdraw(10)
        await chef.connect(alice).withdraw(30)
        await expectRevert(chef.connect(carol).withdraw(50), 'not enough')
        await chef.connect(carol).deposit(30)
        await time.advanceBlockTo('450');
        expect(await chef.connect(bob).pendingReward(bob.address)).to.eq(568)
        expect(await chef.connect(alice).pendingReward(alice.address)).to.eq(1516)
        expect(await chef.connect(carol).pendingReward(carol.address)).to.eq(1915)
        await chef.connect(carol).withdraw(70)
        expect(await chef.addressLength()).to.eq(3)
    });

    it('try syrup', async () => {
        // contract
        const CakeToken = await ethers.getContractFactory('CakeToken')
        const SyrupBar = await ethers.getContractFactory('SyrupBar')
        const MockBEP20 = await ethers.getContractFactory('MockBEP20')
        const MasterChef = await ethers.getContractFactory('MasterChef')
        const SousChef = await ethers.getContractFactory('SousChef')
        // deploy tokens

        const cake = await CakeToken.connect(minter).deploy()
        const syrup = await SyrupBar.connect(minter).deploy(cake.address)
        const lp1 = await MockBEP20.connect(minter).deploy('LPToken', 'LP1', 1000000)
        const chef = await MasterChef.connect(minter).deploy(cake.address, syrup.address, dev.address, 1000, 300)

        await cake.connect(minter).transferOwnership(chef.address)
        await syrup.connect(minter).transferOwnership(chef.address)
        await lp1.connect(minter).transfer(bob.address, 2000)
        await lp1.connect(minter).transfer(alice.address, 2000)
    
        await lp1.connect(alice).approve(chef.address, 1000)
        await cake.connect(alice).approve(chef.address, 1000)
    
        await chef.connect(minter).add(1000, lp1.address, true)
        await chef.connect(alice).deposit(1, 20)
        await time.advanceBlockTo('500')
        await chef.connect(alice).deposit(1, 0)
        await chef.connect(minter).add(1000, lp1.address, true)
    
        await chef.connect(alice).enterStaking(10)
        await time.advanceBlockTo('510')
        await chef.connect(alice).enterStaking(10)
    
        const chef2 = await SousChef.connect(minter).deploy(syrup.address, 40, 600, 800)
        await syrup.connect(alice).approve(chef2.address, 10)
        await time.advanceBlockTo('590')
        await chef2.connect(alice).deposit(10) //520
        await time.advanceBlockTo('610')
        expect(await syrup.balanceOf(chef2.address)).to.eq(10)
        expect(await chef2.connect(alice).pendingReward(alice.address)).to.eq(400)
    });
    
    it('emergencyWithdraw', async () => {
        await token.connect(minter).transfer(alice.address, 1000)
        expect(await token.balanceOf(alice.address)).to.eq(1000)

        await token.connect(alice).approve(chef.address, 1000);
        await chef.connect(alice).deposit(10)
        expect(await token.balanceOf(alice.address)).to.eq(990)
        await chef.connect(alice).emergencyWithdraw();
        expect(await token.balanceOf(alice.address)).to.eq(1000)
        expect(await chef.connect(alice).pendingReward(alice.address)).to.eq(0)
    });
});