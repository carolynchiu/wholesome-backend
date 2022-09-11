const express = require("express");
const router = express.Router();

// 登入後才可以使用
router.get("/", (req, res) => {
  // --- (1) 判斷這個人是否已經登入？
  // session 裡如果沒有 user 這個資料，表示沒有登入過
  if (!req.session.user) {
    return res.status(401).json({ message: "尚未登入" });
  }

  // --- (2) 可以直接回覆 session 裡的資料
  // Note: 如果有提供修改會員資料功能，更新成功後，要去更新 session
  res.json(req.session.user);
});

module.exports = router;
