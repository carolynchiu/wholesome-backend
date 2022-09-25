const express = require("express");
const router = express.Router();
const pool = require("../utils/database");
const dayjs = require("dayjs");
const bcrypt = require("bcrypt"); //密碼雜湊
const { body, validationResult } = require("express-validator"); //後端驗證

const now = dayjs(new Date().toISOString()).format("YYYY-MM-DD HH:mm:ss");

// 因為有多個中間件，所以把它寫成陣列
const registerRules = [
  // 中間件 (1): 檢查 email 是否為正確格式
  body("email").isEmail().withMessage("請填寫正確的 Email 格式"),
  // 中間件 (2): 檢查密碼長度
  body("password").isLength({ min: 8 }).withMessage("密碼長度至少為 8"),
  // 中間件 (3): 檢查 password & confirmPassword 是否一致 -> 客製自己想要的條件
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
      // value 就是 confirmPassword
    })
    .withMessage("密碼驗證不一致"),
];

router.post("/register", registerRules, async (req, res) => {
  console.log("這裡是註冊頁");
  console.log(now);

  // --- (1) 確認資料有沒有收到
  console.log(req.body);

  // --- (2) 資料的驗證（後端不可以相信來自前端的資料）
  const validationError = validationResult(req);
  console.log("validationError", validationError);
  // 如果有錯誤訊息，就回覆給前端
  if (!req.body.name) {
    return res.status(400).json({ message: "請填寫姓名欄位" });
  }
  if (!req.body.email) {
    return res.status(400).json({ message: "請填寫電子信箱欄位" });
  }
  if (!req.body.phone) {
    return res.status(400).json({ message: "請填寫手機欄位" });
  }
  if (!req.body.birthday) {
    return res.status(400).json({ message: "請填寫生日欄位" });
  }
  if (!req.body.password) {
    return res.status(400).json({ message: "請填寫密碼欄位" });
  }
  if (!req.body.confirmPassword) {
    return res.status(400).json({ message: "請填寫密碼確認欄位" });
  }
  if (!validationError.isEmpty()) {
    return res.status(400).json({ errors: validationError.array() });
  }

  // --- (3) 檢查 email 有沒有重複 -> 不能重複
  let [user] = await pool.execute("SELECT * FROM users WHERE email = ?", [
    req.body.email,
  ]);

  // --- (4) 如果 user.length > 0 (代表這個 email 已存在資料庫中)，回覆 400 跟錯誤訊息
  if (user.length > 0) {
    return res.status(400).json({ message: "此 email 已註冊" });
  }

  // --- (5) 密碼要雜湊 hash
  let hashedPassword = await bcrypt.hash(req.body.password, 10);

  // --- (6) 把資料存到資料庫 (複習 SQL 語法)
  let result = await pool.execute(
    "INSERT INTO users (name, email, phone, birthday, password, create_time, valid) VALUES (?, ?, ?, ?, ?, ?, ?);",
    [
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.birthday,
      hashedPassword,
      now,
      1,
    ]
  );
  console.log("insert new user", result);
  res.json({ message: "會員註冊成功" });
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  // TODO:資料驗證
  // --- (1) 確認這個 email 有沒有註冊過
  let [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [
    req.body.email,
  ]);

  // --- (2) 如果這個帳號沒有註冊過
  if (users.length == 0) {
    return res.status(400).json({ message: "帳號或密碼錯誤" });
  }

  // --- (3) 如果有註冊過，就去比較密碼
  let user = users[0];
  console.log("user", user);
  let comparePassword = await bcrypt.compare(req.body.password, user.password);

  // --- (4) 如果密碼不對，就回覆 401
  if (!comparePassword) {
    return res.status(401).json({ message: "帳號或密碼錯誤" });
  }

  // --- (5) 密碼比對成功 -> 存在 session
  let saveUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    birthday: user.birthday,
    phone: user.phone,
    gender: user.gender,
    address: user.address,
    loginDt: new Date().toISOString(),
  };

  // 把資料寫進 session 裡
  req.session.user = saveUser;

  // --- (6) 回覆前端登入成功
  res.json(saveUser);
});

router.get("/logout", (req, res, next) => {
  req.session.user = null;
  res.json({ message: "登出成功" });
});

module.exports = router;
