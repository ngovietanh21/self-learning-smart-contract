const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken contract", function () {
  let myToken;
  let owner;
  let director;
  let deputyDirector;
  let normalPerson;

  beforeEach(async function () {
    [owner, director, deputyDirector, normalPerson] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MyToken");
    myToken = await Token.connect(owner).deploy();

    await myToken.connect(owner).grantRole(await myToken.DIRECTOR(), director.address)
    await myToken.connect(owner).grantRole(await myToken.DEPUTY_DIRECTOR(), deputyDirector.address)
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await myToken.getOwner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await myToken.balanceOf(owner.address);
      expect(await myToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Admin transfer tokens between accounts", async function () {
      await myToken.transfer(director.address, 50);
      const directorBalance = await myToken.balanceOf(director.address);
      expect(directorBalance).to.equal(50);

      await myToken.transfer(deputyDirector.address, 100);
      const deputyDirectorBalance = await myToken.balanceOf(deputyDirector.address);
      expect(deputyDirectorBalance).to.equal(100);
    });

    it("Director can transfer unlimited token", async function () {
      await myToken.connect(owner).transfer(director.address, 3000);
      const directorBalance = await myToken.balanceOf(director.address);
      expect(directorBalance).to.equal(3000);

      await myToken.connect(director).transfer(deputyDirector.address, 1100);
      const deputyDirectorBalance = await myToken.balanceOf(deputyDirector.address);
      expect(deputyDirectorBalance).to.equal(1100);
    });

    it("Deputy Director can transfer maxium 1000 token", async function () {
      await myToken.connect(owner).transfer(deputyDirector.address, 3000);
      const deputyDirectorBalance = await myToken.balanceOf(deputyDirector.address);
      expect(deputyDirectorBalance).to.equal(3000);

      await myToken.connect(deputyDirector).transfer(director.address, 800);
      const directorBalance = await myToken.balanceOf(director.address);
      expect(directorBalance).to.equal(800);

      await expect(myToken.connect(deputyDirector).transfer(normalPerson.address, 1100))
      .to.be.revertedWith('Cannot tranfer maxium amount');
    });

    it("Normal Percon can not transfer token", async function () {
      await myToken.connect(owner).transfer(normalPerson.address, 3000);
      const normalPersonBalance = await myToken.balanceOf(normalPerson.address);
      expect(normalPersonBalance).to.equal(3000);

      await expect(myToken.connect(normalPerson).transfer(owner.address, 1100))
      .to.be.revertedWith('Cannot tranfer money');
    });

    it("Can not transfer amount exceeds balance", async function () {
      await myToken.connect(owner).transfer(director.address, 1000);
      const directorBalance = await myToken.balanceOf(director.address);
      expect(directorBalance).to.equal(1000);

      await myToken.connect(director).transfer(normalPerson.address, 800);
      const normalPerconBalance = await myToken.balanceOf(normalPerson.address);
      expect(normalPerconBalance).to.equal(800);

      await expect(myToken.connect(director).transfer(deputyDirector.address, 201))
      .to.be.revertedWith('transfer amount exceeds balance');
    });
  });
});
