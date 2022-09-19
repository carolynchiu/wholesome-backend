const express = require("express");
const router = express.Router();
const pool = require("../utils/database");

router.put('/:userId', async (req, res, next ) => {
  let userId = req.params.userId
  console.log('user',userId)
  let productId = req.query.productId
  console.log("productId in be", productId);
  let isLike = req.query.isLike 
  
  let likeData = await pool.execute('SELECT valid AS valid FROM user_like_product WHERE  user_id = ? AND  product_id = ?',[userId, productId])
  console.log('checkData',likeData)


  // let [update] = await pool.execute('UPDATE user_like_product SET valid =? WHERE  user_id = ? AND  product_id = ?',[isLike, userId, productId])
  // console.log('upDateData', update)

  // let [insert] = await pool.execute('INSERT INTO user_like_product (user_id, product_id, valid) VALUES (?, ?, ?)',[userId, productId, 1])

  res.json({message: 'update success'})
})

router.post('/:userId', async (req, res, next) => {
  let userId = req.params.userId
  console.log('user',userId)
  let productId = req.query.productId
  console.log("productId in be", productId);

  

  res.json({message:'insert success'})
} )



module.exports = router;
