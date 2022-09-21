const express = require('express');
const pool = require('../utils/database');
const router = express.Router();


router.post('/recipeReview/:recipeId',async(req,res,next)=>{
  //確認資料有沒有收到
  console.log('review',req.body);
  //檢查userid有沒有重複
  let [review] = await pool.execute('SELECT * FROM recipe_comment WHERE user_id =? AND recipe_id = ?',[req.body.user.id, req.params.recipeId])
  console.log(review)
  if (review.length > 0){
    return res.status(400).json({message:'您已留下評論'})
  }
  if(req.body.reviewStar == 0){
    return res.status(400).json({message:'請填寫星等'})
  }
  if(req.body.review == ''){
    return res.status(400).json({message:'請填寫評論'})
  }
  let DATE = new Date().toISOString().substring(0, 10);
  console.log (DATE)
  //資料存到資料庫
  pool.execute('INSERT INTO recipe_comment (user_id,recipe_id,comment,grade,create_date,valid) VALUES(?,?,?,?,?,?)',[req.body.user.id, req.params.recipeId,req.body.review,req.body.reviewStar,DATE,1])
  //回覆前端

  res.json({message:'ok'})
})


module.exports = router;