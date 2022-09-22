const productDetailModel = require("../models/productDetail");

// 商品細節頁
async function getProductDetail(req, res, next) {
 
  //前端送出請求時帶的參數:productId
  const productId = req.params.productId;

  //商品細節資料
  let productData = await productDetailModel.getSingleProduct(productId);

  let categoryId = parseInt(productData.map((v) => v.category_id));

  //商品評分
  let productComment = await productDetailModel.getProductComment(
    productId,
  );

  let eachStar = productComment.map((v) => v.grade);
  let starCount = eachStar.length;

  eachStar.length > 0
    ? (totalScore = eachStar.reduce((p, n) => p + n))
    : (totalScore = 0);

  eachStar.length > 0
    ? (average = (totalScore / starCount).toFixed(1))
    : (average = 0);
 
  //相關商品
  let relatedGoods = await productDetailModel.getRelatedGoods(categoryId,productId);

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
}

module.exports = { getProductDetail};
