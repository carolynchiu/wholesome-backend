const express = require('express');
// 初始化 dotenv
require('dotenv').config();
// 利用 express 這個框架/函式庫 來建立一個 web application
const router = express.Router();
const pool = require('../utils/database');

async function getCountByGrade(recipeId, grade) {
  let [gradeCount] = await pool.execute(
    `SELECT COUNT(*) AS gradeCount FROM recipe_comment WHERE recipe_id = ? AND recipe_comment.grade = ?`,
    [recipeId, grade]
  );
  return gradeCount[0].gradeCount;
}

router.get('/:recipeId', async (req, res, next) => {
  const recipeId = req.params.recipeId;
  // 簡介
  let [introData] = await pool.execute(
    'SELECT *, recipe_category.name AS category_name FROM recipes JOIN recipe_category ON recipes.category_id = recipe_category.id WHERE recipes.id =?',
    [recipeId]
  );
  
  let [ingData] = await pool.execute(
    'SELECT recipe_ings.* ,recipes.id AS recipe_id FROM recipe_ings JOIN recipes ON recipes.id = recipe_ings.recipe_id  WHERE recipes.id =?',
    [recipeId]
  );

  let [productData]= await pool.execute(
    'SELECT recipe_ings.* ,products.*,recipes.id AS recipe_id FROM recipe_ings JOIN products ON products.id = recipe_ings.product_id JOIN recipes ON recipes.id = recipe_ings.recipe_id WHERE recipes.id =?',
    [recipeId]
  );

  let [stepsData] = await pool.execute(
    'SELECT recipe_steps.* ,recipes.id AS recipe_id FROM recipe_steps JOIN recipes ON recipes.id = recipe_steps.recipe_id WHERE recipes.id =?',
    [recipeId]
  );

  let [commentData] = await pool.execute(
    'SELECT recipe_comment.*, recipes.id AS recipe_id, users.id AS user_id,users.name AS user_name FROM recipe_comment JOIN recipes ON recipes.id = recipe_id JOIN users ON users.id = user_id  WHERE recipe_id =? ORDER BY create_date DESC',
    [recipeId]
  );

  // 總評論分
  let [gradeSum] = await pool.execute(
    'SELECT SUM (grade) AS gradeSum FROM recipe_comment WHERE recipe_id = ?',
    [recipeId]
  );
  gradeSum = gradeSum[0].gradeSum;
  //總筆數
  let [total] = await pool.execute(
    'SELECT COUNT(*) AS total FROM recipe_comment WHERE recipe_id = ?',
    [recipeId]
  );
  total = total[0].total;
  // 平均分數
  let gradeAverage = Math.round((gradeSum / total) * 2) / 2;

  // 每個星等分別多少份評分
  let gradeCount1 = await getCountByGrade(recipeId, 1);
  let gradeCount2 = await getCountByGrade(recipeId, 2);
  let gradeCount3 = await getCountByGrade(recipeId, 3);
  let gradeCount4 = await getCountByGrade(recipeId, 4);
  let gradeCount5 = await getCountByGrade(recipeId, 5);

  // 每個星等分別占多少%
  let gradePercent1 = Math.round(((gradeCount1 / total) * 10000) / 100);
  let gradePercent2 = Math.round(((gradeCount2 / total) * 10000) / 100);
  let gradePercent3 = Math.round(((gradeCount3 / total) * 10000) / 100);
  let gradePercent4 = Math.round(((gradeCount4 / total) * 10000) / 100);
  let gradePercent5 = Math.round(((gradeCount5 / total) * 10000) / 100);

  res.json({
    introData,
    ingData,
    productData,
    stepsData,
    commentData,
    starInfo: {
      gradeSum,
      total,
      gradeAverage,
    },
    gradeInfo: [
      { gradeCount: gradeCount1, gradePercent: gradePercent1 },
      { gradeCount: gradeCount2, gradePercent: gradePercent2 },
      { gradeCount: gradeCount3, gradePercent: gradePercent3 },
      { gradeCount: gradeCount4, gradePercent: gradePercent4 },
      { gradeCount: gradeCount5, gradePercent: gradePercent5 },
    ],
  });
});




module.exports = router;
