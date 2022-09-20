const pool = require("../utils/database");

//商品列表頁-大分類商品資訊

async function getMainCategoryProducts(category, search, perPage, offset) {
  let [data] = await pool.execute(
    `SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.main_category = ? AND products.name LIKE ?  LIMIT ? OFFSET ?`,
    [category, search, perPage, offset]
  );
  // console.log('data',data)
  return data;
}

// 大分類商品資訊-排序1
async function getMainCategoryProductsOrder1(
  category,
  search,
  perPage,
  offset
) {
  let [data] = await pool.execute(
    `SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.main_category = ? AND products.name LIKE ? ORDER BY products.price DESC  LIMIT ? OFFSET ?`,
    [category, search, perPage, offset]
  );
  // console.log('data',data)
  return data;
}
// 大分類商品資訊-排序2
async function getMainCategoryProductsOrder2(
  category,
  search,
  perPage,
  offset
) {
  let [data] = await pool.execute(
    `SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.main_category = ? AND products.name LIKE ? ORDER BY products.price   LIMIT ? OFFSET ?`,
    [category, search, perPage, offset]
  );
  // console.log('data',data)
  return data;
}
// 大分類商品資訊-排序3
async function getMainCategoryProductsOrder3(
  category,
  search,
  perPage,
  offset
) {
  let [data] = await pool.execute(
    `SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.main_category = ? AND products.name LIKE ? ORDER BY products.launch_time DESC  LIMIT ? OFFSET ?`,
    [category, search, perPage, offset]
  );
  // console.log('data',data)
  return data;
}
// 大分類商品資訊-排序4
async function getMainCategoryProductsOrder4(
  category,
  search,
  perPage,
  offset
) {
  let [data] = await pool.execute(
    `SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.main_category = ? AND products.name LIKE ? ORDER BY products.launch_time  LIMIT ? OFFSET ?`,
    [category, search, perPage, offset]
  );
  // console.log('data',data)
  return data;
}

//商品列表頁-大分類商品總數
async function mainAmountByProductId(category, search) {
  let [total] = await pool.execute(
    "SELECT COUNT(*) AS total FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.main_category = ? AND products.name LIKE ? ",
    [category, search]
  );
  return total[0].total;
}

//商品列表頁-小分類商品資訊
async function getSubCategoryProducts(category, search, perPage, offset) {
  let [data] = await pool.execute(
    `SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.sub_category = ? AND products.name LIKE ? LIMIT ? OFFSET ?`,
    [category, search, perPage, offset]
  );

  return data;
}

// 大分類商品資訊-排序1
async function getSubCategoryProductsOrder1(category, search, perPage, offset) {
  let [data] = await pool.execute(
    `SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.sub_category = ? AND products.name  LIKE ? ORDER BY products.price DESC LIMIT ? OFFSET ?`,
    [category, search, perPage, offset]
  );

  return data;
}

// 大分類商品資訊-排序2
async function getSubCategoryProductsOrder2(category, search, perPage, offset) {
  let [data] = await pool.execute(
    `SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.sub_category = ? AND products.name  LIKE ? ORDER BY products.price LIMIT ? OFFSET ?`,
    [category, search, perPage, offset]
  );

  return data;
}

// 大分類商品資訊-排序3
async function getSubCategoryProductsOrder3(category, search, perPage, offset) {
  let [data] = await pool.execute(
    `SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.sub_category = ? AND products.name LIKE ?  ORDER BY products.launch_time DESC LIMIT ? OFFSET ?`,
    [category, search, perPage, offset]
  );

  return data;
}

// 大分類商品資訊-排序4
async function getSubCategoryProductsOrder4(category, search, perPage, offset) {
  let [data] = await pool.execute(
    `SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.sub_category = ? AND products.name  LIKE ? LIMIT ? OFFSET ?`,
    [category, search, perPage, offset]
  );

  return data;
}

// 商品列表頁-小分類商品總數
async function subAmountByProductId(category, search) {
  let [total] = await pool.execute(
    `SELECT COUNT(*) AS total FROM products JOIN products_category on products.category_id = products_category.category_id WHERE products_category.sub_category = ? AND products.name LIKE ? `,
    [category, search]
  );
  return total[0].total;
}

module.exports = {
  getMainCategoryProducts,
  mainAmountByProductId,
  getSubCategoryProducts,
  subAmountByProductId,
  getMainCategoryProductsOrder1,
  getMainCategoryProductsOrder2,
  getMainCategoryProductsOrder3,
  getMainCategoryProductsOrder4,
  getSubCategoryProductsOrder1,
  getSubCategoryProductsOrder2,
  getSubCategoryProductsOrder3,
  getSubCategoryProductsOrder4,
};
