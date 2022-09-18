const productDetailModel = require("../models/productDetail");

// 商品細節頁
async function getProductDetail(req, res, next) {

  const isLike= req.query.like
  console.log('isLike',isLike)

  const userId = req.query.user
  console.log('user',userId)

  //前端送出請求時帶的參數:productId
  const productId = req.params.productId;
  console.log("productId in be", productId);

  //先讀likeList 是否有這個使用者的這個產品收藏資料
  let likeData = await productDetailModel.getLikeLIst(userId, productId)
  // console.log('likeList', getLikeLIst)
  // console.log("getLikeList",getLikeLIst.length)

  // if (getLikeLIst.length < 0) {
  //   //如果沒有資料則回傳否
  //   likeData = false
  //   productDetailModel.newLIke(userId, productId)
  // } else {
  //   likeData = productDetailModel.updateLike(isLike, userId, productId)
  // }    

  const page = req.query.page || 1

  let productData = await productDetailModel.getSingleProduct(productId);
  // console.log("productData", productData);

  let categoryId =parseInt(productData.map((v)=>v.category_id))
  console.log('category',categoryId)


  
  const perPage = 5;

  let total = await productDetailModel.getCommentCount(productId)
  // console.log("commentCount",total)

  let totalPage = Math.ceil(total / perPage);
  
  // 計算offset
  const offset = perPage * (page - 1)
  console.log('offset',offset)
  console.log('perPage',perPage)
  
  let productComment = await productDetailModel.getProductComment(productId, perPage, offset);
  // console.log('productComment',productComment.length)

  
  let eachStar = productComment.map((v) => v.grade);
  let starCount = eachStar.length;

  eachStar.length > 0
    ? (totalScore = eachStar.reduce((p, n) => p + n))
    : (totalScore = 0);

  eachStar.length > 0
    ? (average = (totalScore / starCount).toFixed(1))
    : (average = 0);
  console.log("eachStar", eachStar);
  console.log(totalScore);
  console.log(starCount);
  console.log(average);

  let relatedGoods = await productDetailModel.getRelatedGoods(categoryId, productId)
  // console.log('related goods', relatedGoods)

  res.json({
    productData,
    pagination:{
      total,
      perPage,
      page,
      totalPage,
    },
    comment: {
      productComment,
      eachStar,
      totalScore,
      starCount,
      average,
    },
    relatedGoods,

    likeData,
  });
}

module.exports = { getProductDetail };
