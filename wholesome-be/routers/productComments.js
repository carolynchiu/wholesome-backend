const express = require('express')
const router = express.Router()
const pool = require('../utils/database')




router.get('/:productId', async (req, res,next) => {

  const productId = req.params.productId

  const page = req.query.page || 1

  //評論總數
  let [total] = await pool.execute("SELECT COUNT(*) AS total FROM products_comment WHERE product_id = ? ",[productId])
  let commentTotal = total[0].total
  console.log('commentTotal',commentTotal)

  const perPage = 5;

  let totalPage = Math.ceil(commentTotal / perPage);

  const offset = perPage * (page - 1);

  //評論資
  let [commentData] = await pool.execute(
    "SELECT products_comment.id, products_comment.product_id, products_comment.comment, products_comment.grade, products_comment.user_id, products_comment.time , users.name FROM products_comment INNER JOIN users ON products_comment.user_id = users.id WHERE product_id = ? ORDER BY grade DESC LIMIT ? OFFSET ? ",[productId, perPage, offset]
  );
  console.log('commentData',commentData)
  
  let commentInfo = {commentData,commentTotal,totalPage}
  

  res.json({commentInfo})

})











module.exports = router