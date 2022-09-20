const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products");

// 商品列表頁
router.get("/", productsController.getProductList);

module.exports = router;
