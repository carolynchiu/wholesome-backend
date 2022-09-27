const express = require("express");
const router = express.Router();
const pool = require("../utils/database");

router.get("/:recipeId/:userId", async (req, res, next) => {
  let [likeData] = await pool.execute(
    "SELECT * FROM user_like_recipe WHERE user_id = ? AND recipe_id = ?",
    [req.params.userId, req.params.recipeId]
  );
  if (likeData.length > 0) {
    var likerecipe = true;
  } else {
    var likerecipe = false;
  }
  res.json(likerecipe);
});

router.post("/:recipeId", async (req, res, next) => {
  //確認資料有沒有收到
  console.log("like11", req.body);
  //檢查有沒有重複
  let [likeRecipe] = await pool.execute(
    "SELECT * FROM user_like_recipe WHERE user_id =? AND recipe_id = ?",
    [req.body.user.id, req.params.recipeId]
  );
  if (req.body.isLike == false) {
    // 若狀態為false 刪除該筆收藏
    pool.execute(
      "DELETE FROM user_like_recipe WHERE user_id =? AND recipe_id = ?",
      [req.body.user.id, req.params.recipeId]
    );
  } else if (likeRecipe.length == 0 && req.body.isLike == true) {
    //資料存到資料庫
    pool.execute(
      "INSERT INTO user_like_recipe (user_id,recipe_id) VALUES(?,?)",
      [req.body.user.id, req.params.recipeId]
    );
  }

  //回覆前端

  res.json({ message: "ok" });
});

////// 移除收藏 -> 從資料庫移除這筆資料
router.delete("/:userId", async (req, res) => {
  let userId = req.params.userId;
  let recipeId = req.query.recipe;
  console.log("使用者ID", userId, "食譜ID", recipeId);

  // --- (1) 刪除這筆收藏
  let [data] = await pool.execute(
    "DELETE FROM `user_like_recipe` WHERE user_id = ? AND recipe_id = ?",
    [userId, recipeId]
  );
  console.log("刪除的收藏", data);

  res.json({ isLike: false });
});
module.exports = router;
