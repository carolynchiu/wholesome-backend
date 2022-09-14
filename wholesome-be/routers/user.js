const { compareSync } = require("bcrypt");
const express = require("express");
const router = express.Router();
const pool = require("../utils/database");
const { body, validationResult } = require("express-validator"); //後端驗證
const session = require("express-session");

const editRules = [
  // 中間件 (1): 檢查 email 是否為正確格式
  body("email").isEmail().withMessage("請填寫正確的 Email 格式"),
];

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

// 更新會員資料
router.put("/:userId", editRules, async (req, res) => {
  // --- (1) 確認資料有沒有收到
  console.log("req.body", req.body);
  let userId = req.params.userId;

  // --- (2) 資料的驗證（後端不可以相信來自前端的資料）
  const validationError = validationResult(req);
  console.log("validationError", validationError);
  // 如果有錯誤訊息，就回覆給前端
  if (!validationError.isEmpty()) {
    return res.status(400).json({ errors: validationError.array() });
  }
  // --- (3) 把資料更新到資料庫 (複習 SQL 語法)
  // 不用更改 email, birthday
  let result = await pool.execute(
    "UPDATE users SET name=?, phone=?, address=?, gender=? WHERE id=?",
    [req.body.name, req.body.phone, req.body.address, req.body.gender, userId]
  );
  console.log("update user", result);

  // --- (4) 更新 sessions
  // let updateUser = {
  //   id: user.id,
  //   name: user.name,
  //   email: user.email,
  //   birthday: user.birthday,
  //   phone: user.phone,
  //   gender: user.gender,
  //   address: user.address,
  //   loginDt: new Date().toISOString(),
  // };
  let updateUser = req.body;
  req.session.user = { ...req.session.user, ...updateUser };
  // --- (5) 更新成功回覆前端
  res.json(req.session.user);
});

// 更新會員密碼
router.put("/:userId/modifyPassword", async (req, res) => {
  // --- (1) 確認資料有沒有收到
  console.log("req.body", req.body);
  let userId = req.params.userId;
  console.log(`修改會員${userId}的密碼`);

  // --- (2) TODO:取得資料庫的密碼
  let [password] = await pool.execute(
    "SELECT password FROM users WHERE id = ?",
    [userId]
  );
  let currentPassword = password[0].password;
  console.log(currentPassword);

  // --- (3) TODO:比較資料庫跟req.body的密碼
  // --- (4) TODO:資料的驗證
  res.json({});
});

// 取得會員所有訂單資料
router.get("/:userId/orders", async (req, res) => {
  let userId = req.params.userId;
  console.log(userId);

  // --- (2) 列出使用者訂單資料
  let [data] = await pool.execute(
    "SELECT order_list.*, order_status.name AS order_status FROM order_list LEFT OUTER JOIN order_status ON order_list.status_id = order_status.id WHERE order_list.user_id=?",
    [userId]
  );
  console.log(data);

  res.json(data);
});

module.exports = router;
