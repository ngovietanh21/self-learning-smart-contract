// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("CakeToken", function () {
//     let alice, minter
//     let cake

//     beforeEach(async function () {
//         [alice, minter] = await ethers.getSigners()
//         // contract
//         const CakeToken = await ethers.getContractFactory('CakeToken')

//         // deploy tokens
//         cake = await CakeToken.connect(minter).deploy()
//     })

//     it('mint', async function () {
//         await cake.connect(minter).mint(alice.address, 1000)
//         expect(await cake.balanceOf(alice.address)).to.eq(1000)
//     });
// });