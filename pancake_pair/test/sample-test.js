// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const { BigNumber } = require("ethers");

// function expandTo18Decimals(n) {
//   return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
// }

// const MINIMUM_LIQUIDITY = BigNumber.from(10).pow(3)

// describe('Pair', function () {
//   let deployer, person1, person2, person3
//   let token0, token1, factory, pair

//     beforeEach(async () => {
        // [deployer, person1, person2, person3] = await ethers.getSigners()
        // const PancakeFactory = await ethers.getContractFactory('PancakeFactory')
        // const ERC20 = await ethers.getContractFactory('ERC20')
        // const Pair = await ethers.getContractFactory('PancakePair')

        // const tokenA = await ERC20.connect(deployer).deploy(expandTo18Decimals(10000))
        // const tokenB = await ERC20.connect(deployer).deploy(expandTo18Decimals(10000))

        // factory = await PancakeFactory.deploy(deployer.address)
        // await factory.createPair(tokenA.address, tokenB.address)  // Đã deploy Pair

        // const pairAddress = await factory.getPair(tokenA.address, tokenB.address)
        // pair = await Pair.attach(pairAddress)  // Attach: load smart contract đã được deploy

        // const token0Address = (await pair.token0()).address
        // token0 = tokenA.address === token0Address ? tokenA : tokenB
        // token1 = tokenA.address === token0Address ? tokenB : tokenA
//     })

//     async function addLiquidity(token0Amount, token1Amount) {
//       // Chuyển đến địa chỉ pair token0 1 lượng token0Amount
//       await token0.transfer(pair.address, token0Amount)
//        // Chuyển đến địa chỉ pair token1 1 lượng token1Amount
//       await token1.transfer(pair.address, token1Amount)
//       // Tạo cặp pair
//       await pair.mint(deployer.address)

//       const a = await pair.getReserves()
//       console.log(a)
//     }

//     // it('mint', async () => {
//     //   const token0Amount = expandTo18Decimals(1)
//     //   const token1Amount = expandTo18Decimals(4)

//     //   await addLiquidity(token0Amount, token1Amount)
  
//     //   const expectedLiquidity = expandTo18Decimals(2)
//     //   expect(await pair.totalSupply()).to.eq(expectedLiquidity)
//     //   expect(await pair.balanceOf(deployer.address)).to.eq(expectedLiquidity.sub(MINIMUM_LIQUIDITY))
//     //   expect(await token0.balanceOf(pair.address)).to.eq(token0Amount)
//     //   expect(await token1.balanceOf(pair.address)).to.eq(token1Amount)
//       // const reserves = await pair.getReserves()
//       // expect(reserves[0]).to.eq(token0Amount)
//       // expect(reserves[1]).to.eq(token1Amount)
//    // })

//   const swapTestCases = [
//     //[1, 5, 10, '1663887962654218072'],
//     // [1, 10, 5, '453718857974177123'],

//     // [2, 5, 10, '2853058890794739851'],
//     // [2, 10, 5, '831943981327109036'],

//     // [1, 10, 10, '907437715948354246'],
//     // [1, 100, 100, '988138378977801540'],
//     // [1, 1000, 1000, '997004989020957084']
//   ].map(a => a.map(n => (typeof n === 'string' ? BigNumber.from(n) : expandTo18Decimals(n))))

//   swapTestCases.forEach((swapTestCase, i) => {
//     it(`getInputPrice:${i}`, async () => {
//       const [swapAmount, token0Amount, token1Amount, expectedOutputAmount] = swapTestCase
//       await addLiquidity(token0Amount, token1Amount)
//       await token0.transfer(pair.address, swapAmount)

//       await expect(pair.swap(0, expectedOutputAmount.add(1), deployer.address, '0x'))
//       .to.be.revertedWith('Pancake: K')
      
//       await pair.swap(0, expectedOutputAmount, deployer.address, '0x')
//     })
//   })

//   // it('swap:token0', async () => {
//   //   const token0Amount = expandTo18Decimals(5)
//   //   const token1Amount = expandTo18Decimals(10)
//   //   await addLiquidity(token0Amount, token1Amount)

//   //   const swapAmount = expandTo18Decimals(1)
//   //   const expectedOutputAmount = BigNumber.from('1662497915624478906')

//   //   await token0.transfer(pair.address, swapAmount)
//   //   await expect(await pair.swap(0, expectedOutputAmount, deployer.address, '0x'))
//   //     .to.emit(token1, 'Transfer')
//   //     .withArgs(pair.address, deployer.address, expectedOutputAmount)
//   //     .to.emit(pair, 'Sync')
//   //     .withArgs(token0Amount.add(swapAmount), token1Amount.sub(expectedOutputAmount))
//   //     .to.emit(pair, 'Swap')
//   //     .withArgs(deployer.address, swapAmount, 0, 0, expectedOutputAmount, deployer.address)

//   //   const reserves = await pair.getReserves()
//   //   expect(reserves[0]).to.eq(token0Amount.add(swapAmount))
//   //   expect(reserves[1]).to.eq(token1Amount.sub(expectedOutputAmount))

//   //   expect(await token0.balanceOf(pair.address)).to.eq(token0Amount.add(swapAmount))
//   //   expect(await token1.balanceOf(pair.address)).to.eq(token1Amount.sub(expectedOutputAmount))

//   //   const totalSupplyToken0 = await token0.totalSupply()
//   //   const totalSupplyToken1 = await token1.totalSupply()
//   //   expect(await token0.balanceOf(deployer.address)).to.eq(totalSupplyToken0.sub(token0Amount).sub(swapAmount))
//   //   expect(await token1.balanceOf(deployer.address)).to.eq(totalSupplyToken1.sub(token1Amount).add(expectedOutputAmount))
//   // })

//   it('swap:token0', async () => {
//     const token0Amount = 5000000
//     const token1Amount = 10000000
//     await addLiquidity(token0Amount, token1Amount)

//     const balanceDeployer0 = await token0.balanceOf(deployer.address)
//     const balanceDeployer1 = await token1.balanceOf(deployer.address)
//     console.log(balanceDeployer0)
//     console.log(balanceDeployer1)

//     const swapAmountToken1 = 10
//     const expectedOutputAmount = 16624

//     await pair.swap(0, swapAmountToken1, deployer.address, '0x')
//     const balanceDeployer = await token1.balanceOf(deployer.address)
//     console.log(balanceDeployer)
//     // await expect(await pair.swap(0, expectedOutputAmount, deployer.address, '0x'))
//     //   .to.emit(token1, 'Transfer')
//     //   .withArgs(pair.address, deployer.address, expectedOutputAmount)
//     //   .to.emit(pair, 'Sync')
//     //   .withArgs(token0Amount + swapAmount , token1Amount - expectedOutputAmount)
//     //   .to.emit(pair, 'Swap')
//     //   .withArgs(deployer.address, swapAmount, 0, 0, expectedOutputAmount, deployer.address)

//     // const reserves = await pair.getReserves()
//     // expect(reserves[0]).to.eq(token0Amount + swapAmount)
//     // expect(reserves[1]).to.eq(token1Amount - expectedOutputAmount)

//     // expect(await token0.balanceOf(pair.address)).to.eq(token0Amount.add(swapAmount))
//     // expect(await token1.balanceOf(pair.address)).to.eq(token1Amount.sub(expectedOutputAmount))

//     // const totalSupplyToken0 = await token0.totalSupply()
//     // const totalSupplyToken1 = await token1.totalSupply()
//     // expect(await token0.balanceOf(deployer.address)).to.eq(totalSupplyToken0.sub(token0Amount).sub(swapAmount))
//     // expect(await token1.balanceOf(deployer.address)).to.eq(totalSupplyToken1.sub(token1Amount).add(expectedOutputAmount))
//   })
// })