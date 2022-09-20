const express = require('express');
const router = express.Router();


router.post('/recipeReview/${recipeId}',async(req,res,next)=>{
  //確認資料有沒有收到
  //檢查userid有沒有重複
  //資料存到資料庫
  //回覆前端

  res.json({})
})


module.exports = router;