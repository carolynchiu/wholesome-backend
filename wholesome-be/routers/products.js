const express = require("express");
const router = express.Router();
const pool = require("../utils/database");

//列出所有商品
router.get("/", async (req, res) => {
  console.log("這裡是所有商品列表頁");
  let [data] = await pool.execute("SELECT * FROM products");
  // console.log("data", data);
  res.json(data);
});

//列出某類別的商品資料
router.get("/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  console.log(`這裡categoryId=${categoryId}的商品列表頁`);
  let [data] = await pool.execute(
    "SELECT * FROM products WHERE category_id=?",
    [categoryId]
  );
  // console.log("data", data);
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
