const express = require("express");
const router = express.Router();
const pool = require("../utils/database");
const { body, validationResult } = require("express-validator"); //後端驗證
const session = require("express-session");
const bcrypt = require("bcrypt"); //密碼雜湊
const dayjs = require("dayjs");
const now = dayjs(new Date().toISOString()).format("YYYY-MM-DD HH:mm:ss");

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
  let compareResult = await bcrypt.compare(req.body.password, currentPassword);
  console.log(compareResult);
  // 如果不對，回覆前端
  if (!compareResult) {
    return res.status(401).json({ message: "目前密碼輸入錯誤" });
  }
  // --- (4) TODO: 比較 newPasswword, confirmNewPassword
  if (req.body.newPassword.length < 8) {
    return res.status(401).json({ message: "新密碼長度不可小於8" });
  }
  if (req.body.newPassword !== req.body.confirmNewPassword) {
    return res.status(401).json({ message: "新密碼輸入不一致" });
  }
  // --- (5) 密碼要雜湊 hash
  let hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
  console.log("雜湊過的新密碼", hashedPassword);
  // --- (6) 把資料存到資料庫
  let result = await pool.execute("UPDATE users SET password=? WHERE id=?", [
    hashedPassword,
    userId,
  ]);
  console.log("insert new user", result);
  res.json({ message: "密碼更新成功" });
});

// 取得會員所有訂單資料
router.get("/:userId/orders", async (req, res) => {
  let userId = req.params.userId;
  let page = req.query.page || 1;
  console.log("userId: ", userId, ", page: ", page);

  // 一頁幾筆
  const perPage = 5;

  // --- 1. 分頁 TODO: 取得總筆數
  let [total] = await pool.execute(
    "SELECT COUNT(*) AS total FROM order_list WHERE user_id=?",
    [userId]
  );
  total = total[0].total;
  console.log("total", total);

  // --- 2. 分頁 TODO: 計算總頁數 -> 從 total 與 perPage 算出總頁數 lastPage
  // (hint: Math.ceil 無條件進位) <---> Math.floor 無條件捨去
  const lastPage = Math.ceil(total / perPage);
  console.log("lastPage", lastPage);

  // --- 3. 分頁 TODO: 計算 offset (要跳過幾筆)
  const offset = perPage * (page - 1);
  console.log("offset", offset);

  // --- (2) 列出使用者訂單資料
  let [data] = await pool.execute(
    "SELECT order_list.*, order_status.name AS order_status FROM order_list LEFT OUTER JOIN order_status ON order_list.status_id = order_status.id WHERE order_list.user_id=? ORDER BY order_list.create_time DESC LIMIT ? OFFSET ?",
    [userId, perPage, offset]
  );
  // console.log(data);

  res.json({
    pagination: {
      total, // 總共有幾筆
      perPage, // 一頁有幾筆
      page, // 目前在第幾頁
      lastPage, // 總頁數
    },
    data,
  });
});

// 新增會員優惠券資料
router.post("/:userId/coupon", async (req, res) => {
  // --- (1) 確認資料有沒有收到
  console.log("req.body", req.body);
  let userId = req.params.userId;
  console.log("userId: ", userId);
  let discountCode = req.body.discount_code.toUpperCase();
  console.log(discountCode);
  // --- (2) 檢查資料庫是否有這張優惠券
  let [coupon] = await pool.execute(
    "SELECT * FROM coupons WHERE discount_code = ?",
    [discountCode]
  );
  console.log(coupon);
  let couponId = coupon[0].id;
  //如果沒有優惠券回覆錯誤
  if (coupon.length === 0) {
    return res.status(400).json({ message: "優惠券代碼輸入錯誤" });
  }
  // --- (3)檢查使用者是否領過這張優惠券
  let [userCoupon] = await pool.execute(
    "SELECT * FROM coupons_get WHERE user_id=? AND coupon_id=?",
    [userId, couponId]
  );
  if (userCoupon.length > 0) {
    return res.status(400).json({ message: "您已領過此優惠券" });
  }
  // --- (4) 把資料存到資料庫 (複習 SQL 語法)
  let result = await pool.execute(
    "INSERT INTO coupons_get (user_id, coupon_id, get_time) VALUES (?,?,?)",
    [userId, couponId, now]
  );

  res.json({ message: "優惠券新增成功" });
});
module.exports = router;
