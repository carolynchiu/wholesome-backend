const express = require('express')
const router = express.Router()
const pool = require("../utils/database")


router.get('/',async (req, res, next) => {
  //調整products資料表 隨機化launch_time
  // UPDATE products SET launch_time = CURRENT_DATE - INTERVAL FLOOR(RAND() * 365) DAY
  
  // 日期最新的4筆資料
  let [productData] =  await pool.execute('SELECT * FROM `products` ORDER BY launch_time DESC LIMIT 4')

  let [recipeData] = await pool.execute('SELECT * FROM `recipes` ORDER BY create_time DESC LIMIT 4')

// console.log('newestData',data)

res.json({productData,recipeData})

})




module.exports = router;