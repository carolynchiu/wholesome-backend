const express = require("express");
// 初始化 dotenv
require("dotenv").config();
// 利用 express 這個框架/函式庫 來建立一個 web application
const app = express();
const path = require("path");

const port = process.env.SERVER_PORT || 3002;

// 允許跨源存取
const cors = require("cors");
const corsOptions = {
  // 如果要讓 cookie 可以跨網域存取，這邊要設定 credentials
  // 且 origin 也要設定
  credentials: true,
  origin: ["http://localhost:3000"],
};
app.use(cors(corsOptions));

// 啟用 session
const expressSession = require("express-session");
var FileStore = require("session-file-store")(expressSession);
app.use(
  expressSession({
    store: new FileStore({
      // session 儲存的路徑
      path: path.join(__dirname, "..", "sessions"),
    }),
    secret: process.env.SESSION_SECRET,
    // 如果 session 沒有改變的話，要不要重新儲存一次？
    resave: false,
    // 還沒初始化的，要不要存
    saveUninitialized: false,
  })
);

// 使用資料庫
const pool = require("./utils/database");

// 如果要讓 express 認得 json，要使用這個中間件(幫你解析 payload 是不是 json)
app.use(express.json());

// 一般的中間件
app.use((req, res, next) => {
  let now = new Date();
  console.log(`有人來訪問囉 at ${now.toISOString()}`);
  next();
});

//路由中間件
// app.[method]
// method: get, post, delete, put, patch, ...
// 首頁
app.get("/", (req, res) => {
  console.log("這裡是首頁");
  res.send("Hello Wholesome");
});

//註冊、登入、登出
let authRouter = require("./routers/auth");
app.use("/api/1.0/auth", authRouter);

//會員資料
let userRouter = require("./routers/user");
app.use("/api/1.0/user", userRouter);

//訂單資料
let ordersRouter = require("./routers/orders");
app.use("/api/1.0/orders", ordersRouter);

// 商品列表
let productsRouter = require("./routers/products");
app.use("/api/1.0/products", productsRouter);

// 商品詳細
let productDetailRouter = require("./routers/productDetail");
app.use("/api/1.0/productDetail", productDetailRouter);

//404
app.use((req, res, next) => {
  console.log("發生404");
  res.sendStatus(404).send("Not Found");
});
// 啟動 server，並且開始 listen 一個 port
app.listen(port, () => {
  console.log(`server start at ${port}`);
});
