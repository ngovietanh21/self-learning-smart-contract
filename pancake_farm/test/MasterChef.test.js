const { time } = require('@openzeppelin/test-helpers');
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MasterChef", function () {
    let alice, bob, dev, minter
    let cake, syrup, lp1, lp2, lp3, chef
    let CakeToken, SyrupBar, MasterChef, MockBEP20

    beforeEach(async function () {
        [alice, bob, dev, minter] = await ethers.getSigners()
        // contract
        CakeToken = await ethers.getContractFactory('CakeToken')
        SyrupBar = await ethers.getContractFactory('SyrupBar')
        MasterChef = await ethers.getContractFactory('MasterChef')
        MockBEP20 = await ethers.getContractFactory('MockBEP20')

        // deploy tokens
        cake = await CakeToken.connect(minter).deploy()
        syrup = await SyrupBar.connect(minter).deploy(cake.address)
        lp1 = await MockBEP20.connect(minter).deploy('LPToken1', 'LP1', 1000000)
        lp2 = await MockBEP20.connect(minter).deploy('LPToken2', 'LP2', 1000000)
        lp3 = await MockBEP20.connect(minter).deploy('LPToken3', 'LP3', 1000000)
        chef = await MasterChef.connect(minter).deploy(cake.address, syrup.address, dev.address, 1000, 100)
        await cake.connect(minter).transferOwnership(chef.address);
        await syrup.connect(minter).transferOwnership(chef.address);

        await lp1.connect(minter).transfer(bob.address, 2000)
        await lp2.connect(minter).transfer(bob.address, 2000)
        await lp3.connect(minter).transfer(bob.address, 2000)

        await lp1.connect(minter).transfer(alice.address, 2000)
        await lp2.connect(minter).transfer(alice.address, 2000)
        await lp3.connect(minter).transfer(alice.address, 2000)
    })

    it('real case', async () => {
        const lp4 = await MockBEP20.connect(minter).deploy('LPToken4', 'LP4', 1000000)
        const lp5 = await MockBEP20.connect(minter).deploy('LPToken5', 'LP5', 1000000)
        const lp6 = await MockBEP20.connect(minter).deploy('LPToken6', 'LP6', 1000000)
        const lp7 = await MockBEP20.connect(minter).deploy('LPToken7', 'LP7', 1000000)
        const lp8 = await MockBEP20.connect(minter).deploy('LPToken8', 'LP8', 1000000)
        const lp9 = await MockBEP20.connect(minter).deploy('LPToken9', 'LP9', 1000000)
        await chef.connect(minter).add(2000, lp1.address, true)
        await chef.connect(minter).add(1000, lp2.address, true)
        await chef.connect(minter).add(500, lp3.address, true)
        await chef.connect(minter).add(500, lp4.address, true)
        await chef.connect(minter).add(500, lp5.address, true)
        await chef.connect(minter).add(500, lp6.address, true)
        await chef.connect(minter).add(500, lp7.address, true)
        await chef.connect(minter).add(100, lp8.address, true)
        await chef.connect(minter).add(100, lp9.address, true)
        expect(await chef.poolLength()).to.eq(10)

        await time.advanceBlockTo('170');
        // Alice Uỷ quyền cho chef sử dụng 1000 token lp1 của bản thân
        await lp1.connect(alice).approve(chef.address, 1000)
        expect(await cake.balanceOf(alice.address)).to.eq(0)
        await chef.connect(alice).deposit(1, 20)
        await chef.connect(alice).withdraw(1, 20)
        expect(await cake.balanceOf(alice.address)).to.eq(263)
        
        // Alice Uỷ quyền cho chef sử dụng 1000 token cake của bản thân
        await cake.connect(alice).approve(chef.address, 1000)
        await chef.connect(alice).enterStaking(20)
        await chef.connect(alice).enterStaking(0)
        await chef.connect(alice).enterStaking(0)
        await chef.connect(alice).enterStaking(0)
        expect(await cake.balanceOf(alice.address)).to.eq(993) // 750 + 263 - 20
    })

    it('deposit/withdraw', async () => {
        await chef.connect(minter).add(1000, lp1.address, true)
        await chef.connect(minter).add(1000, lp2.address, true)
        await chef.connect(minter).add(1000, lp3.address, true)
  
        await lp1.connect(alice).approve(chef.address, 100)
        await chef.connect(alice).deposit(1, 20)
        await chef.connect(alice).deposit(1, 0)
        await chef.connect(alice).deposit(1, 40)
        await chef.connect(alice).deposit(1, 0)

        expect(await lp1.balanceOf(alice.address)).to.eq(1940)
        await chef.connect(alice).withdraw(1, 10)
        expect(await lp1.connect(alice).balanceOf(alice.address)).to.eq(1950)
        expect(await cake.connect(alice).balanceOf(alice.address)).to.eq(999)
        expect(await cake.connect(alice).balanceOf(dev.address)).to.eq(100)
        
        await lp1.connect(bob).approve(chef.address, 100)
        expect(await lp1.balanceOf(bob.address)).to.eq(2000)
        await chef.connect(bob).deposit(1, 50)
        expect(await lp1.balanceOf(bob.address)).to.eq(1950)
        await chef.connect(bob).deposit(1, 0)
        expect(await cake.balanceOf(bob.address)).to.eq(125)
        await chef.connect(bob).emergencyWithdraw(1)
        expect(await lp1.balanceOf(bob.address)).to.eq(2000)
    })
  
    it('staking/unstaking', async () => {
        await chef.connect(minter).add(1000, lp1.address, true)
        await chef.connect(minter).add(1000, lp2.address, true)
        await chef.connect(minter).add(1000, lp3.address, true)
        
        await lp1.connect(alice).approve(chef.address, 10)
        await chef.connect(alice).deposit(1, 2) // 0
        await chef.connect(alice).withdraw(1, 2) // 1
  
        await cake.connect(alice).approve(chef.address, 250)
        // await chef.connect(alice).enterStaking(240) //3
        // expect(await syrup.balanceOf(alice.address)).to.eq(240)
        // expect(await cake.balanceOf(alice.address)).to.eq(10)
        // await chef.connect(alice).enterStaking(10) //4
        // expect(await syrup.balanceOf(alice.address)).to.eq(250)
        // expect(await cake.balanceOf(alice.address)).to.eq(249)
        // await chef.leaveStaking(250);
        // expect(await syrup.balanceOf(alice.address)).to.eq(0)
        // expect(await cake.balanceOf(alice.address)).to.eq(749)
    });

    it('updaate multiplier', async () => {
        await chef.connect(minter).add(1000, lp1.address, true)
        await chef.connect(minter).add(1000, lp2.address, true)
        await chef.connect(minter).add(1000, lp3.address, true)
  
        await lp1.connect(alice).approve(chef.address, 100)
        await lp1.connect(bob).approve(chef.address, 100)
        await chef.connect(alice).deposit(1, 100)
        await chef.connect(bob).deposit(1, 100)
        await chef.connect(alice).deposit(1, 0)
        await chef.connect(bob).deposit(1, 0)
  
        await cake.connect(alice).approve(chef.address, 100)
        await cake.connect(bob).approve(chef.address, 100)
        await chef.connect(alice).enterStaking(50)
        await chef.connect(bob).enterStaking(100)
  
        await chef.connect(minter).updateMultiplier(0)
  
        await chef.connect(alice).enterStaking(0)
        await chef.connect(bob).enterStaking(0)
        await chef.connect(alice).deposit(1, 0)
        await chef.connect(bob).deposit(1, 0)
        
        expect(await cake.balanceOf(alice.address)).to.eq(700)
        expect(await cake.balanceOf(bob.address)).to.eq(150)
  
        await time.advanceBlockTo('265');
  
        await chef.connect(alice).enterStaking(0)
        await chef.connect(bob).enterStaking(0)
        await chef.connect(alice).deposit(1, 0)
        await chef.connect(bob).deposit(1, 0)
  
        expect(await cake.balanceOf(alice.address)).to.eq(700)
        expect(await cake.balanceOf(bob.address)).to.eq(150)
  
        await chef.connect(alice).leaveStaking(50)
        await chef.connect(bob).leaveStaking(100)
        await chef.connect(alice).withdraw(1, 100)
        await chef.connect(bob).withdraw(1, 100)
    });

    it('should allow dev and only dev to update dev', async () => {
        expect(await chef.devaddr()).to.eq(dev.address)
        await expect(chef.connect(bob).dev(bob.address)).to.be.revertedWith('dev: wut?')

        await chef.connect(dev).dev(bob.address)
        expect(await chef.devaddr()).to.eq(bob.address)

        await chef.connect(bob).dev(alice.address)
        expect(await chef.devaddr()).to.eq(alice.address)
    })
});