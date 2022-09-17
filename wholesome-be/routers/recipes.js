const express = require('express');
// 初始化 dotenv
require('dotenv').config();
// 利用 express 這個框架/函式庫 來建立一個 web application
const router = express.Router();
const pool = require('../utils/database');

//列表頁
router.get('/:category', async (req, res, next) => {
  let category = req.params.category;
  let search = req.query.search;
  let sort = req.query.sorts;
  
  
  // 分頁資料
  let page = req.query.page || 1;
  const perPage = 6;
  let totalSql =
    'SELECT COUNT(*) AS total FROM recipes JOIN recipe_category ON recipes.category_id = recipe_category.id WHERE';
  let totalParams = [];
  if (!search) {
    totalSql = totalSql + ' recipe_category.name= ?';
    totalParams.push(category);
  } else {
    totalSql = totalSql + ` recipes.title like ?`;
    totalParams.push(`%${search}%`);
  }
  let [total] = await pool.execute(totalSql, totalParams);
  total = total[0].total;
  let lastPage = Math.ceil(total / perPage);

  const offset = perPage * (page - 1);

  // 分類資料
  console.log(page);
  let sortDirect = sort;
  let dataSql =
    'SELECT recipes.*, recipes.id AS recipe_id,recipe_category.name AS category_name FROM recipes JOIN recipe_category ON recipes.category_id = recipe_category.id WHERE';
  let dataParams = [];
  if (!search) {
    dataSql = dataSql + ' recipe_category.name= ?';
    dataParams.push(category);
  } else {
    dataSql = dataSql + ' recipes.title like ?';
    dataParams.push(`%${search}%`);
  }
  dataSql = dataSql + ` ORDER BY create_time ${sortDirect} LIMIT ? OFFSET ?`;
  // dataParams.push(sortDirect);
  dataParams.push(perPage);
  dataParams.push(offset);
  let [data] = await pool.query(dataSql, dataParams);

  //資料給前端

  res.json({
    pagination: {
      total,
      perPage,
      page,
      lastPage,
    },
    data,
  });
});

module.exports = router;
