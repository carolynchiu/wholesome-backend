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
  // if (req.body.length === 0) {
  //   let result = await pool.execute(
  //     "INSERT INTO cart (product_id, user_id, amount) VALUES (?,?,?)",
  //     [newAddProd, userId, 1]
  //   );
  // }
  // --- (2) 檢查購物車資料表是否有這筆商品
  // let newAddProduct = req.body.pop();
  // console.log("新增的商品", newAddProduct);
  // let [cart] = await pool.execute("SELECT * FROM cart WHERE product_id = ?", [
  //   newAddProduct.id,
  // ]);
  // if (cart.length > 0) res.json({ message: "商品已存在於購物車" });
  // // --- (3) 把商品資料存到購物車資料表
  // let result = await pool.execute(
  //   "INSERT INTO cart (product_id, user_id, amount) VALUES (?,?,?)",
  //   [newAddProduct.id, userId, 1]
  // );
  res.json({ message: "購物車新增成功" });
});

module.exports = router;
