const express = require("express");
const router = express.Router();

const detailController = require("../controllers/productDetail");

// 商品細節頁
router.get("/:productId", detailController.getProductDetail);

module.exports = router;
