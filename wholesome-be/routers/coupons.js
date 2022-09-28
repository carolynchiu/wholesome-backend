const { compareSync } = require("bcrypt");
const express = require("express");
const router = express.Router();
const pool = require("../utils/database");

router.get("/:couponId", async (req, res) => {
  let couponId = +req.params.couponId;
  console.log(couponId);
  let [coupon] = await pool.execute("SELECT * FROM `coupons` WHERE id=?", [
    couponId,
  ]);

  res.json(coupon);
});

module.exports = router;
