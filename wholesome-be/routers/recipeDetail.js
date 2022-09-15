const express = require('express');
// 初始化 dotenv
require('dotenv').config();
// 利用 express 這個框架/函式庫 來建立一個 web application
const router = express.Router();
const pool = require('../utils/database');

router.get('/:recipeId', async (req, res, next) => {
  const recipeId = req.params.recipeId;
  let [introData] = await pool.execute(
    'SELECT *, recipe_category.name AS category_name FROM recipes JOIN recipe_category ON recipes.category_id = recipe_category.id WHERE recipes.id =?',
    [recipeId]
  );

  let [ingData] = await pool.execute(
    'SELECT * ,recipes.id AS recipe_id FROM recipe_ings JOIN recipes ON recipes.id = recipe_ings.recipe_id WHERE recipes.id =?',
    [recipeId]
  );

  let [stepsData] = await pool.execute(
    'SELECT * ,recipes.id AS recipe_id FROM recipe_steps JOIN recipes ON recipes.id = recipe_steps.recipe_id WHERE recipes.id =?',
    [recipeId]
  );

  let [commentData] = await pool.execute(
    'SELECT *, recipes.id AS recipe_id, users.id AS user_id FROM recipe_comment JOIN recipes ON recipes.id = recipe_id JOIN users ON users.id = user_id WHERE recipe_id =?',
    [recipeId]
  );

  // 總評論分
  let [gradeSum] = await pool.execute(
    'SELECT SUM (grade) AS gradeSum FROM recipe_comment JOIN recipes ON recipes.id = recipe_id WHERE recipes.id = ?',
    [recipeId]
  );
  gradeSum = gradeSum[0].gradeSum;
  //總筆數
  let [total] = await pool.execute(
    'SELECT COUNT(*) AS total FROM recipe_comment JOIN recipes ON recipes.id = recipe_id WHERE recipes.id = ?',
    [recipeId]
  );
  total = total[0].total;
  // 平均分數
  let gradeAverage = Math.round((gradeSum / total) * 2) / 2;

  // 每個星等分別多少份評分

  let [gradeCount1] = await pool.execute(
    `SELECT COUNT(*) AS gradeCount1 FROM recipe_comment JOIN recipes ON recipes.id = recipe_id WHERE recipes.id = ? AND recipe_comment.grade = 1`,
    [recipeId]
  );
  gradeCount1 = gradeCount1[0].gradeCount1;
  let [gradeCount2] = await pool.execute(
    `SELECT COUNT(*) AS gradeCount2 FROM recipe_comment JOIN recipes ON recipes.id = recipe_id WHERE recipes.id = ? AND recipe_comment.grade = 2`,
    [recipeId]
  );
  gradeCount2 = gradeCount2[0].gradeCount2;

  let [gradeCount3] = await pool.execute(
    `SELECT COUNT(*) AS gradeCount3 FROM recipe_comment JOIN recipes ON recipes.id = recipe_id WHERE recipes.id = ? AND recipe_comment.grade = 3`,
    [recipeId]
  );
  gradeCount3 = gradeCount3[0].gradeCount3;

  let [gradeCount4] = await pool.execute(
    `SELECT COUNT(*) AS gradeCount4 FROM recipe_comment JOIN recipes ON recipes.id = recipe_id WHERE recipes.id = ? AND recipe_comment.grade = 4`,
    [recipeId]
  );
  gradeCount4 = gradeCount4[0].gradeCount4;
  let [gradeCount5] = await pool.execute(
    `SELECT COUNT(*) AS gradeCount5 FROM recipe_comment JOIN recipes ON recipes.id = recipe_id WHERE recipes.id = ? AND recipe_comment.grade = 5`,
    [recipeId]
  );
  gradeCount5 = gradeCount5[0].gradeCount5;

  // 每個星等分別占多少%
  let gradePercent1 = Math.round(((gradeCount1 / total) * 10000) / 100);
  let gradePercent2 = Math.round(((gradeCount2 / total) * 10000) / 100);
  let gradePercent3 = Math.round(((gradeCount3 / total) * 10000) / 100);
  let gradePercent4 = Math.round(((gradeCount4 / total) * 10000) / 100);
  let gradePercent5 = Math.round(((gradeCount5 / total) * 10000) / 100);

  res.json({
    introData,
    ingData,
    stepsData,
    commentData,
    starInfo: {
      gradeSum,
      total,
      gradeAverage,
      gradeCount1,
      gradeCount2,
      gradeCount3,
      gradeCount4,
      gradeCount5,
      gradePercent1,
      gradePercent2,
      gradePercent3,
      gradePercent4,
      gradePercent5
    },
  });
});

module.exports = router;
