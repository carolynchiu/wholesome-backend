const express = require('express');
// 初始化 dotenv
require('dotenv').config();
// 利用 express 這個框架/函式庫 來建立一個 web application
const router = express.Router();
const pool = require('../utils/database');

//列表頁
router.get('/:category', async (req, res, next) => {
  let category = req.params.category;
  // 分頁資料
  let page = req.query.page || 1;
  // console.log(page,category);
  const perPage = 6;
  let [total] = await pool.execute(
    'SELECT COUNT(*) AS total FROM recipes JOIN recipe_category ON recipes.category_id = recipe_category.id WHERE recipe_category.name= ?',
    [category]
  );
  total = total[0].total;

  //總頁數
  let lastPage = Math.ceil(total / perPage);

  const offset = perPage * (page - 1);

  // 分類資料
  console.log(page);
  let [data] = await pool.execute(
    'SELECT recipes.*, recipes.id AS recipe_id,recipe_category.name AS category_name FROM recipes JOIN recipe_category ON recipes.category_id = recipe_category.id WHERE recipe_category.name= ? ORDER BY create_time LIMIT ? OFFSET ?',
    [category, perPage, offset]
  );
  let [dataAll] = await pool.execute(
    'SELECT recipes.*, recipes.id AS recipe_id,recipe_category.name AS category_name FROM recipes JOIN recipe_category ON recipes.category_id = recipe_category.id '
  );
  //資料給前端

  res.json({
    pagination: {
      total,
      perPage,
      page,
      lastPage,
    },
    data,
    dataAll
  });
});

module.exports = router;
