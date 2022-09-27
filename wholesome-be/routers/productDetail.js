const express = require("express");
const router = express.Router();
const pool = require('../utils/database')


// 商品細節頁
router.get("/:productId", async(req,res,next) => {
  const productId = req.params.productId;

  //商品細節資料
  let [productData] = await pool.execute("SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE id = ?",[productId]);

  let categoryId = parseInt(productData.map((v) => v.category_id));

  //商品評分
  let [productComment] = await pool.execute(
    "SELECT products_comment.id, products_comment.product_id, products_comment.comment, products_comment.grade, products_comment.user_id, products_comment.time , users.name FROM products_comment INNER JOIN users ON products_comment.user_id = users.id WHERE product_id = ? ORDER BY grade DESC ",[productId]);

  let eachStar = productComment.map((v) => v.grade);
  let starCount = eachStar.length;

  eachStar.length > 0
    ? (totalScore = eachStar.reduce((p, n) => p + n))
    : (totalScore = 0);

  eachStar.length > 0
    ? (average = (totalScore / starCount).toFixed(1))
    : (average = 0);
 
  //相關商品
  let [relatedGoods] = await pool.execute('SELECT * FROM products WHERE category_id = ? AND id != ?',[categoryId, productId])

  res.json({
    productData,
    stars: {
      eachStar,
      totalScore,
      starCount,
      average,
    },
    relatedGoods,
  });
});

module.exports = router;
