
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber, MaxUint256 } = require("ethers");

function expandTo18Decimals(n) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}

const MINIMUM_LIQUIDITY = BigNumber.from(10).pow(3)
const AddressZero = '0x0000000000000000000000000000000000000000'

describe('Pair', function () {
    let deployer, person1, person2, person3
    let token0, token1, factory, pair, WETHPair

    beforeEach(async () => {
        [deployer, person1, person2, person3] = await ethers.getSigners()
        // contract
        const ERC20 = await ethers.getContractFactory('ERC20')
        const PancakeFactory = await ethers.getContractFactory('PancakeFactory')
        const Pair = await ethers.getContractFactory('PancakePair')

        // deploy tokens
        const tokenA = await ERC20.connect(deployer).deploy(expandTo18Decimals(10000))
        const tokenB = await ERC20.connect(deployer).deploy(expandTo18Decimals(10000))

        // Factory
        factory = await PancakeFactory.deploy(deployer.address)
        
        // CreatePair
        await factory.createPair(tokenA.address, tokenB.address)
        const pairAddress = await factory.getPair(tokenA.address, tokenB.address)
        pair = await Pair.attach(pairAddress)
        
        const token0Address = (await pair.token0()).address
        token0 = tokenA.address === token0Address ? tokenA : tokenB
        token1 = tokenA.address === token0Address ? tokenB : tokenA
    })

    async function addLiquidity(token0Amount, token1Amount) {
      // Chuyển đến địa chỉ pair token0 1 lượng token0Amount
      await token0.transfer(pair.address, token0Amount)
       // Chuyển đến địa chỉ pair token1 1 lượng token1Amount
      await token1.transfer(pair.address, token1Amount)
      // Tạo cặp pair
      await pair.mint(deployer.address)
    }

  //   it('mint', async () => {
  //     const token0Amount = expandTo18Decimals(1)
  //     const token1Amount = expandTo18Decimals(4)

  //     await addLiquidity(token0Amount, token1Amount)
      
  //     // Căn bậc 2 của 1 * 4
  //     const expectedLiquidity = expandTo18Decimals(2)
  //     expect(await pair.totalSupply()).to.eq(expectedLiquidity)
  //     expect(await pair.balanceOf(deployer.address)).to.eq(expectedLiquidity.sub(MINIMUM_LIQUIDITY))
  //     expect(await token0.balanceOf(pair.address)).to.eq(token0Amount)
  //     expect(await token1.balanceOf(pair.address)).to.eq(token1Amount)
  //     // const reserves = await pair.getReserves()
  //     // expect(reserves[0]).to.eq(token0Amount)
  //     // expect(reserves[1]).to.eq(token1Amount)
  //  })

   it('swap:token0', async () => {
    // const token0Amount = expandTo18Decimals(5)
    // const token1Amount = expandTo18Decimals(10)
    const token0Amount =  expandTo18Decimals(10)
    const token1Amount = expandTo18Decimals(20)

    await addLiquidity(token0Amount, token1Amount)
    // Bằng tỷ lệ ban đầu
    // 10 a 20 b -> 10 * 20 = 200
    // nap vao a 5 -> 15 a
    // swap muốn lấy b -> đẩy a 20 * 10 / 15 = 13,3333 số lượng b còn lại, đc nhận 20 - 13,3333 = ...
    const swapAmount =  expandTo18Decimals(5)
    const expectedOutputAmount = token1Amount.sub(token0Amount.mul(token1Amount).div(token0Amount.add(swapAmount)))
    console.log(expectedOutputAmount)
    await token0.transfer(pair.address, swapAmount)
    await pair.swap(0, expectedOutputAmount, deployer.address, '0x')
    // await expect(pair.swap(0, expectedOutputAmount, deployer.address, '0x'))
    //   .to.emit(token1, 'Transfer')
    //   .withArgs(pair.address, deployer.address, expectedOutputAmount)
    //   .to.emit(pair, 'Sync')
    //   .withArgs(token0Amount.add(swapAmount), token1Amount.sub(expectedOutputAmount))
    //   .to.emit(pair, 'Swap')
    //   .withArgs(deployer.address, swapAmount, 0, 0, expectedOutputAmount, deployer.address)

    // const reserves = await pair.getReserves()
    // expect(reserves[0]).to.eq(token0Amount.add(swapAmount))
    // expect(reserves[1]).to.eq(token1Amount.sub(expectedOutputAmount))
    // expect(await token0.balanceOf(pair.address)).to.eq(token0Amount.add(swapAmount))
    // expect(await token1.balanceOf(pair.address)).to.eq(token1Amount.sub(expectedOutputAmount))
    // const totalSupplyToken0 = await token0.totalSupply()
    // const totalSupplyToken1 = await token1.totalSupply()
    // expect(await token0.balanceOf(wallet.address)).to.eq(totalSupplyToken0.sub(token0Amount).sub(swapAmount))
    // expect(await token1.balanceOf(wallet.address)).to.eq(totalSupplyToken1.sub(token1Amount).add(expectedOutputAmount))
  })
})