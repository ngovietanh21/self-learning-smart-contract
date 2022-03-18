# PanCake Farming

## Installing Node.js (google)

### Install dependency
```
npm install
```

## Run local
```
npx hardhat node
```

## Run test

```
npx hardhat test
```

### Smart Contract

#### SyrupBar

#### MasterChef
- Thực hiện add liquidity pool vào pool (
    _allocPoint là cái gì? số token ban đầu của pool?
    tại sao phải cần lưu lại lastRewardBlock
).
- CakePerBlock: Sau khi được có CakePerBlock thì sẽ tạo 1 token Cake.
- startBlock: Số thứ tự của block khi bắt đầu đào CAKE.

- PoolInfo
    - allocPoint: How many allocation points assigned to this pool. CAKEs to distribute per block.
    - lastRewardBlock: số Block cuối mà tặng thưởng CAKE
    - accCakePerShare: Accumulated CAKEs per share, times 1e12

- Bất cứ thời điểm nào, số lượng CAKE đang chờ về được tính
    ```
    pending reward = (user.amount * pool.accCakePerShare) - user.rewardDebt
    ```

- Khi user nạp hoặc rút tiền
    1. Update accCakePerShare và lastRewardBlock của pool
    2. User nhận pending reward
    3. Update amount và rewardDebt của user

- Tại sao phải mint cho dev lúc updatePool?
- Tại sao lpToken lại có safeTransferFrom <-> library trong MasterChef using SafeBEP20 for IBEP20
- Khi user nạp tiền
    - Số dư hiện tại trong pool > 0 thì thưởng Cake Token
    - Update rewardDebt
- Khi user rút tiền
    - Tính pending từ user.amount để thưởng cake token
    - Update rewardDebt
- Khi user enterStaking
    - giống như nạp tiền, nhưng nó dành cho pool 0, pool khởi tạo ban đầu
- Khi user leaveStaking
    - giống như rút tiền, nhưng nó dành cho pool 0, pool khởi tạo ban đầu



#### SousChef