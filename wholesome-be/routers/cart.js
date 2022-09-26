const express = require("express");
const router = express.Router();
const pool = require("../utils/database");
const dayjs = require("dayjs");

router.post("/:userId", async (req, res) => {
  console.log(req.body);
  const user_id = req.body.user.id;
  const coupon_id = req.body.selectCoupon;
  const receiver_name = req.body.receiver.receiver_name;
  const receiver_phone = req.body.receiver.receiver_phone;
  const receiver_address = req.body.receiver.receiver_address;
  const total_price = req.body.cartTotalPrice;
  const create_time = dayjs(new Date().toISOString()).format(
    "YYYY-MM-DD HH:mm:ss"
  );

  // 要insert進資料庫的最新一筆orderId
  let [order_length] = await pool.execute(
    "SELECT COUNT(*) AS total FROM order_list"
  );
  const newestOrderId = order_length[0].total + 1;
  const date = dayjs(new Date().toISOString()).format("YYYYMMDD");
  const order_sn =
    `W` + `${date}` + "O" + `${newestOrderId}` + "U" + `${user_id}`;

  // insert 進 order_list
  let data = await pool.execute(
    "INSERT INTO order_list (order_sn , user_id, coupon_id, status_id , total_price, valid, receiver_name, receiver_phone, receiver_address, create_time  ) VALUES(?,?,?,?,?,?,?,?,?,?)",
    [
      order_sn,
      user_id,
      coupon_id,
      3,
      total_price,
      1,
      receiver_name,
      receiver_phone,
      receiver_address,
      create_time,
    ]
  );

  const cart = req.body.cart.map((v, i) => {
    return [newestOrderId, v.id, v.price, v.amount];
  });
  console.log("cart array", cart);

  //insert 進 order_detail
  let detail = await pool.query(
    "INSERT INTO order_detail (order_id, product_id, product_price, amount ) VALUES ? ",
    [cart]
  );

  // 修改使用者 coupon 使用狀態 ---> valid = 0
  let updateCouponValid = await pool.execute(
    "UPDATE `coupons_get` SET `valid` = '0' WHERE user_id = ? AND coupon_id = ?",
    [user_id, coupon_id]
  );

  res.json({ newestOrderId, message: "結帳成功" });
});

module.exports = router;
