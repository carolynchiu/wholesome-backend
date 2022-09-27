const express = require("express");
const router = express.Router();
const pool = require('../utils/database')

// 商品列表頁
router.get("/", async (req, res, next) => {

  let category = req.query.category;
  req.query.search !== undefined ? search=`%${req.query.search}%` : search='%%'; 
 
  console.log('search', search)
  let page = req.query.page || 1;
  console.log('category', category, 'page', page)

  let order = req.query.order
  console.log('order',order)
  

  //每一列表頁有幾筆資料
  const perPage = 18;

  //總筆數
  
  if (category === "植物奶" || category === "有機蔬果汁" || category === "營養點心") {
       [total] = await pool.execute(
        "SELECT COUNT(*) AS total FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.main_category = ? AND products.name LIKE ? ",
        [category, search]
      );

  } else {
       [total] = await pool.execute(
        `SELECT COUNT(*) AS total FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.sub_category = ? AND products.name LIKE ? `,
        [category, search]
      );
  }
   
  let productsTotal = total[0].total
  console.log('productsTotal',productsTotal)

  
  let totalPage = Math.ceil(productsTotal / perPage);

  // 計算offset
  const offset = perPage * (page - 1)

  if (category === "植物奶"||category === "有機蔬果汁" || category === "營養點心") {

      switch(order){
          case "價錢由高到低":
              [data] =await pool.execute(`SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.main_category = ? AND products.name LIKE ? ORDER BY products.price DESC  LIMIT ? OFFSET ?`,[category, search, perPage, offset]);
              break;
          case "價錢由低到高":
              [data] = await pool.execute( `SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.main_category = ? AND products.name LIKE ? ORDER BY products.price   LIMIT ? OFFSET ?`,[category, search, perPage, offset]);
              break;
          case "上市日期由新到舊":
              [data] = await pool.execute(`SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.main_category = ? AND products.name LIKE ? ORDER BY products.launch_time DESC  LIMIT ? OFFSET ?`,[category, search, perPage, offset])
              break;
          case "上市日期由舊到新":
              [data] = await pool.execute(`SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.main_category = ? AND products.name LIKE ? ORDER BY products.launch_time  LIMIT ? OFFSET ?`,[category, search, perPage, offset]);
              break;
          default:
              [data] = await pool.execute(
                `SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.main_category = ? AND products.name LIKE ?  LIMIT ? OFFSET ?`,
                [category, search, perPage, offset])
              break;
          }
  } else {

      switch(order){
          case "價錢由高到低":
              [data] = await pool.execute(`SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.sub_category = ? AND products.name  LIKE ? ORDER BY products.price DESC LIMIT ? OFFSET ?`,[category, search, perPage, offset]);
              break;
          case "價錢由低到高":
             [data] = await pool.execute(`SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.sub_category = ? AND products.name  LIKE ? ORDER BY products.price LIMIT ? OFFSET ?`,[category, search, perPage, offset]);
              break;
          case "上市日期由新到舊":
              [data] = await pool.execute(`SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.sub_category = ? AND products.name LIKE ?  ORDER BY products.launch_time DESC LIMIT ? OFFSET ?`,[category, search, perPage, offset]);
              break;
          case "上市日期由舊到新":
              [data] = await pool.execute( `SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.sub_category = ? AND products.name  LIKE ? LIMIT ? OFFSET ?`,[category, search, perPage, offset]);
              break;
          default:
              [data] = await pool.execute(`SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.sub_category = ? AND products.name LIKE ? LIMIT ? OFFSET ?`,[category, search, perPage, offset]);
              break;
      }
      
  }
  
  // console.log('allData',data)
  
  res.json({
      pagination:{
          productsTotal,
          perPage,
          page,
          totalPage,
      },
      data,
  })
  
});

module.exports = router;
