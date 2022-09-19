const express = require("express");
const router = express.Router();
const pool = require("../utils/database");

// 查看使用者有沒有收藏這筆產品
router.get("/:userId", async (req, res) => {
  let userId = req.params.userId;
  let productId = req.query.product;
  console.log("使用者ID", userId, "商品ID", productId);
  let [data] = await pool.execute(
    "SELECT * FROM `user_like_product` WHERE user_id = ? AND product_id= ? ;",
    [userId, productId]
  );
  console.log("收藏", data);
  if (data.length === 0) res.json({ isLike: false });
  if (data.length > 0) res.json({ isLike: true });
});

router.post("/:userId", async (req, res) => {
  console.log("收藏產品id", req.body);
  let userId = req.params.userId;
  let productId = req.body.product_id;
  console.log("使用者ID", userId, "商品ID", productId);

  // --- (1) 檢查有沒有這筆收藏
  let [data] = await pool.execute(
    "SELECT * FROM `user_like_product` WHERE user_id = ? AND product_id= ? ;",
    [userId, productId]
  );
  if (data.length > 0) res.json({ isLike: true });

  // --- (2) 把這筆收藏存進資料庫

  let [NewData] = await pool.execute(
    "INSERT INTO `user_like_product` (user_id, product_id) VALUES (?, ?)",
    [userId, productId]
  );
  console.log("新增的收藏", NewData);

  res.json({ isLike: true });
});

router.delete("/:userId", async (req, res) => {
  let userId = req.params.userId;
  let productId = req.query.product;
  console.log("使用者ID", userId, "商品ID", productId);
  //刪除這筆收藏
  let [data] = await pool.execute(
    "DELETE FROM `user_like_product` WHERE user_id = ? AND product_id = ?",
    [userId, productId]
  );
  console.log("刪除的收藏", data);

  res.json({ isLike: false });
});

module.exports = router;
