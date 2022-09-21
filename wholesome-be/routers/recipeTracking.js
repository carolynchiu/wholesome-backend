const express = require("express");
const router = express.Router();
const pool = require("../utils/database");

router.get('/:recipeId/:userId',async(req,res,next)=>{
let [likeData] = await pool.execute(
    'SELECT * FROM user_like_recipe WHERE user_id = ? AND recipe_id = ?',[req.params.userId,req.params.recipeId]
  )
if(likeData.length > 0){
    var likerecipe = true
}else{
    var likerecipe = false
}
  res.json(likerecipe)
})

router.post('/:recipeId',async(req,res,next)=>{
    //確認資料有沒有收到
    console.log('like',req.body);
    //檢查userid有沒有重複
    let [likeRecipe] = await pool.execute('SELECT * FROM user_like_recipe WHERE user_id =? AND recipe_id = ?',[req.body.user.id, req.params.recipeId])

    if(likeRecipe.length > 0){
        pool.execute('DELETE FROM user_like_recipe WHERE user_id =? AND recipe_id = ?',[req.body.user.id, req.params.recipeId])
    }else{
        //資料存到資料庫
        pool.execute('INSERT INTO user_like_recipe (user_id,recipe_id) VALUES(?,?)',[req.body.user.id, req.params.recipeId])
    }
    

    
    //回覆前端
  
    res.json({message:'ok'})
  })

module.exports = router;
