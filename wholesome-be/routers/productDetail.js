const express = require("express");
const router = express.Router();
const pool = require("../utils/database");

//列出某類別的商品資料
router.get("/:productId", async (req, res) => {
  const productId = req.params.productId;
  console.log("這裡是商品詳細表頁");
  let [data] = await pool.execute("SELECT * FROM products WHERE id = ?", [
    productId,
  ]);
  console.log("data", data);
  res.json(data);
});

//列出杏仁奶商品資料
// router.get("/api/1.0/products/2", async (req, res) => {
//   console.log("這裡是商品列表頁");
//   let [data] = await pool.execute(
//     "SELECT * FROM products WHERE category_id = 2"
//   );
//   console.log("data", data);
//   res.json(data);
// });

module.exports = router;
