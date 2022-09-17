const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products");

// 商品列表頁
router.get("/", productsController.getProductList);

// 商品細節頁
//TODO: 路徑之後可能要改
router.get("/:productId", productsController.getProductDetail);

//
module.exports = router;
