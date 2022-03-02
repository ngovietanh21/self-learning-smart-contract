const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken contract", function () {
  let myToken
  let pool
  let owner
  let director
  let deputyDirector
  let normalPerson
  const poolTotalSupply = 5000

  beforeEach(async function () {
    [owner, director, deputyDirector, normalPerson] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MyToken")
    const Pool = await ethers.getContractFactory("Pool")

    myToken = await Token.connect(owner).deploy()
    pool = await Pool.connect(owner).deploy(myToken.address)

    await pool.connect(owner).grantRole(await pool.DIRECTOR(), director.address)
    await pool.connect(owner).grantRole(await pool.DEPUTY_DIRECTOR(), deputyDirector.address)

    await myToken.connect(owner).transfer(pool.address, poolTotalSupply)
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await myToken.getOwner()).to.equal(owner.address)
    });
  });

   describe("Transactions", function () {
    it("Admin transfer tokens between accounts", async function () {
      await pool.connect(owner).transfer(director.address, 50)
      const directorBalance = await myToken.balanceOf(director.address)
      expect(directorBalance).to.equal(50)

      await pool.connect(owner).transfer(deputyDirector.address, 100)
      const deputyDirectorBalance = await myToken.balanceOf(deputyDirector.address)
      expect(deputyDirectorBalance).to.equal(100)
    });

    it("Director can transfer unlimited token", async function () {
      const tranferValue = 1100
      await pool.connect(director).transfer(deputyDirector.address, tranferValue)
      const deputyDirectorBalance = await myToken.balanceOf(deputyDirector.address)
      expect(deputyDirectorBalance).to.equal(tranferValue)

      const remain = poolTotalSupply - tranferValue
      const poolBalance = await myToken.balanceOf(pool.address)
      expect(poolBalance).to.equal(remain)
    });

    it("Deputy Director can transfer maxium 1000 token", async function () {
      await pool.connect(deputyDirector).transfer(director.address, 800)
      const directorBalance = await myToken.balanceOf(director.address)
      expect(directorBalance).to.equal(800)

      await expect(pool.connect(deputyDirector).transfer(normalPerson.address, 1100))
      .to.be.revertedWith('Cannot tranfer maxium amount')
    });

    it("Normal Percon can not transfer token", async function () {
      await expect(pool.connect(normalPerson).transfer(deputyDirector.address, 1100))
      .to.be.revertedWith('Cannot tranfer money')
    });

    it("Can not transfer amount exceeds pool total supply", async function () {
      const tranferValue = 800
      await pool.connect(deputyDirector).transfer(director.address, tranferValue)

      const remain = poolTotalSupply - tranferValue
      await expect(pool.connect(director).transfer(deputyDirector.address, remain + 1))
      .to.be.revertedWith('transfer amount exceeds balance');
    });
   });
});
