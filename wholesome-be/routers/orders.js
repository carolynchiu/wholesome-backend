const { compareSync } = require("bcrypt");
const express = require("express");
const router = express.Router();
const pool = require("../utils/database");

// 取得某筆訂單的資料
router.get("/:orderId", async (req, res) => {
  const orderId = req.params.orderId;
  console.log(`這裡是 orderId=${orderId}的訂單頁`);
  let [orderData] = await pool.execute(
    "SELECT order_list.*,coupons.name AS coupon_name, coupons.discount_price AS coupon_price FROM order_list LEFT JOIN coupons ON order_list.coupon_id =coupons.id WHERE order_list.id=?",
    [orderId]
  );
  // 訂單明細資料
  let [orderDetaildata] = await pool.execute(
    "SELECT * FROM `order_detail` JOIN order_list ON order_detail.order_id=order_list.id JOIN products ON order_detail.product_id=products.id WHERE order_detail.order_id=?",
    [orderId]
  );
  console.log(orderData);
  res.json({ orderData: orderData, orderDetail: orderDetaildata });
});

module.exports = router;
