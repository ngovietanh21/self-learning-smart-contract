// const { expectRevert, time } = require('@openzeppelin/test-helpers');
// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const ethers1 = require('ethers');

// describe('Timelock', function () {
//     let alice, bob, carol, dev, minter
//     let cake, timelock

//     beforeEach(async function() {
//         [alice, bob, carol, dev, minter] = await ethers.getSigners()

//         const CakeToken = await ethers.getContractFactory("CakeToken")
//         const Timelock = await ethers.getContractFactory("Timelock")

//         cake = await CakeToken.connect(alice).deploy()
//         timelock = await Timelock.connect(alice).deploy(bob.address, 28800) // 8 hour
//     })

//     it('should not allow non-owner to do operation', async () => {
//         await cake.connect(alice).transferOwnership(timelock.address)
//         await expect(cake.connect(alice).transferOwnership(carol.address))
//         .to.be.revertedWith('Ownable: caller is not the owner')

//         await expect(cake.connect(bob).transferOwnership(carol.address))
//         .to.be.revertedWith('Ownable: caller is not the owner')
//     })
// })