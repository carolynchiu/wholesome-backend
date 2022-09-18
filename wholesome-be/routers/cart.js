const express = require("express");
const router = express.Router();
const pool = require("../utils/database");

router.post("/:userId", async (req, res) => {
  // --- (1) 確認資料有沒有收到
  console.log("購物車", req.body);
  let userId = req.params.userId;
  console.log(userId);
  // --- (2)檢查購物車資料表是否為空
  // let [cartItemCount] = await pool.execute(
  //   "SELECT count(*) AS cartItem FROM `cart`"
  // );
  // console.log(cartItemCount);
  // 第一筆加入購物車的商品
  // if (req.body.length === 0) res.json({ message: "購物車無商品" });
  // if (req.body.length === 1) {
  //   let result = await pool.execute(
  //     "INSERT INTO cart (product_id, user_id, amount) VALUES (?,?,?)",
  //     [req.body[0].id, userId, 1]
  //   );
  // }
  // --- (2) 檢查購物車資料表是否有這筆商品
  // let newAddItem = req.body.pop();
  // console.log("新增的商品", newAddItem);
  // let [cart] = await pool.execute("SELECT * FROM cart WHERE product_id = ?", [
  //   newAddItem.id,
  // ]);
  // if (cart.length > 0) res.json({ message: "商品已存在於購物車" });
  // // --- (3) 把商品資料存到購物車資料表
  // let result = await pool.execute(
  //   "INSERT INTO cart (product_id, user_id, amount) VALUES (?,?,?)",
  //   [newAddItem.id, userId, 1]
  // );
  // res.json({ message: "購物車新增成功" });
});

module.exports = router;
