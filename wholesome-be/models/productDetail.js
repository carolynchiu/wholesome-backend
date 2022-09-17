const pool = require("../utils/database");

// 商品細節頁- 商品資訊
async function getSingleProduct(productId) {
  let [data] = await pool.execute(
    "SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE id = ?",
    [productId]
  );
  console.log("single product data", data);
  console.log("data.main_category", data[0].main_category);
  if (data.length > 0) {
    return data;
  } else {
    console.log("no data");
    return null;
  }
}
//評論資訊
async function getProductComment(productId) {
  let [data] = await pool.execute(
    "SELECT products_comment.id, products_comment.product_id, products_comment.comment, products_comment.grade, products_comment.user_id, products_comment.time , users.name FROM products_comment INNER JOIN users ON products_comment.user_id = users.id WHERE product_id = ? ORDER BY grade DESC ",
    [productId]
  );
  return data;
}

module.exports = { getSingleProduct, getProductComment };
