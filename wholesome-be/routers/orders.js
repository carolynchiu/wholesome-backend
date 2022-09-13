const express = require("express");
const router = express.Router();
const pool = require("../utils/database");

router.get("/:orderId", async (req, res) => {
  const orderId = req.params.orderId;
  console.log(`這裡是 orderId=${orderId}的訂單頁`);
  res.json({});
});

module.exports = router;
