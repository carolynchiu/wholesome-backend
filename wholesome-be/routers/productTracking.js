const express = require("express");
const router = express.Router();
const pool = require("../utils/database");

////// 查看使用者有沒有收藏這筆產品
router.get("/:userId", async (req, res) => {
  let userId = req.params.userId;
  let productId = req.query.product;
  console.log("使用者ID", userId, "商品ID", productId);
  let [data] = await pool.execute(
    "SELECT * FROM `user_like_product` WHERE user_id = ? AND product_id= ? ;",
    [userId, productId]
  );
  console.log("===收藏===", data);

  // 如果有 .............. 回覆 false
  if (data.length === 0) res.json({ isLike: false });
  // 如果沒有 ......... 回覆 true
  if (data.length > 0) res.json({ isLike: true });
});

////// 加入收藏 -> 存入資料庫
router.post("/:userId", async (req, res) => {
  console.log("收藏產品id", req.body);
  let userId = req.params.userId;
  let productId = req.body.product_id;
  console.log("使用者ID", userId, "商品ID", productId);

  // --- (1) 檢查有沒有這筆收藏 (其實可以不要這個步驟？ 因為前端有擋 ?)
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

////// 移除收藏 -> 從資料庫移除這筆資料
router.delete("/:userId", async (req, res) => {
  let userId = req.params.userId;
  let productId = req.query.product;
  console.log("使用者ID", userId, "商品ID", productId);

  // --- (1) 刪除這筆收藏
  let [data] = await pool.execute(
    "DELETE FROM `user_like_product` WHERE user_id = ? AND product_id = ?",
    [userId, productId]
  );
  console.log("刪除的收藏", data);

  res.json({ isLike: false });
});

module.exports = router;
